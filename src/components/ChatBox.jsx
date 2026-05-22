import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { socket } from "../services/socket";
import toast from "react-hot-toast";

export default function ChatBox() {
  const { messages, chatId, selectedUser } = useSelector((s) => s.chat);
  const [text, setText] = useState("");
  const [callStatus, setCallStatus] = useState("idle");
  const [callType, setCallType] = useState(null);
  const [callId, setCallId] = useState(null);
  const [incomingCaller, setIncomingCaller] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const endRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const currentUserId = currentUser?._id;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Safety net: Attach local stream as soon as the video element mounts
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callStatus]);

  // Safety net: Attach remote stream as soon as the video element mounts
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callStatus]);

  useEffect(() => {
    const handleIncomingCall = (data) => {
      setCallId(data.callId);
      setCallType(data.callType);
      setIncomingCaller({ id: data.callerId, name: data.callerName });
      setCallStatus("incoming");
      toast.success(`Incoming ${data.callType} call from ${data.callerName}`);
    };

    const handleAcceptCall = (data) => {
      if (data.callId !== callId) return;
      setCallStatus("connecting");
      createOffer();
    };

    const handleRejectCall = (data) => {
      if (data.callId !== callId) return;
      toast.error("Call rejected");
      cleanupCall();
    };

    const handleOffer = async (data) => {
      if (data.callId !== callId) return;
      setCallStatus("connecting");
      await acceptOffer(data.signal);
    };

    const handleAnswer = async (data) => {
      if (data.callId !== callId) return;
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(data.signal);
      }
      setCallStatus("in-call");
    };

    const handleIceCandidate = async (data) => {
      if (data.callId !== callId || !peerRef.current) return;
      try {
        const candidate = new RTCIceCandidate(data.signal);
        await peerRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.warn("ICE add failed", err);
      }
    };

    const handleEndCall = (data) => {
      if (data.callId !== callId) return;
      toast(`Call ended${data.reason === "peer_disconnected" ? " (peer disconnected)" : ""}`);
      cleanupCall();
    };

    const handleCallTimeout = (data) => {
      if (data.callId !== callId) return;
      toast.error("Call timed out: no answer");
      cleanupCall();
    };

    const handleUserBusy = (data) => {
      if (data.callId && data.callId !== callId) return;
      toast.error("User is busy");
      cleanupCall();
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("accept-call", handleAcceptCall);
    socket.on("reject-call", handleRejectCall);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("end-call", handleEndCall);
    socket.on("call-timeout", handleCallTimeout);
    socket.on("user-busy", handleUserBusy);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("accept-call", handleAcceptCall);
      socket.off("reject-call", handleRejectCall);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("end-call", handleEndCall);
      socket.off("call-timeout", handleCallTimeout);
      socket.off("user-busy", handleUserBusy);
    };
  }, [callId, currentUserId]);

  const stunServers = [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
  ];

  const turnUrls = import.meta.env.VITE_TURN_URLS
    ? import.meta.env.VITE_TURN_URLS.split(",").map((url) => url.trim()).filter(Boolean)
    : [];
  const turnUsername = import.meta.env.VITE_TURN_USERNAME || undefined;
  const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL || undefined;

  const ICE_SERVERS = [
    { urls: stunServers },
    ...(turnUrls.length
      ? [{ urls: turnUrls, username: turnUsername, credential: turnCredential }]
      : []),
  ];

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: "all",
      iceCandidatePoolSize: 10,
    });

    pc.onicecandidate = (event) => {
      if (!event.candidate || !callId) return;
      socket.emit("ice-candidate", {
        callId,
        signal: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
      });
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(() => {});
      }
    };

    return pc;
  };

  const getLocalMedia = async (type) => {
    const needsVideo = type === "video";
    const hasVideoTrack = localStream?.getVideoTracks().length > 0;

    if (localStream && (!needsVideo || hasVideoTrack)) return localStream;

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: needsVideo,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }
      return stream;
    } catch (err) {
      toast.error("Unable to access microphone/camera");
      cleanupCall();
      throw err;
    }
  };

  const cleanupCall = () => {
    setCallStatus("idle");
    setCallType(null);
    setCallId(null);
    setIncomingCaller(null);
    setRemoteStream(null);

    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  const send = () => {
    if (!text.trim()) return;

    if (!chatId) {
      console.log("❌ chatId missing");
      return;
    }

    socket.emit("send_message", {
      chatId,
      message: text,
      receiverId: selectedUser._id,
    });

    setText("");
  };

  const startCall = async (type) => {
    if (!selectedUser?._id) return;
    setCallType(type);
    setCallStatus("calling");

    socket.emit(
      "call-user",
      {
        targetUserId: selectedUser._id,
        callType: type,
      },
      (response) => {
        if (response?.status === "error") {
          toast.error(response.message || "Call failed");
          cleanupCall();
          return;
        }

        setCallId(response?.data?.callId || null);
      }
    );
  };

  const acceptCall = async () => {
    if (!callId) return;
    socket.emit("accept-call", { callId }, (response) => {
      if (response?.status === "error") {
        toast.error(response.message || "Unable to accept call");
        cleanupCall();
      } else {
        setCallStatus("connecting");
      }
    });
  };

  const rejectCall = () => {
    if (!callId) return;
    socket.emit("reject-call", { callId }, (response) => {
      if (response?.status === "error") {
        toast.error(response.message || "Unable to reject call");
      }
      cleanupCall();
    });
  };

  const createOffer = async () => {
    if (!callId) return;
    const stream = await getLocalMedia(callType);
    const pc = createPeerConnection();
    peerRef.current = pc;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("offer", { callId, signal: offer }, (response) => {
      if (response?.status === "error") {
        toast.error(response.message || "Offer failed");
        cleanupCall();
      }
    });
  };

  const acceptOffer = async (signal) => {
    if (!callId) return;
    const stream = await getLocalMedia(callType);
    const pc = createPeerConnection();
    peerRef.current = pc;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(signal);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer", { callId, signal: answer }, (response) => {
      if (response?.status === "error") {
        toast.error(response.message || "Answer failed");
        cleanupCall();
      } else {
        setCallStatus("in-call");
      }
    });
  };

  const endCall = () => {
    if (callId) {
      socket.emit("end-call", { callId }, (response) => {
        if (response?.status === "error") {
          toast.error(response.message || "Unable to end call");
        }
      });
    }
    cleanupCall();
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted app-surface">
        <div className="bg-white px-6 py-3 rounded-full shadow-sm">
          Select a user to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 chat-bg h-screen relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-carbon.png')] bg-repeat z-0"></div>

      <div className="px-4 py-3 flex flex-col gap-3 chat-header z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-[16px]">{selectedUser.name}</div>
              {callStatus !== "idle" && (
                <div className="text-xs text-muted mt-1">
                  {callStatus === "incoming" && `Incoming ${callType} call`}
                  {callStatus === "calling" && `Calling ${selectedUser.name}...`}
                  {callStatus === "connecting" && "Connecting..."}
                  {callStatus === "in-call" && `In call (${callType})`}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startCall("audio")}
              className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Audio
            </button>
            <button
              onClick={() => startCall("video")}
              className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Video
            </button>
          </div>
        </div>

        {callStatus === "incoming" && incomingCaller && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Incoming {callType} call</div>
              <div className="text-xs text-muted">{incomingCaller.name} is calling you</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={acceptCall}
                className="rounded-full bg-green-600 px-4 py-2 text-white text-sm font-semibold"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="rounded-full bg-red-500 px-4 py-2 text-white text-sm font-semibold"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {callStatus !== "idle" && callStatus !== "incoming" && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-4">
            <div className="text-sm text-slate-700">
              {callStatus === "calling" && `Calling ${selectedUser.name}...`}
              {callStatus === "connecting" && "Establishing connection..."}
              {callStatus === "in-call" && `Connected with ${selectedUser.name}`}
            </div>
            <button
              onClick={endCall}
              className="rounded-full bg-red-500 px-4 py-2 text-white text-sm font-semibold"
            >
              End Call
            </button>
          </div>
        )}
      </div>

      {callStatus !== "idle" && (
        <div className="px-4 pb-3 z-10 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-black overflow-hidden min-h-[180px] relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                You
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-black overflow-hidden min-h-[180px] relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                {selectedUser.name}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((m, i) => {
          const senderId =
            typeof m.senderId === "object" ? m.senderId?._id : m.senderId;
          const isMe = String(senderId) === String(currentUserId);

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[75%] md:max-w-[65%] px-2.5 py-1.5 rounded-lg text-[15px] shadow-sm flex flex-col ${
                  isMe
                    ? "msg-sent rounded-tr-none"
                    : "msg-recv rounded-tl-none"
                }`}
              >
                {!isMe && m.senderId?.name && (
                  <span className="text-[12px] font-medium text-[#4a90e2] mb-0.5">
                    {m.senderId.name}
                  </span>
                )}
                <div className="flex flex-wrap items-end gap-2">
                  <span className="break-words max-w-full">{m.message}</span>
                  <span className="text-[11px] text-muted ml-auto min-w-fit mt-1">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-3 flex items-center gap-3 chat-input z-10">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 p-2.5 px-4 rounded-lg bg-white text-gray-900 outline-none text-[15px] placeholder:text-muted border border-[var(--border)]"
          placeholder="Type a message"
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="p-2.5 primary-btn rounded-full font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

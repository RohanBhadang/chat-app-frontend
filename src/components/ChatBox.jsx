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
      <section className="flex-1 flex flex-col items-center justify-center bg-background text-on-surface-variant">
        <div className="glass-panel px-8 py-4 rounded-2xl flex flex-col items-center gap-4 animate-pulse">
          <span className="material-symbols-outlined text-4xl text-primary">chat_bubble</span>
          <p className="font-medium">Select a conversation to begin</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-background relative overflow-hidden">
      {/* Chat Header */}
      <header className="h-20 px-8 flex items-center justify-between glass-panel border-0 border-b border-white/10 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase border border-white/10">
              {selectedUser.name.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface-dim rounded-full"></span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface font-headline-md">{selectedUser.name}</h3>
            <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">
               {callStatus === "idle" ? "Active Now" : callStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => startCall("audio")} className="p-3 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">call</span>
          </button>
          <button onClick={() => startCall("video")} className="p-3 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">videocam</span>
          </button>
          <button className="p-3 rounded-full hover:bg-white/5 text-on-surface-variant transition-all">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 flex flex-col">
        {messages.map((m, i) => {
          const senderId = typeof m.senderId === "object" ? m.senderId?._id : m.senderId;
          const isMe = String(senderId) === String(currentUserId);
          return (
            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-1`}>
              <div className={`max-w-[80%] p-4 rounded-xl text-sm ${
                isMe 
                ? "bg-primary text-on-primary rounded-br-none active-glow" 
                : "glass-panel text-on-surface rounded-bl-none"
              }`}>
                {m.message}
              </div>
              <span className="text-[10px] text-on-surface-variant opacity-40 px-1">
                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Chat Input */}
      <footer className="p-8 pt-0 z-10">
        <div className="glass-panel rounded-2xl p-2 flex items-center gap-2">
          <button className="p-3 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface text-sm px-2 outline-none"
            placeholder="Type your message..."
            type="text"
          />
          <button onClick={send} className="bg-primary text-on-primary w-12 h-12 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
          </button>
        </div>
      </footer>

      {/* Call Overlays */}
      {(callStatus === "incoming" || callStatus === "calling" || callStatus === "connecting" || callStatus === "in-call") && (
        <div className="absolute inset-0 z-[100] bg-surface-dim/80 backdrop-blur-2xl flex flex-col items-center justify-center p-8">
          {callStatus === "in-call" && callType === "video" ? (
            <div className="w-full h-full flex flex-col gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-2xl overflow-hidden relative">
                   <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                   <div className="absolute bottom-4 left-4 glass-panel px-3 py-1 rounded-full text-xs">You</div>
                </div>
                <div className="glass-panel rounded-2xl overflow-hidden relative">
                   <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                   <div className="absolute bottom-4 left-4 glass-panel px-3 py-1 rounded-full text-xs">{selectedUser.name}</div>
                </div>
              </div>
              <div className="flex justify-center gap-4 pb-8">
                 <button onClick={endCall} className="w-16 h-16 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                    <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>call_end</span>
                 </button>
              </div>
            </div>
          ) : (
            <>
              <div className="ringing-pulse w-48 h-48 rounded-full border-4 flex items-center justify-center mb-8 p-2">
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold uppercase">
                  {callStatus === "incoming" ? incomingCaller?.name?.charAt(0) : selectedUser.name.charAt(0)}
                </div>
              </div>
              <div className="text-center space-y-2 mb-12">
                <h2 className="text-4xl font-bold text-on-surface">
                  {callStatus === "incoming" ? incomingCaller?.name : selectedUser.name}
                </h2>
                <p className="text-lg text-primary animate-pulse uppercase tracking-widest font-bold">
                  {callStatus === "incoming" ? `Incoming ${callType} Call...` : 
                   callStatus === "calling" ? "Calling..." : "Connecting..."}
                </p>
              </div>
              <div className="flex gap-8">
                {callStatus === "incoming" ? (
                  <>
                    <button onClick={rejectCall} className="w-20 h-20 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>call_end</span>
                    </button>
                    <button onClick={acceptCall} className="w-20 h-20 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>videocam</span>
                    </button>
                  </>
                ) : (
                  <button onClick={endCall} className="w-20 h-20 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                    <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>call_end</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

import { useEffect, useRef } from "react";
import { socket } from "../services/socket";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/chatSlice";
import toast from "react-hot-toast";

export default function useSocket() {
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.chat.chatId);

  const currentChatRef = useRef(null);

  // keep latest chat id
  useEffect(() => {
    currentChatRef.current = currentChatId;
  }, [currentChatId]);

  // 🔊 SAFE SOUND FUNCTION (NEW ADD ONLY)
  const playSound = () => {
    const audio = new Audio("/sounds/msg.mp3");
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    // cleanup old listeners
    socket.off("receive_message");
    socket.off("new_notification");

    // 📩 MESSAGE EVENT (ACTIVE CHAT)
   
    socket.on("receive_message", (data) => {
      console.log("📩 Received:", data);

      if (String(data.chatId) === String(currentChatRef.current)) {
        dispatch(addMessage(data));
      }
    });


    // 🔔 NOTIFICATION EVENT
    
    socket.on("new_notification", (data) => {
      const activeChat = currentChatRef.current;

      // 👉 same chat open → ignore
      if (String(data.chatId) === String(activeChat)) return;

      console.log("🔥 Notification:", data);

      // 🔊 SOUND (ONLY ADDITION)
      playSound();

      // 🍞 TOAST (UNCHANGED LOGIC, ONLY CLEAN USAGE)
      toast.success(
        `${data.senderName || "New Message"}: ${data.message}`,
        {
          duration: 5000,
        }
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("new_notification");
    };
  }, []);
}
import { useEffect } from "react";
import { socket } from "../services/socket";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import { addMessage } from "../redux/chatSlice";

export default function useSocket() {
  const dispatch = useDispatch();

  const currentChatId = useSelector(
    (state) => state.chat.chatId
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    // 🔥 THIS IS MISSING PIECE
    socket.on("receive_message", (data) => {
      console.log("📩 Received:", data);
      if(data.chatId === currentChatId){
      dispatch(addMessage(data));
      }

    });

    return () => {
      socket.off("receive_message");
      // socket.disconnect();
    };
  }, [currentChatId]);
}
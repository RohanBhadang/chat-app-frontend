import { useEffect, useRef } from "react";
import { socket } from "../services/socket";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { addMessage } from "../redux/chatSlice";
import toast from "react-hot-toast";
export default function useSocket() {

  const dispatch = useDispatch();

  const currentChatId = useSelector(
    (state) => state.chat.chatId
  );

  // NEW
  const currentChatRef =
    useRef(null);

  // NEW
  useEffect(() => {

    currentChatRef.current =
      currentChatId;

  }, [currentChatId]);

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) return;

    socket.auth = { token };

    socket.connect();

    socket.on("connect", () => {

      console.log(
        "🟢 Connected:",
        socket.id
      );
    });

    socket.off("receive_message");

    // message listener
    socket.on(
      "receive_message",
      (data) => {

        console.log(
          "📩 Received:",
          data
        );

        if (
          data.chatId === currentChatId
        ) {

          dispatch(
            addMessage(data)
          );
        }
      }
    );

    socket.off("new_notification");

    // NEW NOTIFICATION LISTENER
    socket.on(
      "new_notification",
      (data) => {

        // same chat already open
        if (
          String(data.chatId) ===
          String(
            currentChatRef.current
          )
        ) {
          return;
        }

        console.log(
          "🔥 NEW NOTIFICATION:",
          data
        );

        console.log(
          "SHOW POPUP"
        );
        toast.success(
      `${data.senderName || "New Message"}: ${data.message}`
    );

      }
    );

    return () => {

      socket.off(
        "receive_message"
      );

      socket.off(
        "new_notification"
      );

      // socket.disconnect();
    };

  }, [currentChatId]);
}
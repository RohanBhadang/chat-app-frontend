import { useSelector } from "react-redux";
import { useState } from "react";
import { socket } from "../services/socket";

export default function ChatBox() {
  const { messages, chatId, selectedUser } = useSelector(
    (s) => s.chat
  );

  const [text, setText] = useState("");

  const currentUserId = JSON.parse(
    atob(localStorage.getItem("token")?.split(".")[1])
  )?.userId;

  // 📤 SEND MESSAGE
  const send = () => {
    if (!text.trim()) return;

    if (!chatId) {
      console.log("❌ chatId missing");
      return;
    }

    socket.emit("send_message", {
      chatId,
      message: text,
    });

    setText("");
  };

  // ❌ no user selected
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#0b141a]">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#0b141a] text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700 font-semibold">
        {selectedUser.name}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => {
          const isMe =
            m.senderId?._id === currentUserId ||
            m.senderId === currentUserId;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  isMe
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                {!isMe && (
                  <div className="text-xs text-gray-300 mb-1">
                    { selectedUser.name || "User"}
                  </div>
                )}

                <div>{m.message}</div>

                <div className="text-[10px] text-right mt-1 opacity-70">
                  {m.createdAt &&
                    new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="p-3 flex border-t border-gray-700">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 text-white outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={send}
          className="bg-green-500 px-4 ml-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
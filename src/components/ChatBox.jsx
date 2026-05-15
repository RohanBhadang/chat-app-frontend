// import { useSelector } from "react-redux";
// import { useState, useRef, useEffect } from "react";
// import { socket } from "../services/socket";

// export default function ChatBox() {
//   const { messages, chatId, selectedUser } = useSelector((s) => s.chat);
//   const [text, setText] = useState("");

//   const currentUserId = JSON.parse(
//     atob(localStorage.getItem("token")?.split(".")[1])
//   )?.userId;

//   const endRef = useRef(null);

//   // auto scroll
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const send = () => {
//     if (!text.trim()) return;

//     if (!chatId) {
//       console.log("❌ chatId missing");
//       return;
//     }

//     socket.emit("send_message", {
//       chatId,
//       message: text,
//       receiverId: selectedUser._id,
//     });

    
//     setText("");
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-[#8696a0] bg-[#222e35]">
//         <div className="bg-[#111b21] px-6 py-3 rounded-full shadow-sm">
//           Select a user to start chatting
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col flex-1 bg-[#0b141a] h-screen relative">
//       {/* BACKGROUND PATTERN (Optional WhatsApp like feel) */}
//       <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat z-0"></div>

//       {/* HEADER */}
//       <div className="px-4 py-3 flex items-center bg-[#202c33] z-10">
//         <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
//           {selectedUser.name.charAt(0).toUpperCase()}
//         </div>
//         <div className="text-[#e9edef] font-medium text-[16px]">
//           {selectedUser.name}
//         </div>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2 z-10 scrollbar-thin scrollbar-thumb-[#374045] scrollbar-track-transparent">
//         {messages.map((m, i) => {
//           // const isMe =
//           //   m.senderId?._id === currentUserId || m.senderId === currentUserId;
//              const senderId =
//              typeof m.senderId === "object"
//               ? m.senderId?._id
//              : m.senderId;

// const isMe =
//   String(senderId) === String(currentUserId);
          
//           return (
//             <div
//               key={i}
//               className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`relative max-w-[75%] md:max-w-[65%] px-2.5 py-1.5 rounded-lg text-[15px] shadow-sm flex flex-col ${
//                   isMe
//                     ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
//                     : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
//                 }`}
//               >
//                 {/* sender name (only for others in groups, you can keep or remove this if it's 1-on-1) */}
//                 {!isMe && m.senderId?.name && (
//                 <span className="text-[12px] font-medium text-[#53bdeb] mb-0.5">
//                  {m.senderId.name}
//                  </span>
//                 )}

//                 {/* message text and time container */}
//                 <div className="flex flex-wrap items-end gap-2">
//                   <span className="break-words max-w-full text-[#e9edef]">
//                     {m.message}
//                   </span>

//                   {/* time */}
//                   <span className="text-[11px] text-[#8696a0] ml-auto min-w-fit mt-1">
//                     {m.createdAt
//                       ? new Date(m.createdAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })
//                       : ""}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* auto scroll anchor */}
//         <div ref={endRef} />
//       </div>

//       {/* INPUT */}
//       <div className="px-4 py-3 flex items-center gap-3 bg-[#202c33] z-10">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && send()}
//           className="flex-1 p-2.5 px-4 rounded-lg bg-[#2a3942] text-[#e9edef] outline-none text-[15px] placeholder-[#8696a0]"
//           placeholder="Type a message"
//         />
//         <button
//           onClick={send}
//           disabled={!text.trim()}
//           className="p-2.5 bg-[#00a884] text-[#111b21] rounded-full font-bold hover:bg-[#00c298] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//         >
//           <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
//             <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }

import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { socket } from "../services/socket";

export default function ChatBox() {
  const { messages, chatId, selectedUser } = useSelector((s) => s.chat);
  const [text, setText] = useState("");

  const currentUserId = JSON.parse(
    atob(localStorage.getItem("token")?.split(".")[1])
  )?._id;

  const endRef = useRef(null);

  // auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      {/* BACKGROUND PATTERN (subtle light feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-carbon.png')] bg-repeat z-0"></div>

      {/* HEADER */}
      <div className="px-4 py-3 flex items-center chat-header z-10">
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {selectedUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="font-medium text-[16px]">
          {selectedUser.name}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((m, i) => {
           const senderId =
             typeof m.senderId === "object"
              ? m.senderId?._id
             : m.senderId;
          let isMe = String(senderId) === String(currentUserId) ? true : false;
          // console.log("senderId:", m.senderId, "currentUserId:", currentUserId, "isMe:", isMe);
 
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
                {/* sender name (only for others in groups, you can keep or remove this if it's 1-on-1) */}
                {!isMe && m.senderId?.name && (
                <span className="text-[12px] font-medium text-[#4a90e2] mb-0.5">
                 {m.senderId.name}
                 </span>
                )}

                {/* message text and time container */}
                <div className="flex flex-wrap items-end gap-2">
                  <span className="break-words max-w-full">
                    {m.message}
                  </span>

                  {/* time */}
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

        {/* auto scroll anchor */}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
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
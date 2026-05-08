import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedUser,
  setChatId,
  setMessages,
} from "../redux/chatSlice";
import API from "../services/api";
import { socket } from "../services/socket";

export default function Sidebar() {
  const { users } = useSelector((s) => s.chat);
  const dispatch = useDispatch();

  const selectUser = async (user) => {
    try {
      // 🔹 1. create chat
      const res = await API.post("/chat/create-one-to-one", {
        recipientId: user._id,
      });

      const chatId = res.data.chatId;

      dispatch(setSelectedUser(user));
      dispatch(setChatId(chatId));

      // 🔹 2. join socket room
      socket.emit("join_chat", chatId);

      // 🔹 3. load old messages
      const msgs = await API.get(`/chat/${chatId}`);
      dispatch(setMessages(msgs.data.data));
    } catch (err) {
      console.log("Select user error", err);
    }
  };

  return (
    <div className="w-1/4 bg-[#111b21] text-white overflow-y-auto">
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => selectUser(u)}
          className="p-3 cursor-pointer hover:bg-gray-700 border-b border-gray-700"
        >
          {u.name}
        </div>
      ))}
    </div>
  );
}
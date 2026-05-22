import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setChatId, setMessages } from "../redux/chatSlice";
import API from "../services/api";
import { socket } from "../services/socket";

export default function Sidebar() {
  const { users, selectedUser } = useSelector((s) => s.chat);
  const dispatch = useDispatch();

  const selectUser = async (user) => {
    try {
      const res = await API.post(`/chat/create-one-to-one/${user._id}`);
      const chatId = res.data.chatId;
      dispatch(setSelectedUser(user));
      dispatch(setChatId(chatId));
      socket.emit("join_chat", chatId);
      const msgs = await API.get(`/chat/${chatId}`);
      dispatch(setMessages(msgs.data.data));
    } catch (err) {
      console.log("Select user error", err);
    }
  };

  return (
    <section className={`w-full md:w-80 border-r border-white/10 flex-col glass-panel ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-on-surface font-headline-md">Chats</h2>
        <div className="mt-4 relative">
          <input
            className="w-full bg-white/5 border-none border-b-2 border-white/10 focus:border-primary transition-colors py-2 px-4 text-on-surface text-sm focus:ring-0"
            placeholder="Search conversations..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {users.map((u) => {
          const isSelected = selectedUser?._id === u._id;
          return (
            <div
              key={u._id}
              onClick={() => selectUser(u)}
              className={`p-4 cursor-pointer transition-all duration-200 rounded-lg ${
                isSelected 
                ? "bg-primary/10 border-l-2 border-primary" 
                : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase border border-white/10">
                    {u?.name?.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface-dim rounded-full"></span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-on-surface truncate text-sm">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-on-surface-variant opacity-60">
                      12:45 PM
                    </p>
                  </div>
                  <p className={`text-xs truncate ${isSelected ? "text-primary" : "text-on-surface-variant opacity-70"}`}>
                    {u.email}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

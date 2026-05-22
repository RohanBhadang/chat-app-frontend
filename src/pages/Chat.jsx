import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/chatSlice";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import useSocket from "../hooks/useSocket";

export default function Chat() {
  useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const res = await API.get("/requests/connections");
        dispatch(setUsers(res.data.data));
      } catch (err) {
        console.log("Users fetch error", err);
      }
    };
    fetchConnectedUsers();
  }, [dispatch]);

  return (
    <main className="md:pl-[280px] pt-20 h-screen flex overflow-hidden bg-background">
      {/* Left Panel: Conversations List */}
      <Sidebar />

      {/* Main Panel: Active Chat */}
      <ChatBox />
    </main>
  );
}

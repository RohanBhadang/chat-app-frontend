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
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");   // 👈 tera backend
        dispatch(setUsers(res.data.data));
      } catch (err) {
        console.log("Users fetch error", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatBox />
    </div>
  );
}
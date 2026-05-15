import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/chatSlice";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import useSocket from "../hooks/useSocket";

export default function Chat() {

  useSocket();

  const dispatch =
    useDispatch();


  useEffect(() => {

    const fetchConnectedUsers =
      async () => {

        try {

          const res =
            await API.get(
              "/requests/connections"
            );

          dispatch(
            setUsers(
              res.data.data
            )
          );

        } catch (err) {

          console.log(
            "Users fetch error",
            err
          );

        }

      };

    fetchConnectedUsers();

  }, []);



  return (

    <div className="h-screen chat-bg text-gray-900 overflow-hidden">

      <div className="flex h-full">

        {/* SIDEBAR */}
        <div className="w-[350px] border-r app-border app-surface">

          <Sidebar />

        </div>


        {/* CHAT AREA */}
        <div className="flex-1 app-surface">

          <ChatBox />

        </div>

      </div>

    </div>

  );

}
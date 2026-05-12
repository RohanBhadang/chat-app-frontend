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

    <div className="h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">

      <div className="flex h-full">

        {/* SIDEBAR */}
        <div className="w-[350px] border-r border-zinc-800 bg-zinc-900/70 backdrop-blur-xl">

          <Sidebar />

        </div>


        {/* CHAT AREA */}
        <div className="flex-1 bg-zinc-950/40 backdrop-blur-xl">

          <ChatBox />

        </div>

      </div>

    </div>

  );

}
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedUser,
  setChatId,
  setMessages,
} from "../redux/chatSlice";

import API from "../services/api";
import { socket } from "../services/socket";

export default function Sidebar() {

  const { users } =
    useSelector((s) => s.chat);

  const dispatch =
    useDispatch();



  const selectUser =
    async (user) => {

      try {

        //CREATE CHAT
        const res = await API.post(
  `/chat/create-one-to-one/${user._id}`
);

        const chatId =
          res.data.chatId;


        dispatch(
          setSelectedUser(user)
        );

        dispatch(
          setChatId(chatId)
        );


        //JOIN SOCKET ROOM
        socket.emit(
          "join_chat",
          chatId
        );


        // LOAD OLD MESSAGES
        const msgs =
          await API.get(
            `/chat/${chatId}`
          );

        dispatch(
          setMessages(
            msgs.data.data
          )
        );

      } catch (err) {

        console.log(
          "Select user error",
          err
        );

      }

    };



  return (

    <div className="w-[350px] h-full bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800 text-white overflow-y-auto">

      {/* HEADER */}
      <div className="p-5 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur-xl z-10">

        <h1 className="text-2xl font-bold">
          Chats
        </h1>

        <p className="text-sm text-zinc-400 mt-1">
          Your connected people
        </p>

      </div>



      {/* USERS */}
      <div className="p-3 space-y-2">

        {users.map((u) => (

          <div
            key={u._id}

            onClick={() =>
              selectUser(u)
            }

            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all duration-300"
          >

            {/* AVATAR */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold uppercase shadow-lg">

              {u?.name?.charAt(0)}

            </div>



            {/* INFO */}
            <div className="flex-1 min-w-0">

              <h2 className="font-semibold text-white truncate">
                {u.name}
              </h2>

              <p className="text-sm text-zinc-400 truncate">
                {u.email}
              </p>

            </div>



            {/* ONLINE DOT */}
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-md shadow-green-500/50"></div>

          </div>

        ))}

      </div>

    </div>

  );

}
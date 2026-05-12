import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Connections() {

  const [connections, setConnections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();


  // FETCH CONNECTIONS
  const fetchConnections =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/requests/connections"
          );

        setConnections(
          res.data.data
        );

      } catch (error) {

        console.log(
          error.response?.data ||
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchConnections();

  }, []);


  // OPEN CHAT
  const openChat = (user) => {

    navigate(`/chat/${user._id}`, {
      state: {
        user,
      },
    });

  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-8">

        <h1 className="text-4xl font-bold tracking-tight">
          My Connections
        </h1>

        <p className="text-zinc-400 mt-2">
          People connected with you
        </p>

      </div>


      {/* LOADING */}
      {loading && (

        <div className="max-w-4xl mx-auto grid gap-5 md:grid-cols-2">

          {[1, 2, 3, 4].map((item) => (

            <div
              key={item}
              className="animate-pulse bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
            >

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full bg-zinc-700"></div>

                <div className="flex-1">

                  <div className="h-4 w-40 bg-zinc-700 rounded mb-3"></div>

                  <div className="h-3 w-28 bg-zinc-800 rounded"></div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* EMPTY */}
      {!loading &&
        connections.length === 0 && (

        <div className="max-w-4xl mx-auto">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

            <h2 className="text-2xl font-semibold mb-2">
              No Connections Yet
            </h2>

            <p className="text-zinc-400">
              Accept requests to grow your network.
            </p>

          </div>

        </div>

      )}


      {/* CONNECTIONS */}
      {!loading &&
        connections.length > 0 && (

        <div className="max-w-4xl mx-auto grid gap-5 md:grid-cols-2">

          {connections.map((user) => (

            <div
              key={user._id}
              className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-3xl p-5 shadow-xl hover:border-zinc-700 transition-all duration-300"
            >

              <div className="flex items-center justify-between gap-4">

                {/* USER */}
                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold uppercase shadow-lg">

                    {user?.name?.charAt(0)}

                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">
                      {user?.name}
                    </h2>

                    <p className="text-sm text-zinc-400 break-all">
                      {user?.email}
                    </p>

                    <div className="flex items-center gap-2 mt-2">

                      <div className="w-2 h-2 rounded-full bg-green-500"></div>

                      <span className="text-xs text-zinc-400">
                        Connected
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* BUTTONS */}
              <div className="mt-6 flex items-center gap-3">

                <button
                  onClick={() => openChat(user)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-200 font-semibold shadow-lg"
                >
                  Chat Now
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

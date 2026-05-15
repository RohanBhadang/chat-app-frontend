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

    <div className="min-h-screen chat-bg text-gray-900 p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        <section className="card p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                My Connections
              </h1>
              <p className="text-gray-500 mt-2">
                People connected with you in Gutargu.
              </p>
            </div>
            <div className="rounded-full bg-[#e9f7ee] border border-[#c7ecd0] px-4 py-2 text-sm font-semibold text-[#2d6a4f] shadow-sm">
              {connections.length} connected
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : connections.length === 0 ? (
          <div className="card p-10 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              No Connections Yet
            </h2>
            <p className="text-gray-500">
              Accept requests to start chatting and build your network.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {connections.map((user) => (
              <div
                key={user._id}
                className="card p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] via-[#1fae4f] to-[#128c7e] flex items-center justify-center text-2xl font-bold uppercase text-white shadow-lg">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user?.name}
                      </h2>
                      <span className="rounded-full bg-[#e9f7ee] px-3 py-1 text-xs font-semibold text-[#2d6a4f]">
                        Connected
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 break-all">
                      {user?.email}
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                      Keep the conversation going by opening the chat.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => openChat(user)}
                    className="flex-1 btn-primary py-3 font-semibold transition shadow-lg hover:opacity-95"
                  >
                    Chat Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );

}

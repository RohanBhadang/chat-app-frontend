import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await API.get("/requests/connections");
      setConnections(res.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const openChat = (user) => {
    navigate(`/chat/${user._id}`, {
      state: { user },
    });
  };

  return (
    <main className="md:pl-[280px] pt-20 min-h-screen bg-background text-on-surface p-6 md:p-container-padding-desktop">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">Your Network</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display-lg text-on-surface">
                My <span className="text-secondary">Connections</span>
              </h1>
              <p className="mt-4 text-on-surface-variant max-w-xl text-lg font-body-lg">
                The core of your professional and personal circle. Stay in touch and nurture your relationships.
              </p>
            </div>
            <div className="glass-panel px-8 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-3xl font-bold text-primary font-display-lg">{connections.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel rounded-3xl p-8 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white/5"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                    <div className="h-3 w-3/4 bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : connections.length === 0 ? (
          <div className="col-span-full glass-panel rounded-[40px] p-20 text-center border-dashed border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-6">diversity_1</span>
            <h2 className="text-2xl font-bold text-on-surface">Your circle is waiting</h2>
            <p className="mt-2 text-on-surface-variant">Accept requests or find new people to start your journey.</p>
            <button onClick={() => navigate("/feed")} className="mt-8 bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">Explore Feed</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.map((user) => (
              <div key={user._id} className="glass-panel rounded-3xl p-6 hover:active-glow transition-all duration-300 group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary border border-secondary/20 shadow-lg group-hover:scale-110 transition-transform duration-500 uppercase">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h2 className="text-xl font-bold text-on-surface truncate">{user?.name}</h2>
                       <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    </div>
                    <p className="text-xs text-on-surface-variant opacity-70 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openChat(user)}
                    className="flex-1 bg-white/5 text-on-surface py-4 rounded-xl font-bold text-sm hover:bg-white/10 active:scale-95 transition-all border border-white/10 flex items-center justify-center gap-2 group/btn"
                  >
                    <span className="material-symbols-outlined text-xl text-primary group-hover/btn:scale-110 transition-transform">chat_bubble</span>
                    Chat Now
                  </button>
                  <button className="glass-panel p-4 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/5 transition-all">
                     <span className="material-symbols-outlined">person_remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Feed() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestLoadingId, setRequestLoadingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });
      const res = await API.get("/users/feed");
      setUsers(res.data.data || []);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.response?.data?.message || "Unable to load users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleRequest = async (toUserId, status) => {
    try {
      setRequestLoadingId(toUserId);
      setFeedback({ type: "", message: "" });
      await API.post(`/requests/send/${status}/${toUserId}`);
      setUsers((prev) => prev.filter((u) => u._id !== toUserId));
      setFeedback({
        type: "success",
        message: status === "interested" ? "Connection request sent." : "User ignored.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.response?.data?.message || "Request failed.",
      });
    } finally {
      setRequestLoadingId(null);
    }
  };

  return (
    <main className="md:pl-[280px] pt-28 md:pt-32 pb-8 px-6 md:px-10 min-h-screen bg-background text-on-surface">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">Discovery Feed</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display-lg text-on-surface">
                Discover <span className="text-primary">Connections</span>
              </h1>
              <p className="mt-4 text-on-surface-variant max-w-xl text-lg font-body-lg">
                Connect with like-minded individuals and expand your network within our premium ecosystem.
              </p>
            </div>
            <div className="glass-panel px-8 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-3xl font-bold text-secondary font-display-lg">{users.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Available</span>
            </div>
          </div>
        </header>

        {/* Feedback Toast-like Area */}
        {feedback.message && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-medium glass-panel border-l-4 ${
            feedback.type === "error" ? "border-error text-error" : "border-secondary text-secondary"
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-3xl p-8 animate-pulse">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-white/5"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                    <div className="h-3 w-3/4 bg-white/5 rounded"></div>
                  </div>
                </div>
                <div className="h-20 w-full bg-white/5 rounded-2xl mb-8"></div>
                <div className="flex gap-4">
                  <div className="h-12 flex-1 bg-white/5 rounded-xl"></div>
                  <div className="h-12 flex-1 bg-white/5 rounded-xl"></div>
                </div>
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="col-span-full glass-panel rounded-[40px] p-20 text-center border-dashed border-white/10">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-6">group_off</span>
              <h2 className="text-2xl font-bold text-on-surface">No new faces yet</h2>
              <p className="mt-2 text-on-surface-variant">We'll let you know when new people join the circle.</p>
              <button onClick={fetchFeed} className="mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline">Refresh Feed</button>
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="glass-panel rounded-[32px] p-8 hover:active-glow transition-all duration-500 group">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-500 uppercase">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">New Member</span>
                      <h2 className="text-2xl font-bold text-on-surface mt-1">{user.name}</h2>
                      <p className="text-sm text-on-surface-variant opacity-70">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl bg-white/5 mb-8 text-on-surface-variant text-sm leading-relaxed font-body-md italic border-0">
                  "Interested in exploring new opportunities and building meaningful connections in the tech luxury space."
                </div>

                <div className="flex gap-4">
                  <button
                    disabled={requestLoadingId === user._id}
                    onClick={() => handleRequest(user._id, "interested")}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {requestLoadingId === user._id ? "Processing..." : "Connect"}
                  </button>
                  <button
                    disabled={requestLoadingId === user._id}
                    onClick={() => handleRequest(user._id, "ignored")}
                    className="flex-1 glass-panel text-on-surface py-4 rounded-xl font-bold text-sm hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50 border-white/10"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
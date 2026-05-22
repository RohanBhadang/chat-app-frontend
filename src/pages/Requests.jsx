import { useEffect, useState } from "react";
import API from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/requests/received");
      setRequests(res.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const reviewRequest = async (id, status) => {
    try {
      await API.post(`/requests/review/${status}/${id}`);
      fetchRequests();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <main className="md:pl-[280px] pt-28 md:pt-32 pb-8 px-6 md:px-10 min-h-screen bg-background text-on-surface">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3">Incoming Signals</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display-lg text-on-surface">
                Connection <span className="text-primary">Requests</span>
              </h1>
              <p className="mt-4 text-on-surface-variant max-w-xl text-lg font-body-lg">
                Review who wants to enter your circle. Accept to open new communication channels.
              </p>
            </div>
            {requests.length > 0 && (
               <div className="glass-panel px-8 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px] animate-pulse border-primary/30">
                 <span className="text-3xl font-bold text-primary font-display-lg">{requests.length}</span>
                 <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Pending</span>
               </div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white/5"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                    <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-panel rounded-[40px] p-20 text-center border-dashed border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-6">notifications_off</span>
            <h2 className="text-2xl font-bold text-on-surface">All caught up!</h2>
            <p className="mt-2 text-on-surface-variant">No pending requests at the moment. Check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="glass-panel rounded-3xl p-6 hover:bg-white/[0.02] transition-all duration-300 group">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 shadow-lg group-hover:scale-105 transition-transform duration-500 uppercase">
                      {req.fromUserId?.name?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">{req.fromUserId?.name}</h2>
                      <p className="text-sm text-on-surface-variant opacity-70">{req.fromUserId?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => reviewRequest(req._id, "accepted")}
                      className="px-8 py-3 rounded-xl bg-secondary text-on-secondary font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => reviewRequest(req._id, "rejected")}
                      className="px-8 py-3 rounded-xl glass-panel text-on-surface font-bold text-sm hover:bg-error/10 hover:text-error hover:border-error/30 active:scale-95 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

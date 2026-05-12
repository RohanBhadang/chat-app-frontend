import { useEffect, useState } from "react";
import API from "../services/api";

export default function Feed() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestLoadingId, setRequestLoadingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // 🔥 fetch all users except logged-in user
  const fetchFeed = async () => {
    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });
      const res = await API.get("/users/feed");
      setUsers(res.data.data || []);
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Unable to load users. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // 🔥 send request (interested / ignored)
  const handleRequest = async (toUserId, status) => {
    try {
      setRequestLoadingId(toUserId);
      setFeedback({ type: "", message: "" });

      await API.post(`/requests/send/${status}/${toUserId}`);

      setUsers((prev) => prev.filter((u) => u._id !== toUserId));
      setFeedback({
        type: "success",
        message:
          status === "interested"
            ? "Connection request sent successfully."
            : "User ignored successfully.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Unable to send the request. Please try again.",
      });
      console.log("Request error:", err);
    } finally {
      setRequestLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Connection Feed</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Find users to connect with</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                These are users you have not interacted with yet. Send an interest request or ignore profiles you don’t want to connect with.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-5 py-4 text-center text-sm text-slate-700 shadow-sm">
              <p className="text-slate-500">Profiles available</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{users.length}</p>
            </div>
          </div>
        </section>

        {feedback.message && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
              feedback.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6"
              >
                <div className="h-4 w-32 rounded-full bg-slate-200" />
                <div className="mt-4 h-3 w-40 rounded-full bg-slate-200" />
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-24 rounded-full bg-slate-200" />
                  <div className="h-10 w-24 rounded-full bg-slate-200" />
                </div>
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              <p className="text-lg font-medium">No users available</p>
              <p className="mt-2 text-sm">Check back later after new users join or refresh the page.</p>
            </div>
          ) : (
            users.map((user) => (
              <article
                key={user._id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">User</p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-900">{user.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{user.email}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-700">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={requestLoadingId === user._id}
                    onClick={() => handleRequest(user._id, "interested")}
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    {requestLoadingId === user._id ? "Sending..." : "Interested"}
                  </button>
                  <button
                    type="button"
                    disabled={requestLoadingId === user._id}
                    onClick={() => handleRequest(user._id, "ignored")}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {requestLoadingId === user._id ? "Processing..." : "Ignore"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
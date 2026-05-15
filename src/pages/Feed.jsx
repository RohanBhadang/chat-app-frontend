// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function Feed() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [requestLoadingId, setRequestLoadingId] = useState(null);
//   const [feedback, setFeedback] = useState({ type: "", message: "" });

//   // 🔥 fetch all users except logged-in user
//   const fetchFeed = async () => {
//     try {
//       setLoading(true);
//       setFeedback({ type: "", message: "" });
//       const res = await API.get("/users/feed");
//       setUsers(res.data.data || []);
//     } catch (err) {
//       setFeedback({
//         type: "error",
//         message:
//           err?.response?.data?.message ||
//           "Unable to load users. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeed();
//   }, []);

//   // 🔥 send request (interested / ignored)
//   const handleRequest = async (toUserId, status) => {
//     try {
//       setRequestLoadingId(toUserId);
//       setFeedback({ type: "", message: "" });

//       await API.post(`/requests/send/${status}/${toUserId}`);

//       setUsers((prev) => prev.filter((u) => u._id !== toUserId));
//       setFeedback({
//         type: "success",
//         message:
//           status === "interested"
//             ? "Connection request sent successfully."
//             : "User ignored successfully.",
//       });
//     } catch (err) {
//       setFeedback({
//         type: "error",
//         message:
//           err?.response?.data?.message ||
//           "Unable to send the request. Please try again.",
//       });
//       console.log("Request error:", err);
//     } finally {
//       setRequestLoadingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 py-10">
//       <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
//         <section className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
//           <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Connection Feed</p>
//               <h1 className="mt-3 text-3xl font-semibold text-slate-900">Find users to connect with</h1>
//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
//                 These are users you have not interacted with yet. Send an interest request or ignore profiles you don’t want to connect with.
//               </p>
//             </div>
//             <div className="rounded-3xl bg-slate-100 px-5 py-4 text-center text-sm text-slate-700 shadow-sm">
//               <p className="text-slate-500">Profiles available</p>
//               <p className="mt-2 text-2xl font-semibold text-slate-900">{users.length}</p>
//             </div>
//           </div>
//         </section>

//         {feedback.message && (
//           <div
//             className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
//               feedback.type === "error"
//                 ? "border-red-200 bg-red-50 text-red-700"
//                 : "border-emerald-200 bg-emerald-50 text-emerald-700"
//             }`}
//           >
//             {feedback.message}
//           </div>
//         )}

//         <div className="grid gap-5 lg:grid-cols-2">
//           {loading ? (
//             Array.from({ length: 4 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6"
//               >
//                 <div className="h-4 w-32 rounded-full bg-slate-200" />
//                 <div className="mt-4 h-3 w-40 rounded-full bg-slate-200" />
//                 <div className="mt-6 flex items-center gap-3">
//                   <div className="h-10 w-24 rounded-full bg-slate-200" />
//                   <div className="h-10 w-24 rounded-full bg-slate-200" />
//                 </div>
//               </div>
//             ))
//           ) : users.length === 0 ? (
//             <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
//               <p className="text-lg font-medium">No users available</p>
//               <p className="mt-2 text-sm">Check back later after new users join or refresh the page.</p>
//             </div>
//           ) : (
//             users.map((user) => (
//               <article
//                 key={user._id}
//                 className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
//               >
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm uppercase tracking-[0.25em] text-slate-500">User</p>
//                     <h2 className="mt-3 text-xl font-semibold text-slate-900">{user.name}</h2>
//                     <p className="mt-2 text-sm text-slate-600">{user.email}</p>
//                   </div>
//                   <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-700">
//                     {user.name?.charAt(0).toUpperCase() || "U"}
//                   </div>
//                 </div>

//                 <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
//                   <button
//                     type="button"
//                     disabled={requestLoadingId === user._id}
//                     onClick={() => handleRequest(user._id, "interested")}
//                     className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
//                   >
//                     {requestLoadingId === user._id ? "Sending..." : "Interested"}
//                   </button>
//                   <button
//                     type="button"
//                     disabled={requestLoadingId === user._id}
//                     onClick={() => handleRequest(user._id, "ignored")}
//                     className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
//                   >
//                     {requestLoadingId === user._id ? "Processing..." : "Ignore"}
//                   </button>
//                 </div>
//               </article>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import API from "../services/api";

export default function Feed() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    requestLoadingId,
    setRequestLoadingId,
  ] = useState(null);

  const [feedback, setFeedback] =
    useState({
      type: "",
      message: "",
    });

  // fetch feed
  const fetchFeed = async () => {

    try {

      setLoading(true);

      setFeedback({
        type: "",
        message: "",
      });

      const res =
        await API.get(
          "/users/feed"
        );

      setUsers(
        res.data.data || []
      );

    } catch (err) {

      setFeedback({
        type: "error",
        message:
          err?.response?.data
            ?.message ||
          "Unable to load users.",
      });

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFeed();

  }, []);

  // send request
  const handleRequest = async (
    toUserId,
    status
  ) => {

    try {

      setRequestLoadingId(
        toUserId
      );

      setFeedback({
        type: "",
        message: "",
      });

      await API.post(
        `/requests/send/${status}/${toUserId}`
      );

      setUsers((prev) =>
        prev.filter(
          (u) =>
            u._id !== toUserId
        )
      );

      setFeedback({
        type: "success",
        message:
          status ===
          "interested"
            ? "Connection request sent."
            : "User ignored.",
      });

    } catch (err) {

      setFeedback({
        type: "error",
        message:
          err?.response?.data
            ?.message ||
          "Request failed.",
      });

    } finally {

      setRequestLoadingId(
        null
      );
    }
  };

  return (

    <div className="min-h-screen chat-bg py-10 px-4">

      {/* TOP */}
      <div className="max-w-7xl mx-auto mb-10">

        <div className="card p-8 shadow-lg">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-sm uppercase tracking-[0.25em] text-[#40916c] font-semibold">
                Gutargu Feed
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#1b4332]">
                Discover New People
              </h1>

              <p className="mt-4 text-[#52796f] max-w-2xl leading-7">
                Connect with new users,
                build conversations and
                grow your network inside
                Gutargu.
              </p>

            </div>

            {/* COUNT */}
            <div className="bg-[#f1fff5] border border-[#b7e4c7] rounded-[28px] px-8 py-6 text-center min-w-[180px]">

              <p className="text-[#52796f] text-sm">
                Available Users
              </p>

              <h2 className="text-5xl font-bold text-[#2d6a4f] mt-2">
                {users.length}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* FEEDBACK */}
      {feedback.message && (

        <div
          className={`max-w-7xl mx-auto mb-6 rounded-2xl px-5 py-4 text-sm font-medium ${
            feedback.type ===
            "error"
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-green-50 border border-green-200 text-[#2d6a4f]"
          }`}
        >
          {feedback.message}
        </div>

      )}

      {/* USERS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-7">

        {loading ? (

          Array.from({
            length: 6,
          }).map((_, index) => (

            <div
              key={index}
              className="animate-pulse bg-white rounded-[32px] p-6 border border-[#d8f3dc]"
            >

              <div className="w-16 h-16 rounded-full bg-gray-200"></div>

              <div className="mt-6 h-4 w-40 rounded-full bg-gray-200"></div>

              <div className="mt-3 h-3 w-52 rounded-full bg-gray-200"></div>

              <div className="mt-8 flex gap-3">

                <div className="h-11 flex-1 rounded-full bg-gray-200"></div>

                <div className="h-11 flex-1 rounded-full bg-gray-200"></div>

              </div>

            </div>
          ))

        ) : users.length === 0 ? (

          <div className="col-span-full bg-white rounded-[35px] p-16 border border-dashed border-[#b7e4c7] text-center">

            <h2 className="text-2xl font-bold text-[#2d6a4f]">
              No Users Found
            </h2>

            <p className="mt-3 text-[#52796f]">
              New users will appear here
              automatically.
            </p>

          </div>

        ) : (

          users.map((user) => (

            <div
              key={user._id}
              className="bg-white rounded-[35px] p-7 border border-[#d8f3dc] shadow-md hover:shadow-xl transition-all duration-300"
            >

              {/* TOP */}
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-[#74c69d]">
                    Gutargu User
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#1b4332]">
                    {user.name}
                  </h2>

                  <p className="mt-2 text-sm text-[#52796f]">
                    {user.email}
                  </p>

                </div>

                {/* AVATAR */}
                <div className="w-16 h-16 rounded-full bg-[#d8f3dc] flex items-center justify-center text-2xl font-bold text-[#2d6a4f] shadow-inner">

                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

              </div>

              {/* BIO */}
              <div className="mt-6 bg-[#f8fff9] border border-[#d8f3dc] rounded-2xl p-4 text-sm text-[#52796f] leading-6">

                Ready to connect and start
                meaningful conversations
                on Gutargu.

              </div>

              {/* BUTTONS */}
              <div className="mt-7 flex gap-3">

                <button
                  disabled={
                    requestLoadingId ===
                    user._id
                  }
                  onClick={() =>
                    handleRequest(
                      user._id,
                      "interested"
                    )
                  }
                  className="flex-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
                >
                  {requestLoadingId ===
                  user._id
                    ? "Sending..."
                    : "Interested"}
                </button>

                <button
                  disabled={
                    requestLoadingId ===
                    user._id
                  }
                  onClick={() =>
                    handleRequest(
                      user._id,
                      "ignored"
                    )
                  }
                  className="flex-1 border border-[#b7e4c7] text-[#2d6a4f] hover:bg-[#f1fff5] py-3 rounded-full font-semibold transition disabled:opacity-50"
                >
                  Ignore
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}
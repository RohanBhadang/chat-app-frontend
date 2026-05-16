
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
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Requests() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // FETCH REQUESTS
  const fetchRequests =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/requests/received"
          );

        setRequests(
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

    fetchRequests();

  }, []);



  // ACCEPT / REJECT
  const reviewRequest =
    async (id, status) => {

      try {

        await API.post(
          `/requests/review/${status}/${id}`
        );

        // REFRESH LIST
        fetchRequests();

      } catch (error) {

        console.log(
          error.response?.data ||
          error.message
        );

      }

    };


return (
  <div className="min-h-screen chat-bg text-gray-900 p-6">

    {/* HEADER */}
    <div className="max-w-3xl mx-auto mb-8 text-center">

      <h1 className="text-4xl font-bold text-green-700 tracking-tight">
        Connection Requests
      </h1>

      <p className="text-gray-500 mt-2">
        Manage your incoming connection requests
      </p>

    </div>

    {/* LOADING */}
    {loading && (
      <div className="max-w-3xl mx-auto space-y-4">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-gray-200"></div>

              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 w-28 bg-gray-100 rounded"></div>
              </div>

            </div>
          </div>
        ))}

      </div>
    )}

    {/* EMPTY */}
    {!loading && requests.length === 0 && (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">

          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Pending Requests
          </h2>

          <p className="text-gray-500">
            You don’t have any connection requests right now.
          </p>

        </div>
      </div>
    )}

    {/* REQUESTS */}
    {!loading && requests.length > 0 && (
      <div className="max-w-3xl mx-auto space-y-5">

        {requests.map((req) => (
          <div
            key={req._id}
            className="card shadow-sm hover:shadow-md transition"
          >

            <div className="flex items-center justify-between flex-wrap gap-4">

              {/* USER */}
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl uppercase">
                  {req.fromUserId?.name?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {req.fromUserId?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {req.fromUserId?.email}
                  </p>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3">

                <button
                  onClick={() => reviewRequest(req._id, "accepted")}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => reviewRequest(req._id, "rejected")}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
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
)}
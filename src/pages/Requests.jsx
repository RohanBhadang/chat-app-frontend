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

    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">

      {/* HEADER */}
      <div className="max-w-3xl mx-auto mb-8">

        <h1 className="text-4xl font-bold tracking-tight">
          Connection Requests
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage your incoming connection requests
        </p>

      </div>



      {/* LOADING SKELETON */}
      {loading && (

        <div className="max-w-3xl mx-auto space-y-4">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="animate-pulse bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-zinc-700"></div>

                <div className="flex-1">

                  <div className="h-4 w-40 bg-zinc-700 rounded mb-3"></div>

                  <div className="h-3 w-28 bg-zinc-800 rounded"></div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}



      {/* EMPTY STATE */}
      {!loading &&
        requests.length === 0 && (

        <div className="max-w-3xl mx-auto">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

            <h2 className="text-2xl font-semibold mb-2">
              No Pending Requests
            </h2>

            <p className="text-zinc-400">
              You don’t have any connection requests right now.
            </p>

          </div>

        </div>

      )}



      {/* REQUESTS */}
      {!loading &&
        requests.length > 0 && (

        <div className="max-w-3xl mx-auto space-y-5">

          {requests.map((req) => (

            <div
              key={req._id}
              className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 shadow-xl hover:border-zinc-700 transition-all duration-300"
            >

              <div className="flex items-center justify-between flex-wrap gap-4">

                {/* USER INFO */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold uppercase">

                    {req.fromUserId?.name?.charAt(0)}

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold">
                      {req.fromUserId?.name}
                    </h2>

                    <p className="text-sm text-zinc-400">
                      {req.fromUserId?.email}
                    </p>

                  </div>

                </div>



                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() =>
                      reviewRequest(
                        req._id,
                        "accepted"
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition-all duration-200 font-medium"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      reviewRequest(
                        req._id,
                        "rejected"
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200 font-medium"
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

  );

}

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import { connectSocket } from "../services/socket";

export default function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const register = async () => {

    try {

      const res =
        await API.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      connectSocket(
        res.data.accessToken
      );

      navigate("/feed");

    } catch (err) {

      console.log(
        "Register error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Registration failed"
      );
    }
  };

  return (

    <div className="min-h-screen chat-bg flex items-center justify-center px-4">

      <div className="w-full max-w-5xl card shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="hidden md:block h-[650px]">

          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop"
            alt="register"
            className="w-full h-full object-cover"
          />

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-8 py-10 md:px-14">

          <div className="w-full max-w-md">

            <h1 className="text-3xl font-bold text-[#3cbf88] mb-2">
              Create Account
            </h1>

            <p className="text-gray-500 text-sm mb-8">
              Start chatting with Gutargu
            </p>

            {/* NAME */}
            <div className="mb-5">

              <label className="block text-sm font-medium mb-2 text-gray-700">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full border border-[#d4efd6] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#7ad5a4]"
              />

            </div>

            {/* EMAIL */}
            <div className="mb-5">

              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-[#d4efd6] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#7ad5a4]"
              />

            </div>

            {/* PASSWORD */}
            <div className="mb-5">

              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border border-[#d4efd6] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#7ad5a4]"
              />

            </div>

            {/* ERROR */}
            {error && (

              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>

            )}

            {/* BUTTON */}
            <button
              onClick={register}
              className="w-full btn-primary py-3 font-semibold transition"
            >
              Register
            </button>

            {/* LOGIN */}
            <p className="text-center text-sm text-gray-600 mt-6">

              Already have an account?{" "}

              <button
                onClick={() =>
                  navigate("/")
                }
                className="text-[#3cbf88] font-semibold hover:underline"
              >
                Login
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
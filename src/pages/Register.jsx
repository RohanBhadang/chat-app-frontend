import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {socket} from "../services/socket";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [error, setError] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      // ✅ same as login
      localStorage.setItem("token", res.data.accessToken);

      connectSocket(res.data.accessToken);

      navigate("/"); // 👈 direct chat page
    } catch (err) {
      console.log("Register error:", err);
        // ✅ show backend error
      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="p-6 bg-gray-800 text-white w-80 rounded">

        <h2 className="text-xl mb-4 text-center">Register</h2>

        <input
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
          className="block mb-2 p-2 w-full text-black"
        />

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="block mb-2 p-2 w-full text-black"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="block mb-2 p-2 w-full text-black"
        />

        {/* ✅ Error Message */}
        {error && (
          <p className="text-red-400 text-sm mb-2">
            {error}
          </p>
        )}
        <button
          onClick={register}
          className="bg-green-500 w-full py-2 mt-2"
        >
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have account?{" "}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
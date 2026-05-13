import { useState } from "react";
import API from "../services/api";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { socket } from "../services/socket";
import { connectSocket } from "../services/socket";
import { useNavigate } from "react-router-dom";  


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.accessToken);
      dispatch(setToken(res.data.accessToken));

      connectSocket(res.data.accessToken);

      navigate("/feed"); 
    } catch (err) {
      console.log("Login error:", err);
      
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="p-6 bg-gray-800 text-white">
        <input
          placeholder="email"
          onChange={(e)=>setEmail(e.target.value)}
          className="block mb-2 text-black"
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e)=>setPassword(e.target.value)}
          className="block mb-2 text-black"
        />
        <button onClick={login} className="bg-green-500 px-4 py-2">
          Login
        </button>
        {error && (
          <p className="text-red-400 text-sm mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
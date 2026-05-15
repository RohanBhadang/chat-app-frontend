// import { useState } from "react";
// import API from "../services/api";
// import { useDispatch } from "react-redux";
// import { setToken } from "../redux/authSlice";
// import { socket } from "../services/socket";
// import { connectSocket } from "../services/socket";
// import { useNavigate } from "react-router-dom";  


// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); 
//   const [error, setError] = useState("");

//   const login = async () => {
//     try {
//       const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", res.data.accessToken);
//       dispatch(setToken(res.data.accessToken));

//       connectSocket(res.data.accessToken);

//       navigate("/feed"); 
//     } catch (err) {
//       console.log("Login error:", err);
      
//       setError(
//         err.response?.data?.message ||
//         "Login failed"
//       );
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-black">
//       <div className="p-6 bg-gray-800 text-white">
//         <input
//           placeholder="email"
//           onChange={(e)=>setEmail(e.target.value)}
//           className="block mb-2 text-black"
//         />
//         <input
//           placeholder="password"
//           type="password"
//           onChange={(e)=>setPassword(e.target.value)}
//           className="block mb-2 text-black"
//         />
//         <button onClick={login} className="bg-green-500 px-4 py-2">
//           Login
//         </button>
//         {error && (
//           <p className="text-red-400 text-sm mt-2">
//             {error}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/api";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { connectSocket } from "../services/socket";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginImage.jpeg";
export default function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const [error, setError] =
    useState("");

  const login = async () => {

    try {

      const res =
        await API.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      dispatch(
        setToken(
          res.data.accessToken
        )
      );

      connectSocket(
        res.data.accessToken
      );

      navigate("/feed");

    } catch (err) {

      console.log(
        "Login error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Login failed"
      );
    }
  };

  return (

  <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">

    <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-xl overflow-hidden grid md:grid-cols-2">

      {/* LEFT IMAGE */}
      <div className="hidden md:block h-[650px]">

        <img
          src={loginImage}
          alt="login"
          className="w-full h-full object-cover"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-8 py-10 md:px-14">

        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold text-[#2d6a4f] mb-2">
            Welcome Back!
          </h1>

          <p className="text-gray-500 text-sm mb-8">
            Login to continue chatting
          </p>

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
              className="w-full border border-[#b7e4c7] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#40916c]"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-3">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-[#b7e4c7] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#40916c]"
            />

          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-sm mb-6">

            <label className="flex items-center gap-2 text-gray-600">

              <input type="checkbox" />

              Remember me

            </label>

            <button className="text-[#2d6a4f] hover:underline">
              Forgot Password
            </button>

          </div>

          {/* ERROR */}
          {error && (

            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>

          )}

          {/* LOGIN BUTTON */}
          <button
            onClick={login}
            className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] transition text-white py-3 rounded-full font-semibold"
          >
            Login
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>

          {/* SOCIAL BUTTONS */}
          <div className="grid grid-cols-2 gap-3 mb-6">

            <button className="border border-[#b7e4c7] rounded-full py-3 text-sm hover:bg-[#f1fff5] transition">
              Google
            </button>

            <button className="border border-[#b7e4c7] rounded-full py-3 text-sm hover:bg-[#f1fff5] transition">
              Apple
            </button>

          </div>

          {/* REGISTER */}
          <p className="text-center text-sm text-gray-600">

            Don’t have an account?{" "}

            <button
              onClick={() =>
                navigate("/register")
              }
              className="text-[#2d6a4f] font-semibold hover:underline"
            >
              Register
            </button>

          </p>

        </div>

      </div>

    </div>

  </div>
)
}
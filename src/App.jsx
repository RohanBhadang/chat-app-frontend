import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Feed from "./pages/Feed";
import { useEffect } from "react";
import { connectSocket } from "./services/socket";


export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      connectSocket(token);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        
        <Route
        path="/chat/:userId"
        element={<Chat />}
        />

        <Route 
        path="/feed"
         element={<Feed />} />

        <Route 
        path="/requests" 
        element={<Requests />} />

        <Route
         path="/connections"
         element={<Connections />}
/>
      </Routes>
    </BrowserRouter>
  );
}
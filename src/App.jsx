
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Feed from "./pages/Feed";

import { connectSocket } from "./services/socket";
import Navbar from "./components/NavBar";

function Layout({ children }) {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) connectSocket(token);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/connections" element={<Connections />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
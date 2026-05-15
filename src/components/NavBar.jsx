
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logochat from "../assets/logochat.jpeg";
export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItem = (label, path) => (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
        location.pathname === path
          ? "nav-active"
          : "text-[#2d6a4f] hover:bg-[#f1fff5]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full navbar-surface shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate("/feed")}
          className="text-2xl font-bold text-[#2d6a4f] cursor-pointer"
          
        > <img
          src={logochat}
          alt="GuterGu"
          className="h-20 w-30 object-contain"
        />
        
         
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">

          {navItem("Feed", "/feed")}
          {navItem("Chat", "/connections")}
          {navItem("Requests", "/requests")}

          <button
            onClick={logout}
            className="ml-2 px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-[#2d6a4f] text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">

          {navItem("Feed", "/feed")}
          {navItem("Chat", "/chat")}
          {navItem("Requests", "/requests")}

          <button
            onClick={logout}
            className="mt-2 px-4 py-2 rounded-full bg-red-500 text-white font-semibold"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
}
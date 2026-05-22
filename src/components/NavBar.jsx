import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { label: "Feed", path: "/feed", icon: "home" },
    { label: "Requests", path: "/requests", icon: "person_add" },
    { label: "Connections", path: "/connections", icon: "group" },
    { label: "Messages", path: "/connections", icon: "chat_bubble" }, // In this app, connections leads to chat list
  ];

  return (
    <>
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-container-padding-desktop h-20 bg-surface/60 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <span 
            className="text-2xl font-bold tracking-tighter text-primary cursor-pointer"
            onClick={() => navigate("/feed")}
          >
            Luxe
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-on-surface-variant text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-200 hover:text-primary ${
                  location.pathname === item.path ? "text-primary font-bold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">settings</button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button 
              className="md:hidden material-symbols-outlined text-on-surface-variant"
              onClick={() => setOpen(!open)}
            >
              {open ? "close" : "menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Side NavBar (Desktop) */}
      <aside className="fixed left-0 top-0 h-full pt-24 pb-8 flex flex-col z-40 bg-surface-dim/60 backdrop-blur-xl border-r border-white/10 w-[280px] hidden md:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
               {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{user?.name || "User"}</p>
              <p className="text-[10px] text-secondary flex items-center gap-1 uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Active Now
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 py-3 pl-4 transition-all duration-300 hover:bg-white/5 hover:translate-x-1 ${
                location.pathname === item.path 
                  ? "text-primary border-l-2 border-primary bg-primary/5" 
                  : "text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 py-3 pl-4 text-error hover:bg-white/5 transition-all duration-300"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>

        <div className="px-6 mt-auto">
          <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform">
            New Post
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-surface-dim/95 backdrop-blur-xl flex flex-col p-8 md:hidden">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-bold text-primary">Luxe</span>
            <button 
              className="material-symbols-outlined text-on-surface-variant"
              onClick={() => setOpen(false)}
            >
              close
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 text-xl ${
                  location.pathname === item.path ? "text-primary font-bold" : "text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="flex items-center gap-4 text-xl text-error"
            >
              <span className="material-symbols-outlined text-2xl">logout</span>
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
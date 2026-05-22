import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../services/socket";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      setError("");
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.accessToken);
      connectSocket(res.data.accessToken);
      navigate("/feed");
    } catch (err) {
      console.log("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-6xl glass-panel rounded-[40px] overflow-hidden grid lg:grid-cols-2 shadow-2xl relative z-10 border-white/10">
        {/* Left Side - Visual */}
        <div className="hidden lg:block relative group">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop"
            alt="register"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-display-lg leading-tight">
              Begin your <span className="text-secondary">journey</span> with us.
            </h2>
            <p className="text-on-surface-variant text-lg font-body-lg opacity-80">
              Create your profile and start connecting with the community.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 md:p-16 lg:p-20 bg-surface-dim/40">
          <div className="w-full max-w-md">
            <header className="mb-10">
              <span className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold block mb-4">Registration</span>
              <h1 className="text-4xl font-bold text-on-surface mb-3 font-display-lg">Create Account</h1>
              <p className="text-on-surface-variant font-body-md opacity-70">Fill in the details to establish your digital presence.</p>
            </header>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-white/20"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors">person</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-white/20"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors">mail</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-white/20"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors">lock</span>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold flex items-center gap-3 animate-shake">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <button
                onClick={register}
                className="w-full bg-secondary text-on-secondary py-5 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary/20 mt-4 uppercase tracking-widest"
              >
                Create Profile
              </button>

              <p className="text-center text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-8">
                Already member?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="text-secondary hover:underline ml-1"
                >
                  Authenticate
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
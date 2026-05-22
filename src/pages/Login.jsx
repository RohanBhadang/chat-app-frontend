import { useState } from "react";
import API from "../services/api";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { connectSocket } from "../services/socket";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginImage.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async () => {
    try {
      setError("");
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.accessToken);
      dispatch(setToken(res.data.accessToken));
      connectSocket(res.data.accessToken);
      navigate("/feed");
    } catch (err) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-6xl glass-panel rounded-[40px] overflow-hidden grid lg:grid-cols-2 shadow-2xl relative z-10 border-white/10">
        {/* Left Side - Visual */}
        <div className="hidden lg:block relative group">
          <img
            src={loginImage}
            alt="login"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-display-lg leading-tight">
              Experience the next level of <span className="text-primary">communication</span>.
            </h2>
            <p className="text-on-surface-variant text-lg font-body-lg opacity-80">
              Join our exclusive network of professionals and tech enthusiasts.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 md:p-16 lg:p-20 bg-surface-dim/40">
          <div className="w-full max-w-md">
            <header className="mb-12">
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold block mb-4">Secure Access</span>
              <h1 className="text-4xl font-bold text-on-surface mb-3 font-display-lg">Welcome Back</h1>
              <p className="text-on-surface-variant font-body-md opacity-70">Enter your credentials to access your workspace.</p>
            </header>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/20"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">mail</span>
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/20"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">lock</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <label className="flex items-center gap-3 text-on-surface-variant cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg bg-white/5 border-white/10 text-primary focus:ring-0 focus:ring-offset-0 transition-all" />
                  <span className="group-hover:text-on-surface transition-colors">Stay Signed In</span>
                </label>
                <button className="text-primary hover:text-primary-container transition-colors">Recovery</button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold flex items-center gap-3 animate-shake">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <button
                onClick={login}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4 uppercase tracking-widest"
              >
                Authenticate
              </button>

              <div className="relative flex items-center justify-center py-4">
                <div className="absolute w-full h-[1px] bg-white/10"></div>
                <span className="relative bg-surface-dim/40 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">Identity Hub</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl glass-panel hover:bg-white/10 transition-all border-white/10 text-xs font-bold uppercase tracking-widest">
                  Google
                </button>
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl glass-panel hover:bg-white/10 transition-all border-white/10 text-xs font-bold uppercase tracking-widest">
                  Apple
                </button>
              </div>

              <p className="text-center text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-8">
                New here?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-primary hover:underline ml-1"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
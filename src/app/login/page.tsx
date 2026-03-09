"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, AlertCircle, Eye, EyeOff, Sun, Moon } from "lucide-react";

import { dataService } from "@/utils/dataService";

export default function LoginPage() {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();

  useEffect(() => {
    const storedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(storedTheme);
    document.documentElement.dataset.theme = storedTheme;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(storedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(nextTheme);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple authentication logic for demonstration
    const normalizedUserId = userId.trim().toLowerCase();
    const normalizedPassword = password.trim();
    
    // Load users from DataService
    const storedUsers = await dataService.getUsers();
    console.log("Login Debug: Loaded users:", storedUsers.length);
    
    // Find matching user
    const matchingUser = storedUsers.find((u: any) => 
      u.userId.trim().toLowerCase() === normalizedUserId && 
      u.role === role
    );
    console.log("Login Debug: Matching user found:", !!matchingUser);

    // Get stored passwords or use defaults if user not found in list (fallback)
    const adminPassFromService = await dataService.getAdminPassword();
    const defaultAdminPass = adminPassFromService.trim();
    const defaultUserPass = "User@123"; // Base default
    
    let isValid = false;
    
    if (matchingUser) {
      // Check password from database user
      const dbPass = (matchingUser.password || "").trim();
      console.log("Login Debug: Comparing passwords. Input:", normalizedPassword, "DB:", dbPass);
      isValid = normalizedPassword === dbPass;
    } else {
      console.log("Login Debug: User not found in DB, trying hardcoded fallback");
      // Fallback for default hardcoded credentials
      if (role === "admin" && normalizedUserId === "bizlaunch") {
        isValid = normalizedPassword === defaultAdminPass;
      } else if (role === "user" && normalizedUserId === "user") {
        isValid = normalizedPassword === defaultUserPass;
      }
    }

    if (isValid) {
      localStorage.setItem("auth_token", `${role}_token`);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", matchingUser ? matchingUser.name : (role === "admin" ? "Admin" : "User"));
      if (matchingUser) {
        localStorage.setItem("user_id", matchingUser.id);
        localStorage.setItem("user_email", matchingUser.userId);
      }
      router.push(role === "admin" ? "/admin" : "/");
    } else {
      setError("Invalid credentials. Check your User ID or Password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-card border border-border text-foreground hover:bg-border/50 transition-all z-20 shadow-lg"
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="max-w-md w-full bg-card rounded-[2.5rem] shadow-2xl border border-border p-10 relative z-10 transition-colors">
        <div className="text-center mb-10">
          <div className="inline-flex p-5 bg-blue-500/10 rounded-3xl text-blue-400 mb-6 border border-blue-500/20 shadow-lg">
            {role === "admin" ? <ShieldCheck size={40} /> : <User size={40} />}
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            {role === "admin" ? "Admin Portal" : "User Login"}
          </h1>
          <p className="text-slate-500 mt-3 font-medium">Welcome to BizLaunch Manager</p>
        </div>

        <div className="flex p-1.5 bg-border/30 rounded-2xl mb-10 border border-border">
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              role === "user" ? "bg-background text-foreground shadow-lg" : "text-slate-500 hover:text-foreground"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              role === "admin" ? "bg-background text-foreground shadow-lg" : "text-slate-500 hover:text-foreground"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">User ID</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 text-red-400 text-sm bg-red-400/5 p-4 rounded-2xl border border-red-400/10 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 mt-6 active:scale-[0.98]"
          >
            Sign In as {role === "admin" ? "Admin" : "User"}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-10 font-bold uppercase tracking-tighter">
          BizLaunch v0.1.0 • Secure Access Only
        </p>
      </div>
    </div>
  );
}

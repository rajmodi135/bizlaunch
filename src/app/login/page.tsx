"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple authentication logic for demonstration
    const normalizedUserId = userId.toLowerCase();
    
    if (role === "admin" && normalizedUserId === "bizlaunch" && password === "Jaipur@6621") {
      localStorage.setItem("auth_token", "admin_token");
      localStorage.setItem("user_role", "admin");
      router.push("/admin");
    } else if (role === "user" && normalizedUserId === "user" && password === "User@123") {
      localStorage.setItem("auth_token", "user_token");
      localStorage.setItem("user_role", "user");
      router.push("/");
    } else {
      setError(`Invalid credentials. Use Admin: BizLaunch / Jaipur@6621 or User: User / User@123`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-50 rounded-2xl text-blue-600 mb-4">
            {role === "admin" ? <ShieldCheck size={32} /> : <User size={32} />}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {role === "admin" ? "Admin Portal" : "User Login"}
          </h1>
          <p className="text-slate-500 mt-2">Welcome to BizLaunch Manager</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              role === "user" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              role === "admin" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">User ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-4"
          >
            Sign In as {role === "admin" ? "Admin" : "User"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-8">
          BizLaunch v0.1.0 • Secure Access Only
        </p>
      </div>
    </div>
  );
}

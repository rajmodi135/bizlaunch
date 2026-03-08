"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple authentication logic for demonstration
    const normalizedUserId = userId.toLowerCase();
    
    // Load users from localStorage
    const storedUsersJson = localStorage.getItem("bizlaunch_users");
    const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Find matching user
    const matchingUser = storedUsers.find((u: any) => 
      u.userId.toLowerCase() === normalizedUserId && 
      u.role === role
    );

    // Get stored passwords or use defaults if user not found in list (fallback)
    const defaultAdminPass = localStorage.getItem("admin_password") || "Jaipur@6621";
    const defaultUserPass = localStorage.getItem("user_password") || "User@123";
    
    let isValid = false;
    if (matchingUser) {
      isValid = password === matchingUser.password;
    } else {
      // Fallback for default credentials if list is empty or user not in list
      if (role === "admin" && normalizedUserId === "bizlaunch") {
        isValid = password === defaultAdminPass;
      } else if (role === "user" && normalizedUserId === "user") {
        isValid = password === defaultUserPass;
      }
    }

    if (isValid) {
      localStorage.setItem("auth_token", `${role}_token`);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", matchingUser ? matchingUser.name : (role === "admin" ? "Admin" : "User"));
      router.push(role === "admin" ? "/admin" : "/");
    } else {
      setError(`Invalid credentials. Check your User ID or Password.`);
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
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit, 
  Search, 
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Key,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

type User = {
  id: string;
  name: string;
  userId: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  joinedDate: string;
};

const initialUsers: User[] = [
  { id: "1", name: "BizLaunch Admin", userId: "BizLaunch", role: "admin", status: "active", joinedDate: "Mar 01, 2026" },
  { id: "2", name: "Standard User", userId: "User", role: "user", status: "active", joinedDate: "Mar 05, 2026" },
];

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passForm, setPassForm] = useState({ old: "", new: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", userId: "", role: "user" as "admin" | "user" });
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    router.push("/login");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    const currentPass = localStorage.getItem("admin_password") || "Jaipur@6621";
    
    if (passForm.old !== currentPass) {
      setPassError("Incorrect current password.");
      return;
    }
    if (passForm.new !== passForm.confirm) {
      setPassError("New passwords do not match.");
      return;
    }
    if (passForm.new.length < 6) {
      setPassError("Password must be at least 6 characters.");
      return;
    }

    localStorage.setItem("admin_password", passForm.new);
    setPassSuccess(true);
    setPassForm({ old: "", new: "", confirm: "" });
    setTimeout(() => setShowPassModal(false), 2000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      userId: newUser.userId,
      role: newUser.role,
      status: "active",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    };
    setUsers([...users, user]);
    setNewUser({ name: "", userId: "", role: "user" });
    setShowAddModal(false);
  };

  const deleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowPassModal(true)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Key size={18} /> Password
          </button>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
            <p className="text-slate-500 mt-1">Manage accounts and permissions for BizLaunch.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <UserPlus size={20} /> Create New User
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or ID..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-4">User Details</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Joined Date</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <UserIcon size={12} /> {user.userId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        user.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="flex items-center gap-1 text-sm text-emerald-600 font-bold">
                        <CheckCircle2 size={16} /> Active
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{user.joinedDate}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Create New User</h3>
            <p className="text-slate-500 text-sm mb-6">Add a new member to your BizLaunch team.</p>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">User ID</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={newUser.userId}
                  onChange={(e) => setNewUser({...newUser, userId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as "admin" | "user"})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPassModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Change Password</h3>
            <p className="text-slate-500 text-sm mb-6">Update your admin login credentials.</p>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={passForm.old}
                    onChange={(e) => setPassForm({...passForm, old: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={passForm.new}
                    onChange={(e) => setPassForm({...passForm, new: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={passForm.confirm}
                    onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPass ? "Hide Passwords" : "Show Passwords"}
              </button>

              {passError && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle size={16} />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <CheckCircle2 size={16} />
                  <span>Password updated successfully!</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

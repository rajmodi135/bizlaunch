"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit, 
  Search, 
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

import { dataService, type User } from "@/utils/dataService";

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showUserPassModal, setShowUserPassModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPassForm, setUserPassForm] = useState({ new: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [passForm, setPassForm] = useState({ old: "", new: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", userId: "", role: "user" as "admin" | "user", password: "" });
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    // Load users from DataService
    const fetchUsers = async () => {
      const data = await dataService.getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    router.push("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    const currentPass = await dataService.getAdminPassword();
    
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

    dataService.setAdminPassword(passForm.new);
    
    // Also update the admin user in the list
    const updatedUsers = users.map(u => 
      u.userId.toLowerCase() === "bizlaunch" ? { ...u, password: passForm.new } : u
    );
    setUsers(updatedUsers);
    await dataService.saveUsers(updatedUsers);

    setPassSuccess(true);
    setPassForm({ old: "", new: "", confirm: "" });
    setTimeout(() => setShowPassModal(false), 2000);
  };

  const handleUserPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    
    if (!selectedUser) return;
    if (userPassForm.new !== userPassForm.confirm) {
      setPassError("Passwords do not match.");
      return;
    }
    if (userPassForm.new.length < 4) {
      setPassError("Password must be at least 4 characters.");
      return;
    }

    await dataService.updateUser(selectedUser.id, { password: userPassForm.new });
    
    // If we updated the main admin, sync the global admin password too
    if (selectedUser.userId.toLowerCase() === "bizlaunch") {
      dataService.setAdminPassword(userPassForm.new);
    }

    // Refresh UI
    const data = await dataService.getUsers();
    setUsers(data);

    setPassSuccess(true);
    setTimeout(() => {
      setShowUserPassModal(false);
      setSelectedUser(null);
      setUserPassForm({ new: "", confirm: "" });
      setPassSuccess(false);
    }, 1500);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newUser.name || !newUser.userId || !newUser.password) {
      alert("Please fill in all fields.");
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name.trim(),
      userId: newUser.userId.trim(),
      role: newUser.role,
      status: "active",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      password: newUser.password.trim()
    };
    
    await dataService.addUser(user);
    const data = await dataService.getUsers();
    setUsers(data);
    setNewUser({ name: "", userId: "", role: "user", password: "" });
    setShowAddModal(false);
  };

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await dataService.deleteUser(id);
      const data = await dataService.getUsers();
      setUsers(data);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <nav className="bg-background border-b border-border px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-lg shadow-black/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-900/20">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Admin Console</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowPassModal(true)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-foreground transition-colors bg-card px-4 py-2 rounded-xl border border-border hover:border-slate-400"
          >
            <Key size={18} /> Password
          </button>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-foreground transition-colors bg-card px-4 py-2 rounded-xl border border-border hover:border-slate-400"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">User Management</h2>
            <p className="text-slate-500 mt-2 font-medium">Manage accounts and permissions for BizLaunch.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 active:scale-95"
          >
            <UserPlus size={20} /> Create New User
          </button>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl shadow-black/5 overflow-hidden transition-colors">
          <div className="p-8 border-b border-border bg-card/50">
            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search users by name or ID..."
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-border">
                  <th className="px-10 py-5">User Details</th>
                  <th className="px-10 py-5">Role</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5">Joined Date</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-border/10 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shadow-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                            <UserIcon size={14} className="text-slate-600" /> {user.userId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                        user.role === "admin" 
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="flex items-center gap-2 text-sm text-emerald-500 font-bold bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10 w-fit">
                        <CheckCircle2 size={16} /> Active
                      </span>
                    </td>
                    <td className="px-10 py-8 text-sm text-slate-500 font-medium">{user.joinedDate}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserPassModal(true);
                          }}
                          className="p-3 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all border border-transparent hover:border-blue-400/20"
                          title="Change User Password"
                        >
                          <Key size={20} />
                        </button>
                        <button className="p-3 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all border border-transparent hover:border-blue-400/20">
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20"
                        >
                          <Trash2 size={20} />
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card rounded-[2.5rem] shadow-2xl border border-border max-w-md w-full p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Create User</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Add a new member to your BizLaunch team.</p>
            
            <form onSubmit={handleAddUser} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">User ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rajmodi"
                  className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                  value={newUser.userId}
                  onChange={(e) => setNewUser({...newUser, userId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Password</label>
                <input
                  type="text"
                  required
                  placeholder="Set login password"
                  className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Role</label>
                <select
                  className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all appearance-none"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as "admin" | "user" })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-border/50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPassModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card rounded-[2.5rem] shadow-2xl border border-border max-w-md w-full p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Admin Password</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Update your secure login credentials.</p>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                    value={passForm.old}
                    onChange={(e) => setPassForm({...passForm, old: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                    value={passForm.new}
                    onChange={(e) => setPassForm({...passForm, new: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                    value={passForm.confirm}
                    onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-foreground transition-colors ml-1"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPass ? "Hide Passwords" : "Show Passwords"}
              </button>

              {passError && (
                <div className="flex items-center gap-3 text-red-400 text-sm bg-red-400/5 p-4 rounded-2xl border border-red-400/10">
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="font-medium">{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="flex items-center gap-3 text-emerald-500 text-sm bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span className="font-medium">Password updated successfully!</span>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-border/50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserPassModal && selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card rounded-[2.5rem] shadow-2xl border border-border max-w-md w-full p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">User Password</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">Updating for {selectedUser.name}</p>
            
            <form onSubmit={handleUserPasswordChange} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                    value={userPassForm.new}
                    onChange={(e) => setUserPassForm({...userPassForm, new: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                    value={userPassForm.confirm}
                    onChange={(e) => setUserPassForm({...userPassForm, confirm: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-foreground transition-colors ml-1"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPass ? "Hide Passwords" : "Show Passwords"}
              </button>

              {passError && (
                <div className="flex items-center gap-3 text-red-400 text-sm bg-red-400/5 p-4 rounded-2xl border border-red-400/10">
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="font-medium">{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="flex items-center gap-3 text-emerald-500 text-sm bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span className="font-medium">Password updated successfully!</span>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowUserPassModal(false);
                    setSelectedUser(null);
                    setUserPassForm({ new: "", confirm: "" });
                    setPassError("");
                  }}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-border/50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

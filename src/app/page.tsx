"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowUpRight,
  Clock,
  ExternalLink
} from "lucide-react";
import { dataService } from "@/utils/dataService";

export default function Dashboard() {
  const [userName, setUserName] = useState("Guest");
  const [greeting, setGreeting] = useState("Welcome back");
  const [leadCount, setLeadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const fetchStats = async () => {
      const leads = await dataService.getLeads();
      setLeadCount(leads.length);
    };
    fetchStats();
  }, []);

  const stats = [
    { name: "Active Leads", value: leadCount.toString(), change: "+12%", icon: Target, color: "bg-blue-500" },
    { name: "Closed Deals", value: "0", change: "+0%", icon: Users, color: "bg-emerald-500" },
    { name: "Avg Deal Size", value: "$0", change: "+0%", icon: DollarSign, color: "bg-purple-500" },
    { name: "Conversion Rate", value: "0%", change: "+0%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  const recentActivity = [
    { business: "Bakery & Co", action: "New Lead", time: "2h ago", status: "New" },
    { business: "Auto Fix", action: "Email Opened", time: "4h ago", status: "Pending" },
    { business: "Law Firm", action: "Meeting Booked", time: "1d ago", status: "Active" },
  ];

  return (
    <div className="p-8 bg-background min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">
            {greeting}, {userName}!
          </h1>
          <p className="text-slate-500 text-lg font-medium">Here's what's happening with your agency today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-card backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-border hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={stat.color + " p-3 rounded-xl text-white shadow-lg shadow-blue-900/20"}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-emerald-500 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={16} />
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card backdrop-blur-sm rounded-3xl p-8 border border-border shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Clock className="text-blue-400" /> Recent Activity
            </h2>
            <button className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-border/30 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-border/50 rounded-xl flex items-center justify-center text-blue-400 font-bold">
                      {item.business.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{item.business}</p>
                      <p className="text-slate-500 text-sm">{item.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{item.time}</p>
                    <span className="text-xs px-2 py-1 bg-border/50 text-slate-500 rounded-lg border border-border font-medium">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-border/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                  <Clock size={32} className="text-slate-500" />
                </div>
                <p className="text-slate-500 font-medium">No recent activity to show.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Ready to scale?</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">Use our Maps-powered tool to find businesses in your area that are missing a digital presence.</p>
            <button 
              onClick={() => router.push("/prospects")}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Find New Prospects <ExternalLink size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

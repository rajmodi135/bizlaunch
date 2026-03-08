import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowUpRight,
  Clock,
  ExternalLink
} from "lucide-react";

const stats = [
  { name: "Total Prospects", value: "0", change: "+0%", icon: Target, color: "bg-blue-500" },
  { name: "Active Clients", value: "0", change: "+0%", icon: Users, color: "bg-emerald-500" },
  { name: "Avg Deal Size", value: "$0", change: "+0%", icon: DollarSign, color: "bg-purple-500" },
  { name: "Conversion Rate", value: "0%", change: "+0%", icon: TrendingUp, color: "bg-orange-500" },
];

const recentActivity: any[] = [];

export default function Dashboard() {
  const [userName, setUserName] = useState("Guest");
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900">
            {greeting}, {userName}!
          </h1>
          <p className="text-slate-500 text-lg">Here's what's happening with your agency today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={stat.color + " p-3 rounded-xl text-white"}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                {stat.change} <ArrowUpRight size={14} />
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900">Recent Prospects</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-xl">
                    <Clock className="text-slate-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.business}</h4>
                    <p className="text-sm text-slate-500">{item.action} • {item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                    {item.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
            <Target size={40} />
          </div>
          <h3 className="font-bold text-xl text-slate-900">Find New Prospects</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Ready to scale? Use our Maps-powered tool to find businesses in your area that are missing a digital presence.
          </p>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 mt-4">
            Start Searching
          </button>
        </div>
      </div>
    </div>
  );
}

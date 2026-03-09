"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Download,
  MoreVertical,
  Calendar
} from "lucide-react";

type Proposal = {
  id: string;
  client: string;
  type: string;
  date: string;
  value: string;
  status: string;
  color: string;
};

const proposals: Proposal[] = [];

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProposals = proposals.filter(p => 
    p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-background min-h-screen text-foreground transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Proposals</h1>
          <p className="text-slate-500">Track and manage your project quotes and contracts.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
          <Plus size={18} /> New Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm backdrop-blur-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-slate-500">Total Sent</h3>
          </div>
          <p className="text-3xl font-black text-foreground">12</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Last 30 days</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm backdrop-blur-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold text-slate-500">Accepted</h3>
          </div>
          <p className="text-3xl font-black text-foreground">8</p>
          <p className="text-xs text-slate-500 font-medium mt-1">66% Conversion rate</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm backdrop-blur-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-slate-500">Pending</h3>
          </div>
          <p className="text-3xl font-black text-foreground">4</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Awaiting response</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden backdrop-blur-sm transition-colors">
        <div className="p-6 border-b border-border">
          <div className="relative max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search proposals..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredProposals.map((proposal) => (
            <div key={proposal.id} className="p-6 flex items-center justify-between hover:bg-border/30 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="bg-background border border-border p-4 rounded-2xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">{proposal.client}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-slate-500 font-medium">{proposal.type}</span>
                    <span className="text-border">•</span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar size={14} /> {proposal.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-bold text-foreground">{proposal.value}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black border mt-1 inline-block ${proposal.color}`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-500 hover:text-foreground hover:bg-border rounded-lg transition-all">
                    <Download size={20} />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-foreground hover:bg-border rounded-lg transition-all">
                    <MoreVertical size={20} />
                  </button>
                  <button className="ml-4 bg-background border border-border text-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-foreground hover:text-background transition-all">
                    View <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-foreground font-bold text-lg">No proposals found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

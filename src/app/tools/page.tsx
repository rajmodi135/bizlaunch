"use client";

import { useState } from "react";
import { 
  Zap, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  FileText,
  Download,
  Share2
} from "lucide-react";

type AuditIssue = {
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
};

type AuditOpportunity = {
  title: string;
  impact: "High" | "Medium" | "Low";
  description: string;
};

type AuditReport = {
  score: number;
  businessName: string;
  issues: AuditIssue[];
  opportunities: AuditOpportunity[];
};

const auditPoints = [
  { name: "Google Maps Presence", weight: 20 },
  { name: "Website Availability", weight: 30 },
  { name: "Mobile Responsiveness", weight: 15 },
  { name: "Page Speed", weight: 15 },
  { name: "SEO Basics", weight: 10 },
  { name: "Social Links", weight: 10 },
];

export default function AuditTools() {
  const [url, setUrl] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);

  const runAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    setTimeout(() => {
      setReport({
        score: 42,
        businessName: "Golden Dragon Chinese",
        issues: [
          { title: "No Website Found", severity: "critical", description: "This business is missing a website, losing ~30% of potential customers." },
          { title: "Unclaimed Maps Profile", severity: "high", description: "The Google Maps profile hasn't been verified by the owner." },
          { title: "Limited Social Media", severity: "medium", description: "Only a basic Facebook page with no recent posts." },
        ],
        opportunities: [
          { title: "Online Ordering", impact: "High", description: "Add online ordering to increase revenue by 15-20%." },
          { title: "SEO Strategy", impact: "Medium", description: "Target 'best chinese food near me' keywords." },
        ]
      });
      setIsAuditing(false);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-background min-h-screen text-foreground transition-colors">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-foreground">Digital Audit Tool</h1>
        <p className="text-slate-500 text-base md:text-lg">Generate a professional audit report for any prospect in seconds.</p>
      </div>

      <div className="bg-card p-4 md:p-8 rounded-[1.75rem] md:rounded-[2.5rem] shadow-2xl border border-border mb-6 md:mb-8 backdrop-blur-sm transition-colors">
        <form onSubmit={runAudit} className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Business Name or URL"
              className="w-full pl-14 pr-4 md:pr-6 py-4 md:py-5 bg-background border border-border rounded-2xl md:rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg md:text-xl font-bold text-foreground placeholder:text-slate-600 shadow-inner"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isAuditing}
            className="bg-blue-600 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-base md:text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 md:gap-3 disabled:bg-border disabled:text-slate-500 border border-blue-400/20"
          >
            {isAuditing ? <Loader2 className="animate-spin" size={28} /> : (
              <>
                <Zap size={28} className="fill-white" /> Run Audit
              </>
            )}
          </button>
        </form>
      </div>

      {report && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-xl flex flex-col items-center justify-center text-center backdrop-blur-sm transition-colors">
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-border"
                    strokeDasharray="100, 100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                    strokeDasharray={`${report.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-5xl font-black text-foreground leading-none block">{report.score}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 block">Score</span>
                </div>
              </div>
              <h3 className="font-black text-foreground text-2xl mb-1">{report.businessName}</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Critical Issues Found</p>
            </div>

            <div className="md:col-span-2 bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-xl backdrop-blur-sm transition-colors">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="font-black text-2xl text-foreground">Key Audit Points</h3>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-background px-3 py-1.5 rounded-full border border-border">Simulated</span>
              </div>
              <div className="space-y-6">
                {auditPoints.map((point) => (
                  <div key={point.name} className="flex items-center justify-between group">
                    <span className="text-slate-500 font-bold text-lg group-hover:text-foreground transition-colors">{point.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-3 bg-background rounded-full overflow-hidden border border-border p-0.5 shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${point.weight > 15 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`} 
                          style={{ width: `${point.weight * 5}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-black text-slate-500 w-10 text-right tracking-tighter">{point.weight * 5}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4">
              <h3 className="font-black text-2xl text-foreground flex items-center gap-3">
                <XCircle className="text-red-500" /> Critical Issues
              </h3>
              {report.issues.map((issue, idx) => (
                <div key={idx} className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 hover:bg-red-500/10 transition-colors group">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="text-red-500 shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                    <div>
                      <h4 className="font-black text-red-500 text-lg mb-1">{issue.title}</h4>
                      <p className="text-slate-500 leading-relaxed font-medium">{issue.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-2xl text-foreground flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" /> Opportunities
              </h3>
              {report.opportunities.map((opp, idx) => (
                <div key={idx} className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors group">
                  <div className="flex items-start gap-4">
                    <Zap className="text-emerald-500 shrink-0 mt-1 group-hover:scale-110 transition-transform fill-emerald-500/20" size={24} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-emerald-500 text-lg">{opp.title}</h4>
                        <span className="text-[10px] uppercase tracking-widest font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg border border-emerald-500/20">
                          {opp.impact} Impact
                        </span>
                      </div>
                      <p className="text-slate-500 leading-relaxed font-medium">{opp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <button className="flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl border border-foreground/20">
              <Download size={22} /> Download PDF Report
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-card text-foreground rounded-2xl font-black text-lg hover:bg-border/50 transition-all border border-border">
              <Share2 size={22} /> Share Report
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-blue-600/10 text-blue-500 rounded-2xl font-black text-lg hover:bg-blue-600/20 transition-all border border-blue-500/20">
              <FileText size={22} /> Create Proposal
            </button>
          </div>
        </div>
      )}

      {!report && !isAuditing && (
        <div className="text-center py-24 bg-card/30 rounded-[3rem] border-2 border-dashed border-border transition-colors">
          <div className="bg-card w-24 h-24 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 transform -rotate-12 border border-border">
            <FileText size={48} className="text-slate-500" />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">Ready to Audit?</h3>
          <p className="text-slate-500 text-lg max-w-sm mx-auto font-medium">Enter a business name or URL above to generate a professional digital audit report.</p>
        </div>
      )}
    </div>
  );
}

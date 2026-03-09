"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Globe,
  Phone,
  Plus,
  Loader2,
  CheckCircle2,
  Settings
} from "lucide-react";
import { dataService } from "@/utils/dataService";

type ProspectResult = {
  id: string;
  name: string;
  rating: number;
  address: string;
  phone?: string;
  website?: string | null;
  category: string;
};

const SUGGESTED_CITIES = ["Jaipur", "Delhi", "Mumbai", "Bangalore", "New York", "London"];
const SUGGESTED_CATEGORIES = ["Cafe", "Restaurant", "Dentist", "Plumber", "Gym", "Bakery"];

export default function ProspectFinder() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ProspectResult[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(4.0);
  const [onlyNoWebsite, setOnlyNoWebsite] = useState(true);
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const isStaticDemo = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("google_maps_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("google_maps_api_key", key);
    setShowApiSetup(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query && !location) return;

    setIsSearching(true);
    setIsSimulated(false);
    
    try {
      if (isStaticDemo) {
        setResults([
          { id: "1", name: "The Coffee House", rating: 4.8, address: `123 Main St, ${location || 'Your City'}`, phone: "555-0123", website: "", category: query || "Cafe" },
          { id: "2", name: "Green Garden Bistro", rating: 4.2, address: `456 Oak Ave, ${location || 'Your City'}`, phone: "555-0456", website: "", category: query || "Restaurant" },
          { id: "3", name: "Modern Auto Repair", rating: 4.5, address: `789 Pine Rd, ${location || 'Your City'}`, phone: "555-0789", website: "", category: query || "Auto Services" },
        ]);
        setIsSimulated(true);
      } else {
        const response = await fetch(`/api/prospects?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const normalized: ProspectResult[] = (data.results || []).map((r: unknown) => {
          const rec = r as Record<string, unknown>;
          const id = String(rec.id ?? rec.place_id ?? "");
          const name = String(rec.name ?? "");
          const rating = typeof rec.rating === "number" ? (rec.rating as number) : Number(rec.rating) || 0;
          const address = String(rec.address ?? rec.formatted_address ?? "");
          const phone = rec.phone ? String(rec.phone) : undefined;
          const website = (rec.website as string | null | undefined) ?? null;
          const category = String(rec.category ?? "Business");
          return { id, name, rating, address, phone, website, category };
        });
        setResults(normalized);
        setIsSimulated(data.isSimulated);
      }
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback results if API fails or no key
      setResults([
        { id: "1", name: "The Coffee House", rating: 4.8, address: `123 Main St, ${location || 'Your City'}`, phone: "555-0123", website: "", category: "Cafe" },
        { id: "2", name: "Green Garden Bistro", rating: 4.2, address: `456 Oak Ave, ${location || 'Your City'}`, phone: "555-0456", website: "", category: "Restaurant" },
        { id: "3", name: "Modern Auto Repair", rating: 4.5, address: `789 Pine Rd, ${location || 'Your City'}`, phone: "555-0789", website: "", category: "Auto Services" },
      ]);
      setIsSimulated(true);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = results.filter(biz => {
    const matchesRating = biz.rating >= minRating;
    const matchesWebsite = onlyNoWebsite ? !biz.website : true;
    const matchesPhone = onlyWithPhone ? Boolean(biz.phone && String(biz.phone).trim()) : true;
    return matchesRating && matchesWebsite && matchesPhone;
  });

  const addToCRM = async (biz: ProspectResult) => {
    setAddedIds(prev => [...prev, biz.id]);
    await dataService.addLead({
      id: biz.id,
      name: biz.name,
      category: biz.category,
      status: "New Lead",
      addedDate: new Date().toLocaleDateString(),
      phone: biz.phone,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    });
  };

  const selectSuggestion = (type: 'city' | 'category', value: string) => {
    if (type === 'city') setLocation(value);
    else setQuery(value);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto relative bg-background min-h-screen text-foreground transition-colors">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">Prospect Finder</h1>
          <p className="text-slate-500 text-lg">Search Google Maps for high-rated businesses without a website.</p>
        </div>
        {!isStaticDemo && (
          <button 
            onClick={() => setShowApiSetup(true)}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
              apiKey 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
            }`}
          >
            <Settings size={18} />
            {apiKey ? "API Key Connected" : "Connect API Key"}
          </button>
        )}
        {isStaticDemo && (
          <div className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Static Demo Mode
          </div>
        )}
      </div>

      {showApiSetup && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card rounded-3xl shadow-2xl border border-border max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-foreground mb-2">Setup API Key</h3>
            <p className="text-slate-500 text-sm mb-6">Enter your Google Maps API Key to start fetching real-time data.</p>
            
            <input
              type="password"
              placeholder="Paste your API key here"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-slate-600 transition-all"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowApiSetup(false)}
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-border/50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveApiKey(apiKey)}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                Save Key
              </button>
            </div>
            
            <p className="mt-6 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
              Key is stored locally in your browser
            </p>
          </div>
        </div>
      )}

      <div className="bg-card backdrop-blur-sm p-8 rounded-3xl border border-border shadow-xl mb-8 transition-colors">
        <form onSubmit={handleSearch} className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Business category (e.g. Restaurants, Plumbers)"
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Location (e.g. Springfield)"
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-foreground transition-all placeholder:text-slate-600"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isSearching ? <Loader2 className="animate-spin" size={20} /> : "Find Prospects"}
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggested Categories:</span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => selectSuggestion('category', cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      query === cat 
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20" 
                        : "bg-background text-slate-500 border-border hover:border-slate-500 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggested Cities:</span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_CITIES.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectSuggestion('city', city)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      location === city 
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20" 
                        : "bg-background text-slate-500 border-border hover:border-slate-500 hover:text-foreground"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-border/50">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500">Min Rating:</span>
              <div className="flex gap-2">
                {[3, 3.5, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      minRating === r 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                        : "bg-background text-slate-500 border-border hover:border-slate-600"
                    }`}
                  >
                    {r}+ ⭐
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={onlyNoWebsite}
                  onChange={() => setOnlyNoWebsite(!onlyNoWebsite)}
                />
                <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-bold text-slate-500 group-hover:text-foreground transition-colors">Only missing website</span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={onlyWithPhone}
                  onChange={() => setOnlyWithPhone(!onlyWithPhone)}
                />
                <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-bold text-slate-500 group-hover:text-foreground transition-colors">Only with phone number</span>
            </label>
          </div>
        </form>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">{filteredResults.length} Results Found</h2>
              {isSimulated && (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-amber-500/20">
                  Mock Data (Missing API Key)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredResults.map((biz) => (
              <div key={biz.id} className="bg-card backdrop-blur-sm p-8 rounded-3xl border border-border shadow-xl hover:border-blue-500/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-lg mb-3 inline-block">
                      {biz.category}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{biz.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl font-bold border border-amber-500/20">
                    <Star size={18} fill="currentColor" />
                    {biz.rating}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-slate-500 text-sm font-medium">
                    <MapPin size={18} className="text-slate-500 mt-0.5" />
                    <span>{biz.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Phone size={18} className="text-slate-500" />
                    <span>{biz.phone || "Phone not listed"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-400 text-sm font-bold bg-red-400/5 p-3 rounded-2xl border border-red-400/10">
                    <Globe size={18} />
                    <span>No website detected</span>
                  </div>
                </div>

                <button 
                  onClick={() => addToCRM(biz)}
                  disabled={addedIds.includes(biz.id)}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    addedIds.includes(biz.id) 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {addedIds.includes(biz.id) ? (
                    <>
                      <CheckCircle2 size={20} /> Added to CRM
                    </>
                  ) : (
                    <>
                      <Plus size={20} /> Add to CRM
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching && results.length === 0 && (
        <div className="text-center py-24 bg-card/30 rounded-[40px] border-2 border-dashed border-border transition-colors">
          <div className="bg-card w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 border border-border">
            <Search size={40} className="text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Ready to find new clients?</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">Enter a category and location to find businesses that need your help building a professional website.</p>
        </div>
      )}
    </div>
  );
}

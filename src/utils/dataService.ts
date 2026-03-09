
import { supabase } from './supabase';

// Types for our data model
export type User = {
  id: string;
  name: string;
  userId: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  joinedDate: string;
  password?: string;
};

export type Lead = {
  id: string;
  name: string;
  status: string;
  category: string;
  addedDate: string;
  phone?: string;
  email?: string;
  color: string;
};

const USERS_KEY = "bizlaunch_users";
const LEADS_KEY = "bizlaunch_leads";
const ADMIN_PASS_KEY = "admin_password";

/**
 * DataService handles all application data persistence.
 * Transitioning from localStorage to Supabase for global access.
 */
export const dataService = {
  // --- USER MANAGEMENT ---
  
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data) return data as User[];
      
      if (typeof window === "undefined") return [];
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  addUser: async (user: User) => {
    try {
      const { error } = await supabase.from('users').insert([user]);
      if (error) throw error;
    } catch {
      const users = await dataService.getUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    }
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase.from('users').update(updates).eq('id', id);
      if (error) throw error;
    } catch {
      const users = await dataService.getUsers();
      const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    }
  },

  deleteUser: async (id: string) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
    } catch {
      const users = await dataService.getUsers();
      const updated = users.filter(u => u.id !== id);
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    }
  },

  saveUsers: async (users: User[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  // --- AUTH HELPERS ---

  getAdminPassword: async (): Promise<string> => {
    if (typeof window === "undefined") return "Jaipur@6621";
    return localStorage.getItem(ADMIN_PASS_KEY) || "Jaipur@6621";
  },

  setAdminPassword: (pass: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_PASS_KEY, pass);
  },

  // --- CRM MANAGEMENT ---

  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase.from('leads').select('*');
      if (!error && data) return data as Lead[];
      
      if (typeof window === "undefined") return [];
      const stored = localStorage.getItem(LEADS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      const stored = localStorage.getItem(LEADS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  addLead: async (lead: Lead) => {
    try {
      const { error } = await supabase.from('leads').insert([lead]);
      if (error) throw error;
    } catch {
      const leads = await dataService.getLeads();
      if (typeof window !== "undefined") {
        localStorage.setItem(LEADS_KEY, JSON.stringify([...leads, lead]));
      }
    }
  },
};


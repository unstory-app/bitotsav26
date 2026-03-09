"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, AlertTriangle, Users, Ticket, Trophy, Calendar, UserPlus, LayoutDashboard } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check session storage for persistence within the session
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth") === "true";
    if (isAuth) setAuthorized(true);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "anwita") {
      setAuthorized(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setError(true);
      setPasscode("");
      setTimeout(() => setError(false), 2000);
    }
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Tickets", icon: Ticket, href: "/admin/tickets" },
    { label: "Teams", icon: Trophy, href: "/admin/teams" },
    { label: "Events", icon: Calendar, href: "/admin/events" },
    { label: "Participants", icon: UserPlus, href: "/admin/participants" },
  ];

  if (!authorized) {
    return (
      <PageWrapper className="min-h-screen bg-[#1A0505] flex items-center justify-center p-6 pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-10 md:p-16 relative z-10"
        >
          <div className="flex flex-col items-center text-center space-y-8">
            <div className={`p-6 rounded-full transition-colors duration-500 ${error ? 'bg-red-600/20 text-red-600' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
              {error ? <AlertTriangle className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading">RESTRICTED <span className="text-[#D4AF37]">ACCESS.</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/40 font-heading">ADMINISTRATIVE OVERRIDE REQUIRED</p>
            </div>

            <form onSubmit={handleVerify} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/60 block font-heading">ENTER PASSCODE</label>
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-center text-2xl focus:border-[#D4AF37] outline-hidden font-heading"
                  placeholder="••••••"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all font-heading"
              >
                AUTHORIZE SESSION
              </button>
            </form>
          </div>
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0505] flex overflow-hidden font-heading">
      {/* Sidebar */}
      <aside className="w-72 bg-[#140808] border-r border-[#D4AF37]/10 flex flex-col z-50">
        <div className="p-8 border-b border-[#D4AF37]/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#D4AF37] flex items-center justify-center font-black italic text-black text-sm">N</div>
            <h2 className="text-xl font-black italic text-[#FDF5E6] uppercase tracking-tighter">NEXUS.</h2>
          </div>
          <p className="text-[8px] text-[#D4AF37]/40 font-black uppercase tracking-[0.4em]">ADMIN v2.5</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full p-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all group relative",
                pathname === item.href 
                  ? "bg-[#D4AF37] text-black" 
                  : "text-[#FDF5E6]/40 hover:bg-white/5 hover:text-[#FDF5E6]"
              )}
            >
              <item.icon className={cn("w-4 h-4", pathname === item.href ? "text-black" : "text-[#D4AF37]/40 group-hover:text-[#D4AF37]")} />
              {item.label}
              {pathname === item.href && <div className="absolute left-0 w-1 h-1/2 bg-black top-1/4" />}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-[#D4AF37]/10">
           <div className="p-4 bg-white/5 border border-white/10 space-y-2 text-center">
              <p className="text-[8px] font-black uppercase text-[#D4AF37]/60">SERVER STATUS</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-[#FDF5E6] uppercase">OPERATIONAL</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0A0505] relative">
        {children}
      </main>
    </div>
  );
}

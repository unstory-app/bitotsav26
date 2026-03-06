import Link from "next/link";
import { Github, Twitter, Instagram, Heart, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full relative z-10 bg-black text-white overflow-hidden border-t-4 border-[#DFFF00]">
        
        <div className="relative pt-20 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black italic leading-none tracking-tighter text-white mb-2 uppercase">
                                {SITE_CONFIG.shortName} <span className="text-[#DFFF00]">2026</span>
                            </h2>
                            <p className="text-[#DFFF00] font-black italic uppercase tracking-widest text-sm">
                                {SITE_CONFIG.edition} / {SITE_CONFIG.venue.name}
                            </p>
                        </div>
                        
                        <div className="max-w-md border-l-4 border-[#DFFF00] pl-6 py-2">
                            <p className="text-white font-black italic text-xl uppercase leading-tight mb-4">
                                {SITE_CONFIG.tagline}
                            </p>
                            <p className="text-white/40 text-sm font-bold uppercase tracking-wider leading-relaxed">
                                Experience the fusion of culture and innovation. 
                                JOIN THE LEgendary Saga from {SITE_CONFIG.dates.short}.
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h3 className="text-lg font-black italic text-[#DFFF00] uppercase tracking-widest">
                            Site Map
                        </h3>
                        <ul className="space-y-4 text-white/60 font-black italic uppercase text-lg">
                            <li><Link href="/events" className="hover:text-[#DFFF00] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-white/20 group-hover:bg-[#DFFF00] transition-colors" /> Events</Link></li>
                            <li><Link href="/schedule" className="hover:text-[#DFFF00] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-white/20 group-hover:bg-[#DFFF00] transition-colors" /> Schedule</Link></li>
                            <li><Link href="/sponsors" className="hover:text-[#DFFF00] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-white/20 group-hover:bg-[#DFFF00] transition-colors" /> Sponsors</Link></li>
                            <li><Link href="/login" className="hover:text-[#DFFF00] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-white/20 group-hover:bg-[#DFFF00] transition-colors" /> Register</Link></li>
                            <li><Link href="/team" className="hover:text-[#DFFF00] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-white/20 group-hover:bg-[#DFFF00] transition-colors" /> Team</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-8">
                        <h3 className="text-lg font-black italic text-[#DFFF00] uppercase tracking-widest">
                            Pulse
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { Icon: Instagram, href: SITE_CONFIG.socials.instagram },
                                { Icon: Twitter, href: SITE_CONFIG.socials.twitter },
                                { Icon: Github, href: "https://github.com/bitotsav" },
                                { Icon: ShieldCheck, href: "/helpdesk" }
                            ].map(({ Icon, href }, i) => (
                                <Link 
                                    key={i} 
                                    href={href} 
                                    className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#DFFF00] hover:text-black hover:border-transparent transition-all"
                                >
                                    <Icon className="w-6 h-6" />
                                </Link>
                            ))}
                        </div>
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">
                            Stay updated via @bitotsav
                        </p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-[10px] font-black italic uppercase text-white/20 tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center text-[10px] font-black italic uppercase text-white/40 tracking-[0.2em]">
                            Developed by <a href="https://sh20raj.github.io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#DFFF00] transition-colors ml-2 bg-white/5 px-2 py-1">Shaswat Raj</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-white/20">
                            <span className="text-[10px] font-bold uppercase tracking-widest">FORGED WITH</span>
                            <Heart className="w-4 h-4 text-[#DFFF00] fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">FOR THE LEGACY</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Massive Watermark */}
        <div className="absolute -bottom-20 -left-20 text-[25vw] font-black italic text-white/5 select-none pointer-events-none leading-none tracking-tighter">
            BITOTSAV
        </div>

        {/* SEO Backlinks (Visually Hidden) */}
        <div className="sr-only" aria-hidden="true">
            Discover more at <a href="https://30tools.com" title="30 Tools">30tools.com</a> and <a href="https://strivio.world" title="Strivio World">strivio.world</a>.
        </div>

    </footer>
  );
}

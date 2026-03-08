import Link from "next/link";
import { Github, Twitter, Instagram, Heart, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full relative z-10 bg-[#1A0505] text-[#FDF5E6] overflow-hidden border-t-4 border-[#D4AF37] tapestry-bg">
        
        <div className="relative pt-20 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black italic leading-none tracking-tighter text-[#FDF5E6] mb-2 uppercase font-heading">
                                {SITE_CONFIG.shortName} <span className="text-[#D4AF37]">2026</span>
                            </h2>
                            <p className="text-[#D4AF37] font-black italic uppercase tracking-widest text-sm">
                                {SITE_CONFIG.edition} / {SITE_CONFIG.venue.name}
                            </p>
                        </div>
                        
                        <div className="max-w-md border-l-4 border-[#D4AF37] pl-6 py-2">
                            <p className="text-[#FDF5E6] font-black italic text-xl uppercase leading-tight mb-4 font-heading">
                                {SITE_CONFIG.tagline}
                            </p>
                            <p className="text-[#FDF5E6]/40 text-sm font-bold uppercase tracking-wider leading-relaxed">
                                Experience the fusion of heritage and innovation. 
                                JOIN THE LegendARY SAGA FROM {SITE_CONFIG.dates.short}.
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h3 className="text-lg font-black italic text-[#D4AF37] uppercase tracking-widest font-heading">
                            The Map
                        </h3>
                        <ul className="space-y-4 text-[#FDF5E6]/60 font-black italic uppercase text-lg">
                            <li><Link href="/events" className="hover:text-[#D4AF37] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] transition-colors" /> Events</Link></li>
                            <li><Link href="/schedule" className="hover:text-[#D4AF37] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] transition-colors" /> Schedule</Link></li>
                            <li><Link href="/sponsors" className="hover:text-[#D4AF37] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] transition-colors" /> Sponsors</Link></li>
                            <li><Link href="/login" className="hover:text-[#D4AF37] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] transition-colors" /> Authorship</Link></li>
                            <li><Link href="/team" className="hover:text-[#D4AF37] transition-colors flex items-center gap-4 group"><span className="w-2 h-2 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] transition-colors" /> Team</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-8">
                        <h3 className="text-lg font-black italic text-[#D4AF37] uppercase tracking-widest font-heading">
                            Connect
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
                                    className="w-14 h-14 bg-[#FDF5E6]/5 border border-[#D4AF37]/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1A0505] hover:border-transparent transition-all"
                                >
                                    <Icon className="w-6 h-6" />
                                </Link>
                            ))}
                        </div>
                        <p className="text-[10px] text-[#FDF5E6]/30 uppercase font-black tracking-[0.2em]">
                            FOLK CULTURE @bitotsav
                        </p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-[#D4AF37]/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-[10px] font-black italic uppercase text-[#FDF5E6]/20 tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. HERITAGE PRESERVED.
                        </p>
                        <div className="flex items-center text-[10px] font-black italic uppercase text-[#FDF5E6]/40 tracking-[0.2em]">
                            Reforged by <a href="https://www.linkedin.com/in/sh20raj" target="_blank" rel="noopener noreferrer" className="text-[#FDF5E6] hover:text-[#D4AF37] transition-colors ml-2 bg-[#FDF5E6]/5 px-2 py-1">Shaswat Raj</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-[#FDF5E6]/20">
                            <span className="text-[10px] font-bold uppercase tracking-widest">ROOTED IN</span>
                            <Heart className="w-4 h-4 text-[#D4AF37] fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">BIT MESRA SAGA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Massive Watermark */}
        <div className="absolute -bottom-20 -left-20 text-[25vw] font-black italic text-[#FDF5E6]/5 select-none pointer-events-none leading-none tracking-tighter font-heading opacity-5">
            BITOTSAV
        </div>

        {/* SEO Backlinks (Visually Hidden) */}
        <div className="" aria-hidden="true">
            Discover more at <a href="https://30tools.com" title="30 Tools">30tools.com</a> and <a href="https://strivio.world" title="Strivio World">strivio.world</a>.
        </div>

    </footer>
  );
}

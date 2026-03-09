import { getLeaderboard } from "@/app/actions/team";
import { Trophy, Medal, Star, Flame } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default async function LeaderboardPage() {
  const result = await getLeaderboard(20);
  const teams = result.success ? result.data || [] : [];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0A0505] text-[#FDF5E6] py-24 px-4 sm:px-8 relative overflow-hidden font-heading">
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-5 tapestry-pattern" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-4 select-none">
              HALER <span className="text-[#D4AF37]">GLORY.</span>
            </h1>
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-[#D4AF37]/60">
              COMMEMORATING THE VALIANCE OF TEAMS // RANKINGS
            </p>
          </div>

          {teams.length === 0 ? (
            <div className="py-40 text-center border-2 border-white/5 bg-white/2 backdrop-blur-md">
              <Trophy className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-6" />
              <p className="text-sm font-black uppercase tracking-widest text-[#D4AF37]/40 italic">The arena is silent. No glory has been claimed yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div 
                    key={team.id}
                    className={`
                      relative flex items-center gap-6 p-6 transition-all border-2
                      ${isFirst ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-105 shadow-[0_0_50px_rgba(212,175,55,0.2)]' : 'bg-white/2 border-white/5 hover:border-[#D4AF37]/30'}
                    `}
                  >
                    {/* Rank Indicator */}
                    <div className={`
                      w-12 h-12 flex items-center justify-center font-black italic text-xl
                      ${isFirst ? 'text-black' : 'text-[#D4AF37]'}
                    `}>
                      {isFirst ? <Trophy className="w-8 h-8" /> : 
                       isSecond ? <Medal className="w-8 h-8 text-[#C0C0C0]" /> :
                       isThird ? <Medal className="w-8 h-8 text-[#CD7F32]" /> :
                       `#${index + 1}`}
                    </div>

                    {/* Team Info */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">
                        {team.name}
                      </h3>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isFirst ? 'text-black/60' : 'text-[#D4AF37]/40'}`}>
                        LED BY {team.leaderName || "UNKNOWN VALIANT"}
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                       <div className="flex items-center gap-2 justify-end">
                         <Flame className={`w-4 h-4 ${isFirst ? 'text-black' : 'text-[#D4AF37]'}`} />
                         <span className="text-2xl md:text-3xl font-black italic tracking-tighter">
                           {team.points}
                         </span>
                       </div>
                       <p className={`text-[8px] font-black uppercase tracking-widest ${isFirst ? 'text-black/40' : 'text-[#D4AF37]/20'}`}>
                         GLORY POINTS
                       </p>
                    </div>

                    {/* Decorative Tapestry for First Place */}
                    {isFirst && (
                       <div className="absolute inset-0 pointer-events-none opacity-10 tapestry-pattern mix-blend-overlay" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-20 p-8 border-2 border-white/5 bg-white/2 backdrop-blur-md text-center">
             <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDF5E6]">HAVE YOUR TEAM READY. THE GAUNTLET IS THROWN.</p>
                <Star className="w-4 h-4 text-[#D4AF37]" />
             </div>
             <p className="text-[8px] text-[#FDF5E6]/40 uppercase max-w-lg mx-auto leading-relaxed tracking-widest font-black">
                POINTS ARE ACCUMULATED THROUGH PARTICIPATION AND TRIUMPH IN VARIOUS EVENTS. 
                ADMINISTRATORS DECREE THE DISTRIBUTION OF GLORY.
             </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

import { PrismFluxLoader } from "@/components/ui/prism-flux-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#120606] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#D4AF37]/10 to-transparent" />
      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
          Bitotsav Identity System
        </div>
        <PrismFluxLoader size={56} speed={5} />
        <div className="space-y-2">
          <p className="text-2xl font-black uppercase tracking-[0.16em] text-[#FDF5E6]">Preparing Your Experience</p>
          <p className="text-sm uppercase tracking-[0.28em] text-[#FDF5E6]/45">Loading premium festival access layers</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import NextImage from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { ArrowRight, Sparkles, Zap, MapPin, CalendarDays, Radio, ScrollText } from "lucide-react";

const revealPillars = [
  {
    title: "The Story",
    body: "Gaatha frames Bitotsav as a living narrative where every performance, rivalry, and celebration adds another page to the festival chronicle.",
  },
  {
    title: "The Pulse",
    body: "The atmosphere merges heritage textures with stage-light energy, so the experience feels rooted in culture but charged like a future-forward spectacle.",
  },
  {
    title: "The Call",
    body: "Participants are not just attendees. They become characters in the edition itself, shaping the memory of the 35th chapter.",
  },
];

const revealMoments = [
  {
    label: "Chapter I",
    title: "Arrival",
    body: "The campus shifts into festival territory: ceremonial, electric, and impossible to ignore.",
  },
  {
    label: "Chapter II",
    title: "Collision",
    body: "Music, arts, competition, and crowd energy meet in one shared narrative of ambition and culture.",
  },
  {
    label: "Chapter III",
    title: "Memory",
    body: "What remains is not just the event lineup, but the story people carry out of Bitotsav.",
  },
];

export default function ThemeRevealContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#140303] text-[#FDF5E6]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(128,0,0,0.32),transparent_24%),linear-gradient(180deg,#160404_0%,#1A0505_48%,#120202_100%)]" />
      <div className="absolute inset-0 pointer-events-none tapestry-pattern opacity-[0.06]" />
      <div className="absolute left-0 right-0 top-0 h-40 bg-linear-to-b from-[#D4AF37]/8 to-transparent pointer-events-none" />

      <section className="relative px-6 pt-28 pb-20 md:px-10 md:pt-36 md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-12 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/8 px-4 py-2">
              <Zap className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-[0.45em] text-[#FDF5E6]/75">
                THEME REVEAL // {SITE_CONFIG.edition}
              </span>
            </div>

            <div className="space-y-5">
              <p className="text-[#D4AF37] text-sm font-black uppercase tracking-[0.55em]">GAATHA</p>
              <h1 className="max-w-5xl text-[20vw] leading-[0.82] tracking-[-0.07em] sm:text-[8rem] md:text-[11rem] xl:text-[12rem] font-heading">
                A LIVING
                <br />
                <span className="text-[#D4AF37]">STORY.</span>
              </h1>
              <div className="max-w-2xl border-l-4 border-[#D4AF37] pl-5 md:pl-7">
                <p className="text-lg md:text-2xl font-black uppercase tracking-[0.12em] text-[#FDF5E6]">
                  Where technology meets culture and every crowd becomes part of the chronicle.
                </p>
              </div>
            </div>

            <div className="grid gap-4 text-left sm:grid-cols-3">
              <div className="border border-[#D4AF37]/15 bg-white/[0.03] p-5 backdrop-blur-sm">
                <CalendarDays className="mb-4 h-5 w-5 text-[#D4AF37]" />
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#FDF5E6]/45">Chronicle</p>
                <p className="mt-2 text-xl font-black uppercase tracking-[0.08em]">{SITE_CONFIG.dates.short}</p>
              </div>
              <div className="border border-[#D4AF37]/15 bg-white/[0.03] p-5 backdrop-blur-sm">
                <MapPin className="mb-4 h-5 w-5 text-[#D4AF37]" />
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#FDF5E6]/45">Territory</p>
                <p className="mt-2 text-xl font-black uppercase tracking-[0.08em]">{SITE_CONFIG.venue.name}</p>
              </div>
              <div className="border border-[#D4AF37]/15 bg-white/[0.03] p-5 backdrop-blur-sm">
                <Radio className="mb-4 h-5 w-5 text-[#D4AF37]" />
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#FDF5E6]/45">Commencement</p>
                <p className="mt-2 text-xl font-black uppercase tracking-[0.08em]">{SITE_CONFIG.time}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link href={SITE_CONFIG.links.registration} className="group">
                <div className="flex items-center justify-between gap-6 bg-[#D4AF37] px-8 py-5 text-[#1A0505] transition-colors hover:bg-[#FDF5E6]">
                  <span className="text-lg font-black uppercase tracking-[0.16em]">Claim Your Passage</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
              <Link href={SITE_CONFIG.links.events} className="group">
                <div className="flex items-center justify-between gap-6 border border-[#D4AF37]/25 bg-white/[0.03] px-8 py-5 text-[#FDF5E6] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/8">
                  <span className="text-lg font-black uppercase tracking-[0.16em]">Read The Chapters</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-3xl" />
            <div className="relative overflow-hidden border border-[#D4AF37]/25 bg-[#210606]/90 p-5 md:p-6">
              <div className="grid gap-5 lg:grid-cols-[0.62fr_0.38fr]">
                <div className="relative min-h-[420px] overflow-hidden border border-[#D4AF37]/20 bg-[#140303] md:min-h-[560px]">
                  <NextImage
                    src="/assets/gaatha.png"
                    alt="Gaatha theme art"
                    fill
                    className="object-cover object-center opacity-90"
                    sizes="(max-width: 1280px) 100vw, 700px"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#140303] via-transparent to-transparent" />
                  <div className="absolute left-0 top-0 h-24 w-24 border-l border-t border-[#D4AF37]/35" />
                  <div className="absolute bottom-0 right-0 h-24 w-24 border-b border-r border-[#D4AF37]/35" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#D4AF37]">Theme Signal</p>
                    <p className="mt-3 max-w-lg text-base md:text-lg font-black uppercase tracking-[0.14em] text-[#FDF5E6]">
                      Gaatha turns the edition into a crafted narrative of arrival, energy, rivalry, and memory.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="border border-[#D4AF37]/20 bg-[#120202] p-5 md:p-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/65">Festival Cipher</p>
                    <div className="relative mt-5 aspect-[4/3] overflow-hidden border border-[#D4AF37]/15 bg-[#0f0202] p-6">
                      <NextImage
                        src="/assets/folks.png"
                        alt="Folk emblem"
                        fill
                        className="object-contain p-5 opacity-90"
                        sizes="320px"
                      />
                    </div>
                  </div>

                  <div className="border border-[#D4AF37]/20 bg-[#120202] p-5 md:p-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/65">Manifesto</p>
                    <p className="mt-4 text-lg leading-relaxed text-[#FDF5E6]/78">
                      This year is built like a story world. The design language is ceremonial, the crowd energy is immediate, and the experience is meant to feel authored from the first scroll to the last performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-y border-[#D4AF37]/10 bg-[#100202]/80 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Reveal Notes</p>
              <h2 className="text-5xl md:text-7xl leading-[0.9] tracking-[-0.04em] font-heading">
                WHY <span className="text-[#D4AF37]">GAATHA</span>
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-[#FDF5E6]/65">
                A gaatha is more than a theme word. It suggests inheritance, voice, tension, spectacle, and the stories that travel long after the event ends.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {revealPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="border border-[#D4AF37]/18 bg-white/[0.03] p-6"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#D4AF37]/70">0{index + 1}</p>
                  <h3 className="mt-4 text-2xl leading-tight tracking-[0.05em] font-heading">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#FDF5E6]/65">{pillar.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Story Arc</p>
              <h2 className="mt-4 text-5xl md:text-7xl leading-[0.9] tracking-[-0.04em] font-heading">
                HOW THE <span className="text-[#D4AF37]">WORLD UNFOLDS</span>
              </h2>
            </div>
            <div className="max-w-lg border-l-2 border-[#D4AF37]/35 pl-5">
              <p className="text-base leading-relaxed text-[#FDF5E6]/65">
                The reveal page should feel less like an announcement poster and more like stepping into the first frames of the festival itself.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {revealMoments.map((moment, index) => (
              <motion.div
                key={moment.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="relative overflow-hidden border border-[#D4AF37]/18 bg-[#1a0505]/70 p-6"
              >
                <div className="absolute right-0 top-0 h-24 w-24 bg-[#D4AF37]/8 blur-2xl" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/70">{moment.label}</p>
                <h3 className="mt-5 text-3xl tracking-[0.04em] font-heading">{moment.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#FDF5E6]/68">{moment.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[#D4AF37]/10 bg-[#D4AF37] px-6 py-20 text-[#1A0505] md:px-10 md:py-24">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_90%_15%,rgba(26,5,5,0.12),transparent_22%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.45em] text-[#1A0505]/65">
              <ScrollText className="h-4 w-4" />
              Enter The 35th Chapter
            </p>
            <h2 className="text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em] font-heading">
              READY TO
              <br />
              BECOME PART OF IT?
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[#1A0505]/75">
              The reveal is only the opening page. Registration, teams, stages, and crowd energy finish the story.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 lg:w-auto">
            <Link href={SITE_CONFIG.links.registration} className="group">
              <div className="flex items-center justify-between gap-6 bg-[#1A0505] px-8 py-5 text-[#FDF5E6] transition-colors hover:bg-[#2a0909]">
                <span className="text-xl font-black uppercase tracking-[0.16em]">Secure Your Pass</span>
                <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-2" />
              </div>
            </Link>
            <Link href={SITE_CONFIG.links.events} className="group">
              <div className="flex items-center justify-between gap-6 border border-[#1A0505]/20 px-8 py-5 transition-colors hover:border-[#1A0505]/45 hover:bg-[#1A0505]/6">
                <span className="text-xl font-black uppercase tracking-[0.16em]">Explore Events</span>
                <Sparkles className="h-7 w-7 transition-transform group-hover:rotate-12" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="relative border-t border-white/5 px-6 py-10 text-center md:px-10">
        <p className="text-[10px] font-black uppercase tracking-[0.75em] text-[#FDF5E6]/28">
          BITOTSAV 2026 / GAATHA / {SITE_CONFIG.venue.name} / {SITE_CONFIG.dates.short}
        </p>
      </div>
    </div>
  );
}

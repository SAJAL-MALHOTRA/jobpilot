import React, { useState, useEffect, useRef } from 'react';
import { Radio, MapPin, ShieldCheck, ArrowRight, Activity, Terminal } from 'lucide-react';

interface ClusterNode {
  id: string;
  name: string;
  category: string;
  location: string;
  x: number;
  y: number;
  activeRoles: number;
  avgLpa: string;
  noticeBuyout: boolean;
  featuredStartups: string[];
}

const STARTUP_CLUSTERS: ClusterNode[] = [
  {
    id: 'cluster-ind',
    name: 'Indiranagar AI Corridor',
    category: 'Foundation Models & GenAI',
    location: '100ft Road / 12th Main, Bangalore',
    x: 25,
    y: 35,
    activeRoles: 48,
    avgLpa: '₹28 - 65 LPA',
    noticeBuyout: true,
    featuredStartups: ['Sarvam AI', 'CognitiveHQ', 'Krutrim', 'TensorOps'],
  },
  {
    id: 'cluster-kor',
    name: 'Koramangala Fintech Belt',
    category: 'High-Frequency Payments & Rails',
    location: 'Sony World Junction / 80ft Road, Bangalore',
    x: 48,
    y: 65,
    activeRoles: 62,
    avgLpa: '₹32 - 75 LPA',
    noticeBuyout: true,
    featuredStartups: ['Razorpay', 'CRED', 'Groww', 'Setu', 'Pine Labs'],
  },
  {
    id: 'cluster-hsr',
    name: 'HSR Layout DevTool Hub',
    category: 'B2B SaaS & Distributed Infra',
    location: 'Sector 4 / 27th Main, Bangalore',
    x: 72,
    y: 45,
    activeRoles: 54,
    avgLpa: '₹26 - 55 LPA',
    noticeBuyout: true,
    featuredStartups: ['Hasura', 'BrowserStack', 'Postman', 'Signoz'],
  },
  {
    id: 'cluster-yc',
    name: 'YC W24 / S24 Global Startups',
    category: 'Seed to Series A Pioneers',
    location: 'San Francisco & Remote (India Sync)',
    x: 88,
    y: 22,
    activeRoles: 38,
    avgLpa: '$110k - $160k (or ₹45 - 85 LPA)',
    noticeBuyout: true,
    featuredStartups: ['Perplexity', 'CognitiveHQ', 'Resend', 'Supabase'],
  },
];

export const SupersonicMissionControl: React.FC<{ onExploreCluster?: (clusterName: string) => void }> = ({
  onExploreCluster,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterNode>(STARTUP_CLUSTERS[0]);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background animated particle radar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Radar sweep beam from center
      const centerX = width / 2;
      const centerY = height / 2;
      angle += 0.015;

      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width * 0.45);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Sweeping radar arm
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * (width * 0.5), centerY + Math.sin(angle) * (height * 0.7));
      ctx.stroke();

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Real-time telemetry ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick((prev) => prev + 1);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] overflow-hidden shadow-xl relative">
      {/* Background Radar Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 bg-[#0A0A0A] px-5 py-3 border-b border-[#1F1F1F] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141414] border border-[#262626] text-xs font-mono text-white">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">STARTUP CORRIDORS</span>
          </div>
          <span className="text-xs text-[#888888] font-mono hidden sm:inline">
            Bangalore & YC Startup Cluster Directory
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white font-medium">Direct Founder Inboxes</span>
          </div>
          <span className="text-[#333333]">•</span>
          <div className="flex items-center gap-1.5 text-[#888888]">
            <Activity className="w-3.5 h-3.5 text-[#888888]" />
            <span>Telemetry Ping: {22 + (telemetryTick % 5)}ms</span>
          </div>
        </div>
      </div>

      {/* Main Mission Control Grid */}
      <div className="relative z-10 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive Startup Corridors Radar Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>◈</span>
              <span>Startup Ecosystem Radar</span>
            </h3>
            <span className="text-xs font-mono text-[#71788E]">
              Select corridor to inspect telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STARTUP_CLUSTERS.map((cluster) => {
              const isSelected = selectedCluster.id === cluster.id;
              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#151928] border-[#6366F1] shadow-lg shadow-indigo-500/10'
                      : 'bg-[#0E111A]/80 border-[#1C2030] hover:border-[#2C334A] hover:bg-[#121622]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {cluster.name}
                      </h4>
                      <p className="text-[11px] text-[#7E869E] font-mono mt-0.5">
                        {cluster.category}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-sm shadow-emerald-400" />
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1C2030] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#38BDF8] font-semibold">{cluster.activeRoles} Live Roles</span>
                    <span className="text-[#10B981]">{cluster.avgLpa}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-Time Telemetry Terminal Stream */}
          <div className="rounded-xl bg-[#08090E] border border-[#1A1D2B] p-3 text-[11px] font-mono text-[#8C93A8] space-y-1.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1A1D2B] text-[10px] text-[#555C72]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-[#10B981]" />
                <span>LIVE DISPATCH STREAM</span>
              </div>
              <span className="text-[#10B981]">SYSTEM STABLE</span>
            </div>
            <div className="space-y-1 text-[#A3A8BD]">
              <div className="flex items-center gap-2">
                <span className="text-[#10B981]">[OK]</span>
                <span>Ashby API Scraper indexed 14 new openings in Indiranagar & Koramangala.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#38BDF8]">[DISPATCH]</span>
                <span>Founder cold email (Context + Relevance) delivered to CEO at CognitiveHQ.</span>
              </div>
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <span className="text-[#F59E0B]">[NOTICE]</span>
                <span>34 Bangalore seed startups currently financing 60-day notice period buyouts.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Active Cluster Telemetry Card */}
        <div className="lg:col-span-5 bg-[#10131E] rounded-xl border border-[#202538] p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2030]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedCluster.location}</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-[#1A1E2E] border border-[#2A314A] text-[10px] font-mono text-[#38BDF8]">
                CORRIDOR ACTIVE
              </div>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white">{selectedCluster.name}</h4>
              <p className="text-xs text-[#8C93A8] mt-1 leading-relaxed">
                Direct founder outreach enabled with deliverability scoring and Ashby/Lever applicant tracking bypass.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#0A0C13] border border-[#1A1E2E] space-y-1">
                <span className="text-[10px] font-mono text-[#687087] block">ACTIVE STARTUP ROLES</span>
                <span className="text-lg font-black text-white">{selectedCluster.activeRoles}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0C13] border border-[#1A1E2E] space-y-1">
                <span className="text-[10px] font-mono text-[#687087] block">COMPENSATION BAND</span>
                <span className="text-sm font-bold text-[#10B981]">{selectedCluster.avgLpa}</span>
              </div>
            </div>

            {/* Featured Startups in this Cluster */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#71788E] uppercase tracking-wider block">
                Top Startups Hiring in this Hub:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCluster.featuredStartups.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md bg-[#161A28] border border-[#252B40] text-xs font-mono text-white flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Notice Period Buyout Guarantee Pill */}
            {selectedCluster.noticeBuyout && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#111928] border border-[#1D2B44] text-xs text-[#93C5FD]">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Notice period buyout negotiation supported by JobPilot</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (onExploreCluster) onExploreCluster(selectedCluster.name);
              const el = document.getElementById('dashboard-view');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <span>Scan {selectedCluster.name} Roles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupersonicMissionControl;
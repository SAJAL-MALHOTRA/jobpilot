import React, { useState, useEffect } from 'react';
import type { AgentActivityLog } from '../types';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface LiveAgentConsoleProps {
  autopilotEnabled: boolean;
}

export const LiveAgentConsole: React.FC<LiveAgentConsoleProps> = ({ autopilotEnabled }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<AgentActivityLog[]>([
    {
      id: 'log-1',
      timestamp: '18:42:01',
      action: 'Target filters applied: Min ₹24 LPA · Tech Stack: React, Python, PostgreSQL',
      target: 'Profile Vault',
      type: 'SCAN',
    },
    {
      id: 'log-2',
      timestamp: '18:42:04',
      action: 'Discovered 6 high-urgency roles across YC W24 & Bangalore startups',
      target: 'YC & Wellfound Radar',
      type: 'SCAN',
    },
    {
      id: 'log-3',
      timestamp: '18:42:08',
      action: 'Computed 94% ATS Match Score for CognitiveHQ (Founding AI Engineer)',
      target: 'ATS Lab Engine',
      type: 'ATS_TAILOR',
    },
    {
      id: 'log-4',
      timestamp: '18:42:12',
      action: 'Pre-drafted 3-liner Founder Outreach to Siddharth Varma (CEO)',
      target: 'Founder Outreach Engine',
      type: 'OUTREACH',
    },
  ]);

  useEffect(() => {
    if (!autopilotEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomTargets = [
        'Wellfound Radar',
        'LinkedIn Instahyre Stream',
        'YC S24 Batch Portal',
        'Postman Ecosystems',
        'Zepto Engineering',
      ];
      const randomActions = [
        'Scanned 14 new Full Stack job postings for keyword relevance',
        'Evaluated latency & distributed systems requirements vs candidate bullets',
        'Generated Google XYZ bullet optimization for streaming data pipelines',
        'Refreshed hiring manager contact verification for Indiranagar AI cluster',
      ];

      const newLog: AgentActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        action: randomActions[Math.floor(Math.random() * randomActions.length)],
        target: randomTargets[Math.floor(Math.random() * randomTargets.length)],
        type: 'SCAN',
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 6000);

    return () => clearInterval(interval);
  }, [autopilotEnabled]);

  return (
    <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Console Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">JobPilot Agent Telemetry</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {autopilotEnabled ? '24/7 Autopilot Live' : 'Agent Idle'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>{logs.length} events logged</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Log Feed */}
      {isOpen && (
        <div className="p-3.5 space-y-2 max-h-48 overflow-y-auto font-mono text-[11px] divide-y divide-slate-800/40">
          {logs.map((log) => (
            <div key={log.id} className="pt-1.5 flex items-start gap-2.5 leading-relaxed">
              <span className="text-slate-500 shrink-0 font-medium">{log.timestamp}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-indigo-300 shrink-0 border border-slate-700/60">
                {log.target}
              </span>
              <span className="text-slate-300 font-sans">{log.action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

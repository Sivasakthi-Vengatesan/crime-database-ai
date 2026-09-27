import React, { useEffect, useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  PieChart,
  BarChart3,
  MapPin,
  Flame,
  ArrowRight,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { AnalyticsData, CrimeRecordItem } from '../types/chat';
import { fetchAnalyticsApi } from '../api/chatApi';

interface AnalyticsDashboardProps {
  onInvestigateInChat: (caseId: string, summary: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onInvestigateInChat }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAnalyticsApi();
      setAnalytics(data);
    } catch (e) {
      console.error('Failed to load analytics', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-slate-400">
        <RefreshCw size={28} className="animate-spin text-cyan-400 mb-3" />
        <p className="text-sm font-mono">Aggregating real-time crime intelligence metrics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center text-slate-400">
        <p>Could not load intelligence analytics. Please ensure backend server is operational.</p>
        <button onClick={loadData} className="mt-4 px-4 py-2 rounded-xl btn-primary text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  const sortedCities = Object.entries(analytics.cityDistribution || {}).sort((a, b) => b[1] - a[1]);
  const maxCityCount = sortedCities.length > 0 ? Math.max(...sortedCities.map((c) => c[1])) : 1;

  const sortedTypes = Object.entries(analytics.typeDistribution || {}).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = sortedTypes.length > 0 ? Math.max(...sortedTypes.map((t) => t[1])) : 1;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity size={13} className="animate-pulse" />
            Active Threat Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
            Crime Threat Radar & Intelligence Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Aggregated statistical insights across all registered cases, city threat distributions, and resolution ratios.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl btn-secondary text-xs font-medium flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} />
          Refresh Radar
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Indexed */}
        <div className="cyber-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Total Indexed Records</span>
            <FolderOpen size={16} className="text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">{analytics.totalRecords}</div>
          <p className="text-[11px] text-cyan-400">Indexed in pgvector & JPA</p>
        </div>

        {/* Solved Ratio */}
        <div className="cyber-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Resolution Rate</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{analytics.solvedRate}%</div>
          <p className="text-[11px] text-slate-400">{analytics.closedCases} closed / resolved cases</p>
        </div>

        {/* Active Investigations */}
        <div className="cyber-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Active Investigations</span>
            <Activity size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-400">
            {analytics.underInvestigationCases + analytics.openCases}
          </div>
          <p className="text-[11px] text-slate-400">{analytics.openCases} Open, {analytics.underInvestigationCases} Under Active Probe</p>
        </div>

        {/* High / Critical Severity */}
        <div className="cyber-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>High Threat Cases</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-400">
            {(analytics.severityCounts?.Critical || 0) + (analytics.severityCounts?.High || 0)}
          </div>
          <p className="text-[11px] text-slate-400">
            {analytics.severityCounts?.Critical || 0} Critical, {analytics.severityCounts?.High || 0} High
          </p>
        </div>
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Breakdown */}
        <div className="cyber-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <MapPin size={16} className="text-cyan-400" />
              Geographic Case Density by City
            </div>
            <span className="text-xs font-mono text-slate-400">{sortedCities.length} Regions</span>
          </div>

          <div className="space-y-3">
            {sortedCities.map(([city, count]) => {
              const percent = Math.round((count / maxCityCount) * 100);
              return (
                <div key={city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{city}</span>
                    <span className="font-mono text-slate-400">{count} cases</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crime Category Breakdown */}
        <div className="cyber-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <PieChart size={16} className="text-indigo-400" />
              Incident Classification Distribution
            </div>
            <span className="text-xs font-mono text-slate-400">{sortedTypes.length} Categories</span>
          </div>

          <div className="space-y-3">
            {sortedTypes.map(([type, count]) => {
              const percent = Math.round((count / maxTypeCount) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{type}</span>
                    <span className="font-mono text-slate-400">{count} incidents</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent High-Risk Hotspots */}
      <div className="cyber-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
            <Flame size={16} className="text-rose-400 animate-pulse" />
            Active High-Risk Incident Hotspots
          </div>
          <span className="text-xs font-mono text-rose-400 font-semibold uppercase">PRIORITY WATCHLIST</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(analytics.recentHotspots || []).map((hotspot: CrimeRecordItem) => (
            <div
              key={hotspot.caseId}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-rose-500/30 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-cyan-400">{hotspot.caseId}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase"
                    style={{
                      backgroundColor: hotspot.severity === 'Critical' ? 'rgba(244,63,94,0.2)' : 'rgba(245,158,11,0.2)',
                      color: hotspot.severity === 'Critical' ? '#f43f5e' : '#f59e0b',
                    }}
                  >
                    {hotspot.severity}
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-medium">
                  {hotspot.crimeType} in <span className="text-white font-semibold">{hotspot.location}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{hotspot.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-500">
                <span>{hotspot.incidentDate}</span>
                <button
                  onClick={() =>
                    onInvestigateInChat(
                      hotspot.caseId,
                      `Analyze high priority hotspot case ${hotspot.caseId} in ${hotspot.location}: ${hotspot.description}`
                    )
                  }
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-xs"
                >
                  <MessageSquare size={13} />
                  Analyze in AI Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

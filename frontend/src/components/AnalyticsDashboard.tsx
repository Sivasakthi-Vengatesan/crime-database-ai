import React, { useEffect, useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  PieChart,
  MapPin,
  Flame,
  RefreshCw,
  MessageSquare,
  TrendingUp,
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
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-slate-500">
        <RefreshCw size={28} className="animate-spin text-red-500 mb-3" />
        <p className="text-sm font-mono">Aggregating real-time crime intelligence metrics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center text-slate-500">
        <p>Could not load intelligence analytics. Please ensure backend server is operational.</p>
        <button onClick={loadData} className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold shadow-md">
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 overflow-y-auto pb-24 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Activity size={13} className="text-red-500 animate-pulse" />
            Suspect & Threat Telemetry Radar
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Crime Threat Radar & Intelligence Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time statistical synthesis across all registered criminal cases, city density indexes, and resolution ratios.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-slate-700 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw size={14} />
          Refresh Metrics
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Indexed */}
        <div className="p-5 rounded-[24px] bg-white border border-gray-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Total Indexed Cases</span>
            <FolderOpen size={16} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-800">{analytics.totalRecords}</div>
          <p className="text-[11px] text-red-600 font-semibold font-mono">pgvector & PostgreSQL Active</p>
        </div>

        {/* Solved Ratio */}
        <div className="p-5 rounded-[24px] bg-white border border-gray-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Resolution Rate</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600">{analytics.solvedRate}%</div>
          <p className="text-[11px] text-gray-500">{analytics.closedCases} closed / resolved cases</p>
        </div>

        {/* Active Investigations */}
        <div className="p-5 rounded-[24px] bg-white border border-gray-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Active Investigations</span>
            <Activity size={16} className="text-orange-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-orange-600">
            {analytics.underInvestigationCases + analytics.openCases}
          </div>
          <p className="text-[11px] text-gray-500">{analytics.openCases} Open, {analytics.underInvestigationCases} Active Probes</p>
        </div>

        {/* High Severity */}
        <div className="p-5 rounded-[24px] bg-white border border-gray-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>High Threat Cases</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-red-600">
            {(analytics.severityCounts?.Critical || 0) + (analytics.severityCounts?.High || 0)}
          </div>
          <p className="text-[11px] text-gray-500">
            {analytics.severityCounts?.Critical || 0} Critical, {analytics.severityCounts?.High || 0} High
          </p>
        </div>
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Breakdown */}
        <div className="p-6 rounded-[28px] bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <MapPin size={16} className="text-red-500" />
              Geographic Case Density by City
            </div>
            <span className="text-xs font-mono text-gray-400">{sortedCities.length} Regions</span>
          </div>

          <div className="space-y-3">
            {sortedCities.map(([city, count]) => {
              const percent = Math.round((count / maxCityCount) * 100);
              return (
                <div key={city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800">{city}</span>
                    <span className="font-mono text-gray-500">{count} cases</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crime Classification Breakdown */}
        <div className="p-6 rounded-[28px] bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <PieChart size={16} className="text-orange-500" />
              Incident Classification Breakdown
            </div>
            <span className="text-xs font-mono text-gray-400">{sortedTypes.length} Types</span>
          </div>

          <div className="space-y-3">
            {sortedTypes.map(([type, count]) => {
              const percent = Math.round((count / maxTypeCount) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800">{type}</span>
                    <span className="font-mono text-gray-500">{count} incidents</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500"
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
      <div className="p-6 rounded-[28px] bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Flame size={16} className="text-red-500 animate-pulse" />
            Active High-Threat Incident Hotspots
          </div>
          <span className="text-xs font-mono text-red-600 font-bold uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            PRIORITY WATCHLIST
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(analytics.recentHotspots || []).map((hotspot: CrimeRecordItem) => (
            <div
              key={hotspot.caseId}
              className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-red-300 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-gray-200">
                    {hotspot.caseId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                      hotspot.severity === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {hotspot.severity}
                  </span>
                </div>
                <div className="text-xs text-slate-800 font-semibold">
                  {hotspot.crimeType} in <span className="text-red-600 font-bold">{hotspot.location}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{hotspot.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/80 text-xs text-gray-500">
                <span>{hotspot.incidentDate}</span>
                <button
                  onClick={() =>
                    onInvestigateInChat(
                      hotspot.caseId,
                      `Analyze high priority hotspot case ${hotspot.caseId} in ${hotspot.location}: ${hotspot.description}`
                    )
                  }
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 text-xs"
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

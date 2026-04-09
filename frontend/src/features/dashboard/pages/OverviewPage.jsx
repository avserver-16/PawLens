import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Activity, TrendingUp, Shield, AlertTriangle, Upload,
  ChevronRight, Calendar
} from 'lucide-react';

const severityConfig = {
  Low: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' },
  High: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500' },
  Critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500' },
};

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await diagnosisAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const totalScans = stats?.totalScans || 0;
  const diseaseDistribution = stats?.diseaseDistribution || [];
  const severityDistribution = stats?.severityDistribution || [];
  const recentScans = stats?.recentScans || [];

  const statCards = [
    { label: 'Total Scans', value: totalScans, icon: Activity, iconBg: 'bg-primary-50', iconColor: 'text-primary-600' },
    { label: 'Conditions Detected', value: diseaseDistribution.length, icon: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Healthy Results', value: diseaseDistribution.find(d => d._id === 'Healthy')?.count || 0, icon: Shield, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'High Severity', value: severityDistribution.filter(s => s._id === 'High' || s._id === 'Critical').reduce((a, c) => a + c.count, 0), icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease distribution */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-5">Disease Distribution</h3>
          {diseaseDistribution.length > 0 ? (
            <div className="space-y-4">
              {diseaseDistribution.map((d) => {
                const pct = totalScans > 0 ? Math.round((d.count / totalScans) * 100) : 0;
                return (
                  <div key={d._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{d._id}</span>
                      <span className="text-xs text-slate-400">{d.count} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 mb-4">No scans yet</p>
              <Link to="/dashboard/scan" className="btn-primary text-xs px-5 py-2 inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Start First Scan
              </Link>
            </div>
          )}
        </div>

        {/* Severity */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-5">Severity Overview</h3>
          {severityDistribution.length > 0 ? (
            <div className="space-y-2.5">
              {['Low', 'Medium', 'High', 'Critical'].map((sev) => {
                const item = severityDistribution.find(s => s._id === sev);
                const count = item?.count || 0;
                const config = severityConfig[sev];
                return (
                  <div key={sev} className={`flex items-center justify-between p-3 rounded-xl ${config.bg} border ${config.border}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      <span className={`text-sm font-medium ${config.color}`}>{sev}</span>
                    </div>
                    <span className={`text-sm font-bold ${config.color}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent scans */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-800">Recent Scans</h3>
          {recentScans.length > 0 && (
            <Link to="/dashboard/history" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        {recentScans.length > 0 ? (
          <div className="space-y-2">
            {recentScans.map((scan) => {
              const config = severityConfig[scan.severity] || severityConfig.Medium;
              return (
                <Link key={scan._id} to={`/dashboard/diagnosis/${scan._id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                  <img src={scan.imageUrl} alt="Scan" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{scan.diseaseName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                        {scan.severity}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">No scans yet. Upload your first image to get started.</p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Activity, TrendingUp, Shield, AlertTriangle, Upload,
  ChevronRight, Calendar, Clock
} from 'lucide-react';

const severityConfig = {
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  High: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  Critical: { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalScans = stats?.totalScans || 0;
  const diseaseDistribution = stats?.diseaseDistribution || [];
  const severityDistribution = stats?.severityDistribution || [];
  const recentScans = stats?.recentScans || [];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{totalScans}</p>
          <p className="text-sm text-surface-200 mt-1">Total Scans</p>
        </div>

        <div className="p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{diseaseDistribution.length}</p>
          <p className="text-sm text-surface-200 mt-1">Conditions Detected</p>
        </div>

        <div className="p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {diseaseDistribution.find(d => d._id === 'Healthy')?.count || 0}
          </p>
          <p className="text-sm text-surface-200 mt-1">Healthy Results</p>
        </div>

        <div className="p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {severityDistribution.find(s => s._id === 'High' || s._id === 'Critical')?.count || 0}
          </p>
          <p className="text-sm text-surface-200 mt-1">High Severity Cases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass">
          <h3 className="text-lg font-semibold mb-4">Disease Distribution</h3>
          {diseaseDistribution.length > 0 ? (
            <div className="space-y-4">
              {diseaseDistribution.map((d) => {
                const pct = totalScans > 0 ? Math.round((d.count / totalScans) * 100) : 0;
                return (
                  <div key={d._id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{d._id}</span>
                      <span className="text-sm text-surface-200">{d.count} scans ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-surface-200/30 mx-auto mb-3" />
              <p className="text-surface-200">No scans yet.</p>
              <Link
                to="/dashboard/scan"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                <Upload className="w-4 h-4" />
                Start First Scan
              </Link>
            </div>
          )}
        </div>

        {/* Severity chart */}
        <div className="p-6 rounded-2xl glass">
          <h3 className="text-lg font-semibold mb-4">Severity Overview</h3>
          {severityDistribution.length > 0 ? (
            <div className="space-y-3">
              {['Low', 'Medium', 'High', 'Critical'].map((sev) => {
                const item = severityDistribution.find(s => s._id === sev);
                const count = item?.count || 0;
                const config = severityConfig[sev];
                return (
                  <div key={sev} className={`flex items-center justify-between p-3 rounded-xl ${config.bg} border ${config.border}`}>
                    <span className={`text-sm font-medium ${config.color}`}>{sev}</span>
                    <span className={`text-sm font-bold ${config.color}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-surface-200 text-sm text-center py-8">No data available yet.</p>
          )}
        </div>
      </div>

      {/* Recent scans */}
      <div className="p-6 rounded-2xl glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Scans</h3>
          {recentScans.length > 0 && (
            <Link to="/dashboard/history" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {recentScans.length > 0 ? (
          <div className="space-y-3">
            {recentScans.map((scan) => {
              const config = severityConfig[scan.severity] || severityConfig.Medium;
              return (
                <Link
                  key={scan._id}
                  to={`/dashboard/diagnosis/${scan._id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-all group"
                >
                  <img
                    src={scan.imageUrl}
                    alt="Scan"
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{scan.diseaseName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} ${config.border} border`}>
                        {scan.severity}
                      </span>
                      <span className="text-xs text-surface-200/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-surface-200/30 group-hover:text-surface-200 transition-colors" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-surface-200 text-sm">No scans yet. Upload your first image to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

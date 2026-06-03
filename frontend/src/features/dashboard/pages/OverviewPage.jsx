import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Activity, TrendingUp, Shield, AlertTriangle, Upload,
  ChevronRight, Calendar
} from 'lucide-react';

const C = {
  surface: '#fbf9f4', surfaceContainerLow: '#f5f3ee', onSurface: '#1b1c19',
  onSurfaceVariant: '#504442', outlineVariant: '#d3c3c0', primary: '#271310',
  secondary: '#895200', primaryContainer: '#3e2723',
};

const severityConfig = {
  Low: { color: '#059669', bg: '#ecfdf5', border: '#d1fae5', dot: '#10b981' },
  Medium: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7', dot: '#f59e0b' },
  High: { color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  Critical: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${C.outlineVariant}`, borderTop: `2px solid ${C.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const totalScans = stats?.totalScans || 0;
  const diseaseDistribution = stats?.diseaseDistribution || [];
  const severityDistribution = stats?.severityDistribution || [];
  const recentScans = stats?.recentScans || [];

  const statCards = [
    { label: 'Total Scans', value: totalScans, icon: Activity, iconBg: `${C.secondary}15`, iconColor: C.secondary },
    { label: 'Conditions Detected', value: diseaseDistribution.length, icon: TrendingUp, iconBg: '#ecfdf5', iconColor: '#059669' },
    { label: 'Healthy Results', value: diseaseDistribution.find(d => d._id === 'Healthy')?.count || 0, icon: Shield, iconBg: '#fffbeb', iconColor: '#d97706' },
    { label: 'High Severity', value: severityDistribution.filter(s => s._id === 'High' || s._id === 'Critical').reduce((a, c) => a + c.count, 0), icon: AlertTriangle, iconBg: '#fef2f2', iconColor: '#dc2626' },
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats — separated by lines */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: `1px solid ${C.outlineVariant}40`, paddingBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ padding: '0 16px', borderRight: i < 3 ? `1px solid ${C.outlineVariant}30` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon style={{ width: 20, height: 20, color: s.iconColor }} />
              </div>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: C.primary, fontFamily: "'Manrope', sans-serif" }}>{s.value}</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.onSurfaceVariant, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 24 }}>
        {/* Disease distribution */}
        <div className="lg:col-span-2" style={{ paddingBottom: 24, borderBottom: `1px solid ${C.outlineVariant}40` }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 20 }}>Disease Distribution</h3>
          {diseaseDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {diseaseDistribution.map((d) => {
                const pct = totalScans > 0 ? Math.round((d.count / totalScans) * 100) : 0;
                return (
                  <div key={d._id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.primary }}>{d._id}</span>
                      <span style={{ fontSize: 12, color: C.onSurfaceVariant }}>{d.count} · {pct}%</span>
                    </div>
                    <div style={{ height: 8, background: C.surfaceContainerLow, borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 100, background: `linear-gradient(to right, ${C.primary}, ${C.secondary})`, transition: 'width 0.7s ease', width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Upload style={{ width: 40, height: 40, color: C.outlineVariant, margin: '0 auto 12px auto', display: 'block' }} />
              <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 16 }}>No scans yet</p>
              <Link to="/dashboard/scan" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '8px 20px',
                background: C.primary, color: '#fff', borderRadius: 10, fontWeight: 600, textDecoration: 'none',
              }}>
                <Upload style={{ width: 14, height: 14 }} /> Start First Scan
              </Link>
            </div>
          )}
        </div>

        {/* Severity */}
        <div style={{ paddingBottom: 24, borderBottom: `1px solid ${C.outlineVariant}40` }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 20 }}>Severity Overview</h3>
          {severityDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Low', 'Medium', 'High', 'Critical'].map((sev) => {
                const item = severityDistribution.find(s => s._id === sev);
                const count = item?.count || 0;
                const config = severityConfig[sev];
                return (
                  <div key={sev} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.outlineVariant}20` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: config.dot }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: config.color }}>{sev}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: config.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, textAlign: 'center', padding: '32px 0' }}>No data yet</p>
          )}
        </div>
      </div>

      {/* Recent scans */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Recent Scans</h3>
          {recentScans.length > 0 && (
            <Link to="/dashboard/history" style={{ fontSize: 12, fontWeight: 600, color: C.secondary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          )}
        </div>
        {recentScans.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentScans.map((scan, i) => {
              const config = severityConfig[scan.severity] || severityConfig.Medium;
              return (
                <Link key={scan._id} to={`/dashboard/diagnosis/${scan._id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', textDecoration: 'none', transition: 'opacity 0.15s', borderBottom: i < recentScans.length - 1 ? `1px solid ${C.outlineVariant}25` : 'none' }}>
                  <img src={scan.imageUrl} alt="Scan" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: `1px solid ${C.outlineVariant}40` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.primary, margin: 0 }}>{scan.diseaseName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, fontWeight: 500, background: config.bg, color: config.color }}>
                        {scan.severity}
                      </span>
                      <span style={{ fontSize: 11, color: C.onSurfaceVariant, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar style={{ width: 12, height: 12 }} />
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight style={{ width: 16, height: 16, color: C.outlineVariant }} />
                </Link>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: C.onSurfaceVariant, textAlign: 'center', padding: '32px 0' }}>No scans yet. Upload your first image to get started.</p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

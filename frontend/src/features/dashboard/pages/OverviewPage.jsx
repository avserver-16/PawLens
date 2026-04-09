import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Activity, TrendingUp, Shield, AlertTriangle, Upload,
  ChevronRight, Calendar
} from 'lucide-react';

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ width: '28px', height: '28px', border: '2px solid #c7d2fe', borderTop: '2px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const totalScans = stats?.totalScans || 0;
  const diseaseDistribution = stats?.diseaseDistribution || [];
  const severityDistribution = stats?.severityDistribution || [];
  const recentScans = stats?.recentScans || [];

  const statCards = [
    { label: 'Total Scans', value: totalScans, icon: Activity, iconBg: '#eef2ff', iconColor: '#4f46e5' },
    { label: 'Conditions Detected', value: diseaseDistribution.length, icon: TrendingUp, iconBg: '#ecfdf5', iconColor: '#059669' },
    { label: 'Healthy Results', value: diseaseDistribution.find(d => d._id === 'Healthy')?.count || 0, icon: Shield, iconBg: '#fffbeb', iconColor: '#d97706' },
    { label: 'High Severity', value: severityDistribution.filter(s => s._id === 'High' || s._id === 'Critical').reduce((a, c) => a + c.count, 0), icon: AlertTriangle, iconBg: '#fef2f2', iconColor: '#dc2626' },
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon style={{ width: '20px', height: '20px', color: s.iconColor }} />
              </div>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{s.value}</p>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginTop: '4px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Disease distribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Disease Distribution</h3>
          {diseaseDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {diseaseDistribution.map((d) => {
                const pct = totalScans > 0 ? Math.round((d.count / totalScans) * 100) : 0;
                return (
                  <div key={d._id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{d._id}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{d.count} · {pct}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(to right, #6366f1, #818cf8)', transition: 'width 0.7s ease', width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Upload style={{ width: '40px', height: '40px', color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>No scans yet</p>
              <Link to="/dashboard/scan" className="btn-primary" style={{ fontSize: '12px', padding: '8px 20px', gap: '6px' }}>
                <Upload style={{ width: '14px', height: '14px' }} /> Start First Scan
              </Link>
            </div>
          )}
        </div>

        {/* Severity */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Severity Overview</h3>
          {severityDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Low', 'Medium', 'High', 'Critical'].map((sev) => {
                const item = severityDistribution.find(s => s._id === sev);
                const count = item?.count || 0;
                const config = severityConfig[sev];
                return (
                  <div key={sev} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: config.bg, border: `1px solid ${config.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.dot }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: config.color }}>{sev}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: config.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>No data yet</p>
          )}
        </div>
      </div>

      {/* Recent scans */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Recent Scans</h3>
          {recentScans.length > 0 && (
            <Link to="/dashboard/history" style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight style={{ width: '14px', height: '14px' }} />
            </Link>
          )}
        </div>
        {recentScans.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentScans.map((scan) => {
              const config = severityConfig[scan.severity] || severityConfig.Medium;
              return (
                <Link key={scan._id} to={`/dashboard/diagnosis/${scan._id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <img src={scan.imageUrl} alt="Scan" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#334155', margin: 0 }}>{scan.diseaseName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', fontWeight: 500, background: config.bg, color: config.color }}>
                        {scan.severity}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight style={{ width: '16px', height: '16px', color: '#cbd5e1' }} />
                </Link>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>No scans yet. Upload your first image to get started.</p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

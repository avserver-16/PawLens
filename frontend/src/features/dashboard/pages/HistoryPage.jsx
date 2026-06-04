import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import { useTheme } from '../../../context/ThemeContext';
import { getColors } from '../../../theme/colors';
import {
  Calendar, ChevronRight, Search, Trash2, Upload,
  ChevronLeft, Loader2
} from 'lucide-react';

const severityConfig = {
  Low: { color: '#047857', bg: '#ecfdf5' },
  Medium: { color: '#b45309', bg: '#fffbeb' },
  High: { color: '#c2410c', bg: '#fff7ed' },
  Critical: { color: '#dc2626', bg: '#fef2f2' },
};

export default function HistoryPage() {
  const { isDark } = useTheme();
  const C = useMemo(() => getColors(isDark), [isDark]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { loadDiagnoses(1); }, []);

  const loadDiagnoses = async (page) => {
    setLoading(true);
    try {
      const res = await diagnosisAPI.getAll(page, 8);
      setDiagnoses(res.data.diagnoses);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this diagnosis?')) return;
    setDeletingId(id);
    try {
      await diagnosisAPI.delete(id);
      setDiagnoses(prev => prev.filter(d => d._id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  const filtered = diagnoses.filter(d =>
    d.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
    d.petName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${C.outlineVariant}`, borderTop: `2px solid ${C.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 20, borderBottom: `1px solid ${C.outlineVariant}40` }}>
        <div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 700, color: C.primary, margin: 0 }}>Scan History</h2>
          <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginTop: 4 }}>{pagination.total} total scans</p>
        </div>
        <div style={{ position: 'relative', width: 260 }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: C.onSurfaceVariant }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 40, padding: '10px 14px 10px 40px', borderRadius: 10, border: `1px solid ${C.outlineVariant}`, background: C.surface, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: C.onSurface, boxSizing: 'border-box' }}
            placeholder="Search disease or pet name..." />
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((d, i) => {
              const config = severityConfig[d.severity] || severityConfig.Medium;
              return (
                <div key={d._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: i < filtered.length - 1 ? `1px solid ${C.outlineVariant}25` : 'none' }}>
                  <img src={d.imageUrl} alt="Scan" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', border: `1px solid ${C.outlineVariant}40`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: C.primary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.diseaseName}</h3>
                      {d.petName && <span style={{ fontSize: 13, color: C.onSurfaceVariant }}>· {d.petName}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.onSurfaceVariant }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: config.bg, color: config.color }}>{d.severity}</span>
                      <Calendar style={{ width: 12, height: 12 }} />
                      {new Date(d.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      <span style={{ padding: '2px 6px', borderRadius: 4, background: `${C.secondary}15`, color: C.secondary, fontWeight: 600, fontSize: 12 }}>{d.confidence}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Link to={`/dashboard/diagnosis/${d._id}`}
                      style={{ padding: '6px 12px', background: `${C.secondary}12`, color: C.primary, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'background 0.15s' }}>
                      Details <ChevronRight style={{ width: 12, height: 12 }} />
                    </Link>
                    <button onClick={() => handleDelete(d._id)} disabled={deletingId === d._id}
                      style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: C.outlineVariant, cursor: 'pointer', transition: 'all 0.15s', opacity: deletingId === d._id ? 0.5 : 1 }}>
                      {deletingId === d._id ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Trash2 style={{ width: 14, height: 14 }} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <button onClick={() => loadDiagnoses(pagination.page - 1)} disabled={pagination.page <= 1}
                style={{ padding: 8, borderRadius: 8, border: `1px solid ${C.outlineVariant}`, background: C.surface, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.3 : 1 }}>
                <ChevronLeft style={{ width: 16, height: 16, color: C.onSurfaceVariant }} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => loadDiagnoses(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                    background: p === pagination.page ? C.primary : C.surface,
                    color: p === pagination.page ? '#fff' : C.onSurfaceVariant,
                    border: p === pagination.page ? 'none' : `1px solid ${C.outlineVariant}`,
                    boxShadow: p === pagination.page ? '0 2px 4px rgba(39,19,16,0.2)' : 'none',
                  }}>{p}</button>
              ))}
              <button onClick={() => loadDiagnoses(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                style={{ padding: 8, borderRadius: 8, border: `1px solid ${C.outlineVariant}`, background: C.surface, cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.pages ? 0.3 : 1 }}>
                <ChevronRight style={{ width: 16, height: 16, color: C.onSurfaceVariant }} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.surfaceContainerLow, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Upload style={{ width: 28, height: 28, color: C.outlineVariant }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: C.primary, marginBottom: 4 }}>{search ? 'No results found' : 'No scans yet'}</h3>
          <p style={{ fontSize: 15, color: C.onSurfaceVariant, marginBottom: 20 }}>{search ? 'Try another search.' : 'Upload your first image to get started.'}</p>
          {!search && (
            <Link to="/dashboard/scan" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '10px 20px',
              background: C.primary, color: '#fff', borderRadius: 10, fontWeight: 600, textDecoration: 'none',
            }}>
              <Upload style={{ width: 16, height: 16 }} /> Start First Scan
            </Link>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

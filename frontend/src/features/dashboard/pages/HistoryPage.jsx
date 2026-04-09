import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ width: '28px', height: '28px', border: '2px solid #c7d2fe', borderTop: '2px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Scan History</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{pagination.total} total scans</p>
        </div>
        <div style={{ position: 'relative', width: '260px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field" style={{ paddingLeft: '40px', fontSize: '13px' }} placeholder="Search disease or pet name..." />
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {filtered.map((d) => {
              const config = severityConfig[d.severity] || severityConfig.Medium;
              return (
                <div key={d._id} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex' }}>
                    <img src={d.imageUrl} alt="Scan" style={{ width: '112px', height: '100%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: '16px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.diseaseName}</h3>
                          {d.petName && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.petName}</p>}
                        </div>
                        <span style={{ flexShrink: 0, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: config.bg, color: config.color }}>
                          {d.severity}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '11px', color: '#94a3b8' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        {new Date(d.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>{d.confidence}%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={`/dashboard/diagnosis/${d._id}`}
                          style={{ padding: '6px 12px', background: '#eef2ff', color: '#4338ca', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'background 0.15s' }}>
                          Details <ChevronRight style={{ width: '12px', height: '12px' }} />
                        </Link>
                        <button onClick={() => handleDelete(d._id)} disabled={deletingId === d._id}
                          style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.15s', opacity: deletingId === d._id ? 0.5 : 1 }}>
                          {deletingId === d._id ? <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> : <Trash2 style={{ width: '14px', height: '14px' }} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <button onClick={() => loadDiagnoses(pagination.page - 1)} disabled={pagination.page <= 1}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.3 : 1 }}>
                <ChevronLeft style={{ width: '16px', height: '16px', color: '#64748b' }} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => loadDiagnoses(p)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                    background: p === pagination.page ? '#4f46e5' : '#fff',
                    color: p === pagination.page ? '#fff' : '#475569',
                    border: p === pagination.page ? 'none' : '1px solid #e2e8f0',
                    boxShadow: p === pagination.page ? '0 2px 4px rgba(79,70,229,0.2)' : 'none',
                  }}>{p}</button>
              ))}
              <button onClick={() => loadDiagnoses(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.pages ? 0.3 : 1 }}>
                <ChevronRight style={{ width: '16px', height: '16px', color: '#64748b' }} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Upload style={{ width: '28px', height: '28px', color: '#cbd5e1' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>{search ? 'No results found' : 'No scans yet'}</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>{search ? 'Try another search.' : 'Upload your first image to get started.'}</p>
          {!search && (
            <Link to="/dashboard/scan" className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px', gap: '6px' }}>
              <Upload style={{ width: '16px', height: '16px' }} /> Start First Scan
            </Link>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Calendar, ChevronRight, Search, Trash2, Upload,
  ChevronLeft, Loader2
} from 'lucide-react';

const severityConfig = {
  Low: { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Medium: { color: 'text-amber-700', bg: 'bg-amber-50' },
  High: { color: 'text-orange-700', bg: 'bg-orange-50' },
  Critical: { color: 'text-red-700', bg: 'bg-red-50' },
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
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Scan History</h2>
          <p className="text-sm text-slate-500 mt-0.5">{pagination.total} total scans</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 text-sm" placeholder="Search disease or pet name..." />
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((d) => {
              const config = severityConfig[d.severity] || severityConfig.Medium;
              return (
                <div key={d._id} className="card overflow-hidden group">
                  <div className="flex">
                    <img src={d.imageUrl} alt="Scan" className="w-24 sm:w-28 h-full object-cover flex-shrink-0" />
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-800 truncate">{d.diseaseName}</h3>
                          {d.petName && <p className="text-xs text-slate-400 truncate">{d.petName}</p>}
                        </div>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[11px] font-semibold ${config.bg} ${config.color}`}>
                          {d.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(d.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        <span className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 font-semibold">{d.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/dashboard/diagnosis/${d._id}`}
                          className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-100 transition-all flex items-center gap-1">
                          Details <ChevronRight className="w-3 h-3" />
                        </Link>
                        <button onClick={() => handleDelete(d._id)} disabled={deletingId === d._id}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                          {deletingId === d._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              <button onClick={() => loadDiagnoses(pagination.page - 1)} disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => loadDiagnoses(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    p === pagination.page ? 'bg-primary-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>{p}</button>
              ))}
              <button onClick={() => loadDiagnoses(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">{search ? 'No results found' : 'No scans yet'}</h3>
          <p className="text-sm text-slate-400 mb-5">{search ? 'Try another search.' : 'Upload your first image to get started.'}</p>
          {!search && (
            <Link to="/dashboard/scan" className="btn-primary text-sm inline-flex items-center gap-1.5 px-5 py-2.5">
              <Upload className="w-4 h-4" /> Start First Scan
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

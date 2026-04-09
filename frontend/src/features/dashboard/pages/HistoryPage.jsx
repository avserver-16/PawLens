import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Calendar, ChevronRight, Search, Trash2, Filter,
  Upload, ChevronLeft, Loader2
} from 'lucide-react';

const severityConfig = {
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  High: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  Critical: { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

export default function HistoryPage() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadDiagnoses(1);
  }, []);

  const loadDiagnoses = async (page) => {
    setLoading(true);
    try {
      const res = await diagnosisAPI.getAll(page, 8);
      setDiagnoses(res.data.diagnoses);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load diagnoses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this diagnosis?')) return;
    setDeletingId(id);
    try {
      await diagnosisAPI.delete(id);
      setDiagnoses(prev => prev.filter(d => d._id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = diagnoses.filter(d =>
    d.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
    d.petName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Scan History</h2>
          <p className="text-surface-200 text-sm mt-1">{pagination.total} total scans</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm"
            placeholder="Search by disease or pet name..."
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((d) => {
              const config = severityConfig[d.severity] || severityConfig.Medium;
              return (
                <div key={d._id} className="rounded-2xl glass overflow-hidden hover:bg-white/[0.08] transition-all group">
                  <div className="flex">
                    <img
                      src={d.imageUrl}
                      alt="Scan"
                      className="w-28 h-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm truncate">{d.diseaseName}</h3>
                          {d.petName && <p className="text-xs text-surface-200/60 truncate">{d.petName}</p>}
                        </div>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
                          {d.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-xs text-surface-200/60">
                        <Calendar className="w-3 h-3" />
                        {new Date(d.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                        <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 text-xs">
                          {d.confidence}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/diagnosis/${d._id}`}
                          className="px-3 py-1.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-xs font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(d._id)}
                          disabled={deletingId === d._id}
                          className="p-1.5 rounded-lg text-surface-200/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
                        >
                          {deletingId === d._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => loadDiagnoses(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => loadDiagnoses(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    p === pagination.page
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => loadDiagnoses(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-surface-200/30" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {search ? 'No results found' : 'No scans yet'}
          </h3>
          <p className="text-surface-200 text-sm mb-6">
            {search ? 'Try a different search term.' : 'Upload your first image to get started.'}
          </p>
          {!search && (
            <Link
              to="/dashboard/scan"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              <Upload className="w-4 h-4" />
              Start First Scan
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

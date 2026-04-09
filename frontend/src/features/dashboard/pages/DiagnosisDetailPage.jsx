import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle2,
  Trash2, Percent, Loader2
} from 'lucide-react';

const sevConfig = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Critical: 'bg-red-50 text-red-700 border-red-200',
};

export default function DiagnosisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadDiagnosis(); }, [id]);

  const loadDiagnosis = async () => {
    try {
      const res = await diagnosisAPI.getById(id);
      setDiagnosis(res.data.diagnosis);
    } catch (err) { navigate('/dashboard/history'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this diagnosis?')) return;
    setDeleting(true);
    try { await diagnosisAPI.delete(id); navigate('/dashboard/history'); }
    catch (err) { setDeleting(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>;
  }

  if (!diagnosis) return null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard/history" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <img src={diagnosis.imageUrl} alt="Diagnosis" className="w-full h-64 object-cover" />
          </div>
          <div className="card p-5 space-y-4">
            {diagnosis.petName && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" /><path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Pet Name</p>
                  <p className="text-sm font-medium text-slate-700">{diagnosis.petName}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Date</p>
                <p className="text-sm font-medium text-slate-700">
                  {new Date(diagnosis.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Time</p>
                <p className="text-sm font-medium text-slate-700">
                  {new Date(diagnosis.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <Percent className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Confidence</p>
                <p className="text-sm font-medium text-slate-700">{diagnosis.confidence}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-xl font-bold text-slate-900">{diagnosis.diseaseName}</h2>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${sevConfig[diagnosis.severity] || sevConfig.Medium}`}>
                {diagnosis.severity}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{diagnosis.description}</p>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Symptoms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {diagnosis.symptoms.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Treatment Recommendations
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{diagnosis.treatment}</p>
          </div>

          {diagnosis.notes && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Notes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{diagnosis.notes}</p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>⚠️ Disclaimer:</strong> This AI diagnosis is for informational purposes only. Please consult a licensed veterinarian for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

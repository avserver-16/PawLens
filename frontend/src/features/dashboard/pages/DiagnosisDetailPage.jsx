import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle2,
  Trash2, Dog, Percent, Loader2
} from 'lucide-react';

const severityColors = {
  Low: { gradient: 'from-emerald-500 to-emerald-600', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  Medium: { gradient: 'from-amber-500 to-amber-600', text: 'text-amber-400', bg: 'bg-amber-400/10' },
  High: { gradient: 'from-orange-500 to-orange-600', text: 'text-orange-400', bg: 'bg-orange-400/10' },
  Critical: { gradient: 'from-rose-500 to-rose-600', text: 'text-rose-400', bg: 'bg-rose-400/10' },
};

export default function DiagnosisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDiagnosis();
  }, [id]);

  const loadDiagnosis = async () => {
    try {
      const res = await diagnosisAPI.getById(id);
      setDiagnosis(res.data.diagnosis);
    } catch (err) {
      console.error('Failed to load diagnosis:', err);
      navigate('/dashboard/history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this diagnosis?')) return;
    setDeleting(true);
    try {
      await diagnosisAPI.delete(id);
      navigate('/dashboard/history');
    } catch (err) {
      console.error('Failed to delete:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!diagnosis) return null;

  const sev = severityColors[diagnosis.severity] || severityColors.Medium;

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/dashboard/history"
          className="flex items-center gap-2 text-surface-200 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col — Image & meta */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden glass">
            <img src={diagnosis.imageUrl} alt="Diagnosis" className="w-full h-72 object-cover" />
          </div>

          <div className="p-5 rounded-2xl glass space-y-4">
            {diagnosis.petName && (
              <div className="flex items-center gap-3">
                <Dog className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs text-surface-200/60">Pet Name</p>
                  <p className="font-medium text-sm">{diagnosis.petName}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-xs text-surface-200/60">Date</p>
                <p className="font-medium text-sm">
                  {new Date(diagnosis.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-xs text-surface-200/60">Time</p>
                <p className="font-medium text-sm">
                  {new Date(diagnosis.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-xs text-surface-200/60">Confidence</p>
                <p className="font-medium text-sm">{diagnosis.confidence}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right col — Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="p-6 rounded-2xl glass">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">{diagnosis.diseaseName}</h2>
              <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${sev.gradient} text-white text-sm font-medium`}>
                {diagnosis.severity}
              </span>
            </div>
            <p className="text-surface-200 text-sm leading-relaxed">{diagnosis.description}</p>
          </div>

          {/* Symptoms */}
          <div className="p-6 rounded-2xl glass">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Symptoms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {diagnosis.symptoms.map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-sm text-surface-200">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment */}
          <div className="p-6 rounded-2xl glass">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Treatment Recommendations
            </h3>
            <p className="text-surface-200 text-sm leading-relaxed">{diagnosis.treatment}</p>
          </div>

          {/* Notes */}
          {diagnosis.notes && (
            <div className="p-6 rounded-2xl glass">
              <h3 className="font-semibold mb-3">Notes</h3>
              <p className="text-surface-200 text-sm leading-relaxed">{diagnosis.notes}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <p className="text-xs text-amber-300/80 leading-relaxed">
              ⚠️ <strong>Disclaimer:</strong> This AI-generated diagnosis is for informational purposes only and should not replace professional veterinary advice. Please consult a licensed veterinarian for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle2,
  Trash2, Percent, Loader2
} from 'lucide-react';

const C = {
  surface: '#fbf9f4', surfaceContainerLow: '#f5f3ee', onSurface: '#1b1c19',
  onSurfaceVariant: '#504442', outlineVariant: '#d3c3c0', primary: '#271310',
  secondary: '#895200', primaryContainer: '#3e2723',
};

const sevColors = {
  Low: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Medium: { bg: '#fffbeb', color: '#b45309', border: '#fcd34d' },
  High: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  Critical: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
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
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${C.outlineVariant}`, borderTop: `2px solid ${C.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!diagnosis) return null;

  const sev = sevColors[diagnosis.severity] || sevColors.Medium;

  const metaItems = [
    ...(diagnosis.petName ? [{ icon: null, label: 'Pet Name', value: diagnosis.petName, svg: true }] : []),
    { icon: Calendar, label: 'Date', value: new Date(diagnosis.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { icon: Clock, label: 'Time', value: new Date(diagnosis.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
    { icon: Percent, label: 'Confidence', value: `${diagnosis.confidence}%` },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }} className="animate-fade-in-up">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.outlineVariant}30` }}>
        <Link to="/dashboard/history" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.onSurfaceVariant, textDecoration: 'none', transition: 'color 0.15s' }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back to History
        </Link>
        <button onClick={handleDelete} disabled={deleting}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s', opacity: deleting ? 0.5 : 1, fontFamily: 'inherit' }}>
          {deleting ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Trash2 style={{ width: 14, height: 14 }} />} Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 32 }}>
        {/* Left column */}
        <div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.outlineVariant}40`, marginBottom: 24 }}>
            <img src={diagnosis.imageUrl} alt="Diagnosis" style={{ width: '100%', height: 256, objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {metaItems.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < metaItems.length - 1 ? `1px solid ${C.outlineVariant}20` : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.secondary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.svg ? (
                    <svg style={{ width: 16, height: 16, color: C.secondary }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="10" r="3" /><path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
                    </svg>
                  ) : (
                    <item.icon style={{ width: 16, height: 16, color: C.secondary }} />
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: C.onSurfaceVariant }}>{item.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.primary, marginTop: 1 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          {/* Diagnosis header */}
          <div style={{ paddingBottom: 20, borderBottom: `1px solid ${C.outlineVariant}30` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 700, color: C.primary, margin: 0 }}>{diagnosis.diseaseName}</h2>
              <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                {diagnosis.severity}
              </span>
            </div>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{diagnosis.description}</p>
          </div>

          {/* Symptoms */}
          <div style={{ padding: '20px 0', borderBottom: `1px solid ${C.outlineVariant}30` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#d97706' }} /> Symptoms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8 }}>
              {diagnosis.symptoms.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: C.onSurfaceVariant }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment */}
          <div style={{ padding: '20px 0', borderBottom: `1px solid ${C.outlineVariant}30` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} /> Treatment Recommendations
            </h3>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{diagnosis.treatment}</p>
          </div>

          {/* Notes */}
          {diagnosis.notes && (
            <div style={{ padding: '20px 0', borderBottom: `1px solid ${C.outlineVariant}30` }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 8 }}>Notes</h3>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{diagnosis.notes}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ padding: '16px 0', marginTop: 4 }}>
            <p style={{ fontSize: 12, color: '#b45309', lineHeight: 1.6 }}>
              <strong>⚠️ Disclaimer:</strong> This AI diagnosis is for informational purposes only. Please consult a licensed veterinarian for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Upload, Camera, X, Loader2, CheckCircle2,
  AlertTriangle, FileImage, ArrowRight, Info
} from 'lucide-react';

const C = {
  surface: '#fbf9f4', surfaceContainerLow: '#f5f3ee', onSurface: '#1b1c19',
  onSurfaceVariant: '#504442', outlineVariant: '#d3c3c0', primary: '#271310',
  onPrimary: '#ffffff', secondary: '#895200', primaryContainer: '#3e2723',
};

export default function ScanPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [petName, setPetName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (selectedFile.size > 10 * 1024 * 1024) { setError('File must be under 10MB.'); return; }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
    setResult(null);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); };

  const handleSubmit = async () => {
    if (!file) { setError('Please select an image.'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (petName) formData.append('petName', petName);
      if (notes) formData.append('notes', notes);
      const res = await diagnosisAPI.create(formData);
      setResult(res.data.diagnosis);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => { setFile(null); setPreview(null); setPetName(''); setNotes(''); setResult(null); setError(''); };

  const sevColors = {
    Low: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
    Medium: { bg: '#fffbeb', color: '#b45309', border: '#fcd34d' },
    High: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    Critical: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: `1.5px solid ${C.outlineVariant}`, fontSize: 14, outline: 'none',
    background: C.surface, fontFamily: "'Hanken Grotesk', sans-serif",
    color: C.onSurface, boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  if (result) {
    const sev = sevColors[result.severity] || sevColors.Medium;
    return (
      <div className="animate-fade-in-up" style={{ maxWidth: 900 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <CheckCircle2 style={{ width: 28, height: 28, color: '#059669' }} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: C.primary }}>Analysis Complete</h2>
          <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 4 }}>Here are the results</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20 }}>
          <div>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.outlineVariant}40` }}>
              <img src={result.imageUrl} alt="Scanned" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
            </div>
            {result.petName && (
              <div style={{ padding: '16px 0', borderBottom: `1px solid ${C.outlineVariant}30` }}>
                <p style={{ fontSize: 11, color: C.onSurfaceVariant }}>Pet Name</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginTop: 2 }}>{result.petName}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Diagnosis */}
            <div style={{ paddingBottom: 20, borderBottom: `1px solid ${C.outlineVariant}30` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 11, color: C.onSurfaceVariant }}>Diagnosis</p>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: C.primary, marginTop: 2 }}>{result.diseaseName}</h3>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                    {result.severity}
                  </span>
                  <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: `${C.secondary}12`, color: C.secondary }}>
                    {result.confidence}% Match
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{result.description}</p>
            </div>

            {/* Symptoms */}
            <div style={{ padding: '20px 0', borderBottom: `1px solid ${C.outlineVariant}30` }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle style={{ width: 16, height: 16, color: '#d97706' }} /> Symptoms
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.symptoms.map((s, i) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: 8, background: C.surfaceContainerLow, border: `1px solid ${C.outlineVariant}40`, fontSize: 12, fontWeight: 500, color: C.onSurfaceVariant }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Treatment */}
            <div style={{ padding: '20px 0', borderBottom: `1px solid ${C.outlineVariant}30` }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} /> Treatment
              </h4>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{result.treatment}</p>
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 20 }}>
              <button onClick={resetForm} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '10px 20px',
                background: C.primary, color: C.onPrimary, borderRadius: 10, fontWeight: 600, border: 'none',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,19,16,0.2)', fontFamily: 'inherit',
              }}>
                <Upload style={{ width: 16, height: 16 }} /> New Scan
              </button>
              <button onClick={() => navigate('/dashboard/history')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '10px 20px',
                background: C.surface, color: C.primary, borderRadius: 10, fontWeight: 600,
                border: `1px solid ${C.outlineVariant}`, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                View History <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.outlineVariant}40` }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: C.primary, margin: 0 }}>New Skin Scan</h2>
        <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 4 }}>Upload a photo for AI-powered analysis</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && (
          <div style={{ padding: 12, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }} className="animate-fade-in">{error}</div>
        )}

        <div
          style={{
            border: `2px dashed ${dragOver ? C.secondary : C.outlineVariant}`,
            borderRadius: 16, transition: 'all 0.2s',
            background: dragOver ? `${C.secondary}08` : C.surface,
            cursor: preview ? 'default' : 'pointer',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {preview ? (
            <div style={{ position: 'relative' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: 280, objectFit: 'contain', borderRadius: 16, padding: 8 }} />
              <button onClick={resetForm} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', background: C.surface, border: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <X style={{ width: 14, height: 14, color: C.onSurfaceVariant }} />
              </button>
              <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '4px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.outlineVariant}40`, fontSize: 11, color: C.onSurfaceVariant, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <FileImage style={{ width: 12, height: 12 }} /> {file?.name}
              </div>
            </div>
          ) : (
            <div style={{ padding: '48px 24px', textAlign: 'center' }} onClick={() => fileInputRef.current?.click()}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${C.secondary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Camera style={{ width: 28, height: 28, color: C.secondary }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.primary, marginBottom: 4 }}>Drop image here</p>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginBottom: 12 }}>or click to browse</p>
              <p style={{ fontSize: 12, color: C.outlineVariant }}>JPEG, PNG, WebP · Max 10MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>
              Pet Name <span style={{ color: C.outlineVariant }}>(optional)</span>
            </label>
            <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} style={inputStyle} placeholder="e.g., Buddy" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>
              Notes <span style={{ color: C.outlineVariant }}>(optional)</span>
            </label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} placeholder="Additional observations..." />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!file || loading}
          style={{
            width: '100%', padding: 14, fontSize: 14, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: C.primary, color: C.onPrimary, borderRadius: 12, border: 'none',
            cursor: (!file || loading) ? 'not-allowed' : 'pointer', opacity: (!file || loading) ? 0.4 : 1,
            boxShadow: '0 2px 8px rgba(39,19,16,0.25)', fontFamily: 'inherit', transition: 'all 0.2s',
          }}>
          {loading ? (
            <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Analyzing...</>
          ) : (
            <><Upload style={{ width: 16, height: 16 }} /> Analyze Image</>
          )}
        </button>

        <div style={{ padding: 20, borderTop: `1px solid ${C.outlineVariant}30` }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info style={{ width: 16, height: 16, color: C.secondary }} /> Tips for Best Results
          </h4>
          <div className="grid grid-cols-2" style={{ gap: 8 }}>
            {['Good natural lighting', 'Focus on affected area', 'Clear, sharp image', 'Multiple angles help'].map(tip => (
              <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.onSurfaceVariant }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.secondary, flexShrink: 0 }} />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

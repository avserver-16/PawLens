import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Upload, Camera, X, Loader2, CheckCircle2,
  AlertTriangle, FileImage, ArrowRight, Info
} from 'lucide-react';

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

  if (result) {
    const sev = sevColors[result.severity] || sevColors.Medium;
    return (
      <div className="animate-fade-in-up" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <CheckCircle2 style={{ width: '28px', height: '28px', color: '#059669' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Analysis Complete</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Here are the results</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <img src={result.imageUrl} alt="Scanned" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            {result.petName && (
              <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Pet Name</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>{result.petName}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Diagnosis</p>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{result.diseaseName}</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                    {result.severity}
                  </span>
                  <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
                    {result.confidence}% Match
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>{result.description}</p>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle style={{ width: '16px', height: '16px', color: '#d97706' }} /> Symptoms
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.symptoms.map((s, i) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 500, color: '#475569' }}>{s}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} /> Treatment
              </h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>{result.treatment}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={resetForm} className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px', gap: '6px' }}>
                <Upload style={{ width: '16px', height: '16px' }} /> New Scan
              </button>
              <button onClick={() => navigate('/dashboard/history')} className="btn-secondary" style={{ fontSize: '13px', padding: '10px 20px', gap: '6px' }}>
                View History <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>New Skin Scan</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Upload a photo for AI-powered analysis</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && (
          <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px' }} className="animate-fade-in">{error}</div>
        )}

        <div
          style={{
            border: `2px dashed ${dragOver ? '#818cf8' : preview ? '#e2e8f0' : '#e2e8f0'}`,
            borderRadius: '16px',
            transition: 'all 0.2s',
            background: dragOver ? '#eef2ff' : preview ? '#fff' : '#fff',
            cursor: preview ? 'default' : 'pointer',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {preview ? (
            <div style={{ position: 'relative' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '280px', objectFit: 'contain', borderRadius: '16px', padding: '8px' }} />
              <button onClick={resetForm} style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <X style={{ width: '14px', height: '14px', color: '#64748b' }} />
              </button>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', padding: '4px 10px', borderRadius: '8px', background: '#fff', border: '1px solid #f1f5f9', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <FileImage style={{ width: '12px', height: '12px' }} /> {file?.name}
              </div>
            </div>
          ) : (
            <div style={{ padding: '48px 24px', textAlign: 'center' }} onClick={() => fileInputRef.current?.click()}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Camera style={{ width: '28px', height: '28px', color: '#6366f1' }} />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Drop image here</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>or click to browse</p>
              <p style={{ fontSize: '12px', color: '#cbd5e1' }}>JPEG, PNG, WebP · Max 10MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
              Pet Name <span style={{ color: '#cbd5e1' }}>(optional)</span>
            </label>
            <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)}
              className="input-field" placeholder="e.g., Buddy" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
              Notes <span style={{ color: '#cbd5e1' }}>(optional)</span>
            </label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="input-field" placeholder="Additional observations..." />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!file || loading}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '14px', gap: '8px', opacity: (!file || loading) ? 0.4 : 1, cursor: (!file || loading) ? 'not-allowed' : 'pointer' }}>
          {loading ? (
            <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Analyzing...</>
          ) : (
            <><Upload style={{ width: '16px', height: '16px' }} /> Analyze Image</>
          )}
        </button>

        <div className="card-flat" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info style={{ width: '16px', height: '16px', color: '#6366f1' }} /> Tips for Best Results
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['Good natural lighting', 'Focus on affected area', 'Clear, sharp image', 'Multiple angles help'].map(tip => (
              <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
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

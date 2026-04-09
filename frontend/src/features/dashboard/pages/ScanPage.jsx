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
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Critical: 'bg-red-50 text-red-700 border-red-200',
  };

  if (result) {
    const sevClass = sevColors[result.severity] || sevColors.Medium;
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Analysis Complete</h2>
          <p className="text-sm text-slate-500 mt-1">Here are the results</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card overflow-hidden">
            <img src={result.imageUrl} alt="Scanned" className="w-full h-56 object-cover" />
            {result.petName && (
              <div className="p-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">Pet Name</p>
                <p className="text-sm font-semibold text-slate-700">{result.petName}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-400">Diagnosis</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{result.diseaseName}</h3>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${sevClass}`}>
                    {result.severity}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                    {result.confidence}% Match
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.description}</p>
            </div>

            <div className="card p-5">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Symptoms
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">{s}</span>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Treatment
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">{result.treatment}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={resetForm} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> New Scan
              </button>
              <button onClick={() => navigate('/dashboard/history')} className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-1.5">
                View History <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">New Skin Scan</h2>
        <p className="text-sm text-slate-500 mt-1">Upload a photo for AI-powered analysis</p>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-fade-in">{error}</div>
        )}

        <div
          className={`relative border-2 border-dashed rounded-2xl transition-all ${
            dragOver ? 'border-primary-400 bg-primary-50/50' : preview ? 'border-slate-200 bg-white' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-64 sm:h-72 object-contain rounded-2xl p-2" />
              <button onClick={resetForm} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white shadow-sm text-[11px] text-slate-500 flex items-center gap-1.5 border border-slate-100">
                <FileImage className="w-3 h-3" /> {file?.name}
              </div>
            </div>
          ) : (
            <div className="p-12 sm:p-16 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-7 h-7 text-primary-500" />
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">Drop image here</p>
              <p className="text-sm text-slate-400 mb-3">or click to browse</p>
              <p className="text-xs text-slate-300">JPEG, PNG, WebP · Max 10MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Pet Name <span className="text-slate-300">(optional)</span></label>
            <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)}
              className="input-field" placeholder="e.g., Buddy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes <span className="text-slate-300">(optional)</span></label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="input-field" placeholder="Additional observations..." />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!file || loading}
          className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Upload className="w-4 h-4" /> Analyze Image</>
          )}
        </button>

        <div className="card-flat p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-500" /> Tips for Best Results
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Good natural lighting', 'Focus on affected area', 'Clear, sharp image', 'Multiple angles help'].map(tip => (
              <div key={tip} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

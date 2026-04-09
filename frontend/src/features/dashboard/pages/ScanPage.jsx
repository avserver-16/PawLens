import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { diagnosisAPI } from '../../auth/services/services';
import {
  Upload, Camera, X, Dog, Loader2, CheckCircle2,
  AlertTriangle, FileImage, ArrowRight
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

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.).');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }

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
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setPetName('');
    setNotes('');
    setResult(null);
    setError('');
  };

  const severityColors = {
    Low: 'from-emerald-500 to-emerald-600',
    Medium: 'from-amber-500 to-amber-600',
    High: 'from-orange-500 to-orange-600',
    Critical: 'from-rose-500 to-rose-600',
  };

  if (result) {
    const sevColor = severityColors[result.severity] || severityColors.Medium;
    return (
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Analysis Complete</h2>
          <p className="text-surface-200 mt-1 text-sm">Here are the results for your pet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden glass">
            <img src={result.imageUrl} alt="Scanned" className="w-full h-64 object-cover" />
            {result.petName && (
              <div className="p-4 border-t border-white/5">
                <p className="text-sm text-surface-200">Pet Name</p>
                <p className="font-medium">{result.petName}</p>
              </div>
            )}
          </div>

          {/* Diagnosis details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Disease + Severity */}
            <div className="p-6 rounded-2xl glass">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-surface-200">Diagnosis</p>
                  <h3 className="text-2xl font-bold mt-1">{result.diseaseName}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${sevColor} text-white text-sm font-medium`}>
                    {result.severity} Severity
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium border border-primary-500/20">
                    {result.confidence}% Confidence
                  </span>
                </div>
              </div>
              <p className="text-surface-200 text-sm leading-relaxed">{result.description}</p>
            </div>

            {/* Symptoms */}
            <div className="p-6 rounded-2xl glass">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Symptoms
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-surface-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Treatment */}
            <div className="p-6 rounded-2xl glass">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Treatment Recommendations
              </h4>
              <p className="text-surface-200 text-sm leading-relaxed">{result.treatment}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Scan
              </button>
              <button
                onClick={() => navigate('/dashboard/history')}
                className="px-6 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-all flex items-center gap-2"
              >
                View History
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">New Skin Scan</h2>
        <p className="text-surface-200 mt-1 text-sm">Upload a photo of your dog's skin condition for AI analysis</p>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Upload area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
            dragOver
              ? 'border-primary-500 bg-primary-500/5'
              : preview
              ? 'border-white/20 bg-white/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-72 sm:h-80 object-contain rounded-2xl p-2" />
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-900/80 flex items-center justify-center text-surface-200 hover:text-white hover:bg-surface-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-surface-900/80 text-xs text-surface-200 flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5" />
                {file?.name}
              </div>
            </div>
          ) : (
            <div
              className="p-12 sm:p-16 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary-400" />
              </div>
              <p className="text-lg font-medium mb-2">Drop your image here</p>
              <p className="text-sm text-surface-200 mb-4">or click to browse files</p>
              <p className="text-xs text-surface-200/50">Supports: JPEG, PNG, WebP • Max size: 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Extra info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-2">Pet Name (optional)</label>
            <div className="relative">
              <Dog className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/50" />
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm"
                placeholder="e.g., Buddy"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm"
              placeholder="Any additional observations..."
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Image...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Analyze Image
            </>
          )}
        </button>

        {/* Tips */}
        <div className="p-5 rounded-2xl bg-primary-500/5 border border-primary-500/10">
          <h4 className="font-medium text-sm mb-3 text-primary-300">📸 Tips for Best Results</h4>
          <ul className="space-y-2 text-sm text-surface-200">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
              Take photos in good natural lighting
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
              Focus closely on the affected skin area
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
              Ensure the image is clear and not blurry
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
              Multiple angles help for better accuracy
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

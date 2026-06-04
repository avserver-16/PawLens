import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getColors } from '../../../theme/colors';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { isDark } = useTheme();
  const C = useMemo(() => getColors(isDark), [isDark]);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 40px', borderRadius: 12,
    border: `1.5px solid ${C.outlineVariant}`, fontSize: 14, outline: 'none',
    background: C.surface, fontFamily: "'Hanken Grotesk', sans-serif",
    color: C.onSurface, boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Hanken Grotesk', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{
        width: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
        position: 'relative', overflow: 'hidden', flexDirection: 'column', justifyContent: 'center', padding: 64,
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 24, height: 24, color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <circle cx="7" cy="6" r="1.5" fill="currentColor" />
                <circle cx="17" cy="6" r="1.5" fill="currentColor" />
                <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 700, color: '#fff' }}>PawLens</span>
          </Link>

          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
            AI-Powered Skin<br />Disease Detection
          </h2>
          <p style={{ fontSize: 15, color: C.primaryFixedDim, lineHeight: 1.7, maxWidth: 360 }}>
            Upload a photo of your dog's skin condition and get an instant diagnosis with treatment recommendations.
          </p>

          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Instant AI analysis', 'Detailed treatment guidance', 'Track health history'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: C.primaryFixedDim }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg style={{ width: 12, height: 12, color: '#fff' }} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: C.surfaceContainerLow }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-in-up">
          <Link to="/" className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(39,19,16,0.2)' }}>
              <svg style={{ width: 20, height: 20, color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" /></svg>
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: C.primary }}>PawLens</span>
          </Link>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant }}>Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: 20 }} className="animate-fade-in">{error}</div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.outlineVariant }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.outlineVariant }} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required style={{ ...inputStyle, paddingRight: 40 }} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.outlineVariant, cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 14, fontSize: 14, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: C.primary, color: C.onPrimary, borderRadius: 12, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              boxShadow: '0 2px 8px rgba(39,19,16,0.25)', fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              {loading ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: C.onSurfaceVariant }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: C.secondary, fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

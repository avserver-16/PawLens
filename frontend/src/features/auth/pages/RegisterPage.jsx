import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
    try { await register(formData); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const pwStrength = formData.password.length >= 12 ? 4 : formData.password.length >= 8 ? 3 : formData.password.length >= 6 ? 2 : formData.password.length >= 1 ? 1 : 0;
  const pwColors = ['#e2e8f0', '#f87171', '#fbbf24', '#34d399', '#22c55e'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{ width: '50%', background: 'linear-gradient(135deg, #4f46e5, #3730a3)', position: 'relative', overflow: 'hidden', flexDirection: 'column', justifyContent: 'center', padding: '64px' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '48px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px', color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <circle cx="7" cy="6" r="1.5" fill="currentColor" />
                <circle cx="17" cy="6" r="1.5" fill="currentColor" />
                <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>PawLens</span>
          </Link>

          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '16px' }}>Join Thousands of<br />Pet Owners</h2>
          <p style={{ fontSize: '15px', color: '#c7d2fe', lineHeight: 1.7, maxWidth: '360px' }}>
            Create your free account and start protecting your furry friend's skin health with AI-powered diagnostics.
          </p>

          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['Free to get started', 'No credit card required', 'Instant AI results'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#e0e7ff' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg style={{ width: '12px', height: '12px', color: '#fff' }} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-in-up">
          <Link to="/" className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '32px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }}>
              <svg style={{ width: '20px', height: '20px', color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" /></svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>PawLens</span>
          </Link>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Create your account</h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Get started with PawLens in seconds.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', marginBottom: '20px' }} className="animate-fade-in">{error}</div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" name="username" value={formData.username} onChange={handleChange} required minLength={3} maxLength={30} className="input-field" style={{ paddingLeft: '40px' }} placeholder="pawlover123" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" style={{ paddingLeft: '40px' }} placeholder="you@example.com" />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required minLength={6} className="input-field" style={{ paddingLeft: '40px', paddingRight: '40px' }} placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: '4px', flex: 1, borderRadius: '100px', background: i <= pwStrength ? pwColors[pwStrength] : '#e2e8f0', transition: 'all 0.3s' }} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '14px', gap: '8px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

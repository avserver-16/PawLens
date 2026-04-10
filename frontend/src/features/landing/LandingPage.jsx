import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import {
  Shield, Zap, BarChart3, ArrowRight, Star,
  Microscope, Heart, Clock, Menu, X, Send, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { feedbackAPI } from '../auth/services/services';

function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }}>
              <svg style={{ width: '20px', height: '20px', color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <circle cx="7" cy="6" r="1.5" fill="currentColor" />
                <circle cx="17" cy="6" r="1.5" fill="currentColor" />
                <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.02em' }}>PawLens</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            <a href="#features" style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', textDecoration: 'none' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', textDecoration: 'none' }}>How It Works</a>
            <a href="#testimonials" style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', textDecoration: 'none' }}>Testimonials</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden md:flex">
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px', gap: '8px' }}>
                Dashboard <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none', padding: '10px 16px' }}>Sign In</Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>Get Started Free</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'none', border: 'none', color: '#475569', padding: '8px', cursor: 'pointer' }}>
            {mobileOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden" style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '12px 24px' }}>
          <a href="#features" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 0', fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 0', fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>How It Works</a>
          <a href="#testimonials" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 0', fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>Testimonials</a>
          <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ width: '100%', fontSize: '14px' }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '10px 0', fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>Sign In</Link>
                <Link to="/register" className="btn-primary" style={{ width: '100%', fontSize: '14px', marginTop: '8px' }}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const features = [
  { icon: <Microscope size={20} />, title: 'AI-Powered Diagnosis', description: 'Advanced Vision Transformer model trained on thousands of canine skin disease images for accurate identification.', color: '#eef2ff', iconColor: '#4f46e5' },
  { icon: <Zap size={20} />, title: 'Instant Results', description: 'Get disease predictions and detailed analysis in seconds. Upload a photo and let our AI do the rest.', color: '#fffbeb', iconColor: '#d97706' },
  { icon: <Heart size={20} />, title: 'Treatment Guidance', description: 'Comprehensive treatment recommendations, symptom details, and severity assessments for each diagnosis.', color: '#fef2f2', iconColor: '#dc2626' },
  { icon: <BarChart3 size={20} />, title: 'Track Health History', description: "Keep a complete record of all diagnoses. Monitor your pet's skin health over time with detailed analytics.", color: '#f0fdf4', iconColor: '#16a34a' },
  { icon: <Shield size={20} />, title: 'Secure & Private', description: "Your pet's data is encrypted and protected. We follow industry-standard security practices.", color: '#f5f3ff', iconColor: '#7c3aed' },
  { icon: <Clock size={20} />, title: '24/7 Availability', description: 'Access PawLens anytime, anywhere. No appointments needed — get instant peace of mind.', color: '#f0f9ff', iconColor: '#0284c7' },
];

const steps = [
  { num: '1', title: 'Upload Photo', desc: 'Take a clear photo of the affected skin area on your dog and upload it.' },
  { num: '2', title: 'AI Analysis', desc: 'Our Vision Transformer model analyzes the image and identifies skin conditions.' },
  { num: '3', title: 'Get Results', desc: 'Receive a detailed diagnosis with disease name, symptoms, treatment, and severity.' },
  { num: '4', title: 'Take Action', desc: 'Follow treatment guidance and consult your vet with the generated report.' },
];

const hardcodedTestimonials = [
  { name: 'Dr. Sarah Mitchell', role: 'Veterinarian', text: 'PawLens has been invaluable for early screening. The AI accuracy is impressive and helps pet owners identify issues early.', rating: 5 },
  { name: 'James Rodriguez', role: 'Dog Owner', text: 'I noticed a weird patch on my Golden Retriever and PawLens identified it as a fungal infection. The vet confirmed it!', rating: 5 },
  { name: 'Emily Chen', role: 'Pet Groomer', text: 'I recommend PawLens to all my clients. Quick, accurate, and gives detailed treatment guidance. A game-changer for pet care.', rating: 5 },
];

function TestimonialCard({ name, role, text, rating }) {
  return (
    <div className="card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
        {Array.from({ length: rating }).map((_, j) => (
          <Star key={j} size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
        ))}
        {Array.from({ length: 5 - rating }).map((_, j) => (
          <Star key={`e${j}`} size={16} style={{ color: '#e2e8f0' }} />
        ))}
      </div>
      <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '20px' }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{name}</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

function FeedbackForm({ onSubmitted }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || stars === 0) {
      setError('Please fill in your name, message, and select a rating.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await feedbackAPI.create({ name: name.trim(), role: role.trim() || 'Pet Owner', message: message.trim(), stars });
      setSuccess(true);
      setName(''); setRole(''); setMessage(''); setStars(0);
      if (onSubmitted) onSubmitted();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '32px', maxWidth: '480px', width: '100%' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Share Your Experience</h3>
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>We'd love to hear your feedback about PawLens</p>

      {success && (
        <div style={{ padding: '12px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          ✓ Thank you for your feedback!
        </div>
      )}
      {error && (
        <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Role <span style={{ color: '#cbd5e1' }}>(optional)</span></label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Dog Owner"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Rating *</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setStars(s)}
                onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s', transform: (hoveredStar >= s || stars >= s) ? 'scale(1.15)' : 'scale(1)' }}>
                <Star size={24} style={{ color: (hoveredStar >= s || stars >= s) ? '#f59e0b' : '#e2e8f0', fill: (hoveredStar >= s || stars >= s) ? '#f59e0b' : 'none', transition: 'all 0.15s' }} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Message *</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about your experience..."
            rows={3}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '14px', gap: '8px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
          ) : (
            <><Send size={16} /> Submit Feedback</>
          )}
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function LiveTestimonials() {
  const [feedbacks, setFeedbacks] = useState([]);

  const loadFeedbacks = async () => {
    try {
      const res = await feedbackAPI.getTop();
      setFeedbacks(res.data.feedbacks);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    }
  };

  useEffect(() => { loadFeedbacks(); }, []);

  if (feedbacks.length === 0) return null;

  return (
    <section style={{ padding: '80px 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Community Feedback</p>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>What Users Are Saying</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {feedbacks.map((f) => (
            <TestimonialCard key={f._id} name={f.name} role={f.role} text={f.message} rating={f.stars} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', right: '-100px', width: '500px', height: '500px', background: '#eef2ff', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', background: '#f5f3ff', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.5 }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: '#eef2ff', border: '1px solid #e0e7ff', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4338ca', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Powered by Vision Transformer AI</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px 0' }}>
            Protect Your Dog's{' '}
            <span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Skin Health
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 32px auto' }}>
            Upload a photo of your dog's skin condition and get an instant AI-powered diagnosis with treatment recommendations.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '36px' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px', gap: '8px' }}>
              Start Free Analysis <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              See How It Works
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {['Demodicosis', 'Fungal Infections', 'Dermatosis', 'Hypersensitivity', 'Healthy Skin', 'Ringworm'].map(d => (
              <span key={d} style={{ padding: '4px 12px', borderRadius: '100px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 500, color: '#64748b' }}>{d}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#fcfcfd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
            {[
              { value: '91%+', label: 'Accuracy Rate' },
              { value: '6', label: 'Diseases Detected' },
              { value: '<5s', label: 'Analysis Time' },
              { value: '24/7', label: 'Available' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>{s.value}</p>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>Everything for Pet Skin Care</h2>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Advanced AI technology meets compassionate pet care.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.iconColor, marginBottom: '16px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>How It Works</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Simple 4-Step Process</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
            {steps.map((s, i) => (
              <div key={i}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', color: '#fff', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardcoded Testimonials */}
      <section id="testimonials" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Trusted by Pet Lovers</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {hardcodedTestimonials.map((t, i) => (
              <TestimonialCard key={i} name={t.name} role={t.role} text={t.text} rating={t.rating} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Community Feedback (top 3 from DB) */}
      <LiveTestimonials key={refreshKey} />

      {/* Feedback Form */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '32px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Leave Feedback</p>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Tell Us What You Think</h2>
              <p style={{ fontSize: '15px', color: '#64748b', marginTop: '12px' }}>Your feedback helps us improve PawLens for everyone.</p>
            </div>

            <FeedbackForm onSubmitted={() => setRefreshKey(k => k + 1)} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #4f46e5, #3730a3)', padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em', position: 'relative' }}>Ready to Protect Your Pet?</h2>
            <p style={{ fontSize: '16px', color: '#c7d2fe', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px auto', lineHeight: 1.6, position: 'relative' }}>
              Join pet owners who trust PawLens for early detection and peace of mind.
            </p>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: '#fff', color: '#4338ca', borderRadius: '12px', fontWeight: 600, fontSize: '16px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', position: 'relative', transition: 'transform 0.2s' }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 0', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '14px', height: '14px', color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, color: '#334155' }}>PawLens</span>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>© 2026 PawLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

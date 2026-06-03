import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, Star, Send, Loader2 } from 'lucide-react';
import { feedbackAPI } from '../auth/services/services';

/* ── Design tokens ── */
const C = {
  surface: '#fbf9f4',
  surfaceContainer: '#f0eee9',
  surfaceContainerLow: '#f5f3ee',
  surfaceContainerHigh: '#eae8e3',
  surfaceVariant: '#e4e2dd',
  onSurface: '#1b1c19',
  onSurfaceVariant: '#504442',
  primary: '#271310',
  onPrimary: '#ffffff',
  primaryContainer: '#3e2723',
  primaryFixedDim: '#e3beb8',
  secondary: '#895200',
  onSecondary: '#ffffff',
  secondaryContainer: '#feb158',
  secondaryFixed: '#ffdcbc',
  tertiary: '#765b00',
  tertiaryContainer: '#c9a74d',
  outlineVariant: '#d3c3c0',
};

/* ── Material Symbol icon ── */
function Icon({ name, fill, size = 24, style = {} }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        fontVariationSettings: fill
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        lineHeight: 1,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

/* ── Section reveal animation ── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════ */
function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 20));
  }, [scrollY]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: `${C.surface}dd`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.outlineVariant}30`,
      boxShadow: scrolled ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.02)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', maxWidth: 1200, margin: '0 auto', height: 64 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(39,19,16,0.2)',
          }}>
            <svg style={{ width: 20, height: 20, color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <circle cx="7" cy="6" r="1.5" fill="currentColor" />
              <circle cx="17" cy="6" r="1.5" fill="currentColor" />
              <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em' }}>PawLens</span>
        </Link>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: 14, fontWeight: 500, color: C.onSurfaceVariant, textDecoration: 'none', transition: 'color 0.2s' }}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
          {user ? (
            <Link to="/dashboard" style={{
              background: C.primary, color: C.onPrimary, padding: '10px 20px', borderRadius: 12,
              fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(39,19,16,0.2)',
            }}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: C.onSurfaceVariant, textDecoration: 'none', padding: '10px 16px' }}>Sign In</Link>
              <Link to="/register" style={{
                background: C.primary, color: C.onPrimary, padding: '10px 20px', borderRadius: 12,
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(39,19,16,0.2)',
              }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'none', border: 'none', color: C.onSurfaceVariant, padding: 8, cursor: 'pointer' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden" style={{ overflow: 'hidden', background: C.surface, borderTop: `1px solid ${C.outlineVariant}30` }}>
            <div style={{ padding: '12px 24px' }}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 0', fontSize: 14, fontWeight: 500, color: C.onSurfaceVariant, textDecoration: 'none' }}>
                  {link.label}
                </a>
              ))}
              <div style={{ paddingTop: 12, borderTop: `1px solid ${C.outlineVariant}30`, marginTop: 4 }}>
                {user ? (
                  <Link to="/dashboard" style={{ display: 'block', textAlign: 'center', background: C.primary, color: C.onPrimary, padding: 12, borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '10px 0', fontSize: 14, fontWeight: 500, color: C.onSurfaceVariant, textDecoration: 'none' }}>Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', background: C.primary, color: C.onPrimary, padding: 12, borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginTop: 8 }}>Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section style={{ background: C.surface, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background blurs */}
      <div style={{ position: 'absolute', top: -200, right: -100, width: 500, height: 500, background: C.surfaceContainerLow, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.7 }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: C.secondaryFixed, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2 }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div className="flex flex-col md:flex-row items-center" style={{ minHeight: '85vh', paddingTop: 80, paddingBottom: 60, gap: 48 }}>
          {/* Dog image — left */}
          <div className="flex-1 order-2 md:order-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              alt="PawLens Mascot — Dug"
              src="/Dug-nobg.png"
              style={{ width: '100%', maxWidth: 480, height: 'auto' }}
            />
          </div>

          {/* Text — right */}
          <div className="flex-1 order-1 md:order-2" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Reveal>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100,
                background: `${C.tertiaryContainer}33`, border: `1px solid ${C.tertiary}33`,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: C.tertiary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Powered by Vision Transformer AI</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: C.primary,
                fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0,
              }}>
                Protect Your Dog's{' '}
                <span style={{ color: C.secondary }}>Skin Health</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontSize: 18, color: C.onSurfaceVariant, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
                Upload a photo of your dog's skin condition and get an instant AI-powered diagnosis with treatment recommendations.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="flex flex-col sm:flex-row" style={{ gap: 12, paddingTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
                  background: C.primary, color: C.onPrimary, borderRadius: 12, fontSize: 16, fontWeight: 600,
                  textDecoration: 'none', boxShadow: '0 2px 8px rgba(39,19,16,0.25)', transition: 'all 0.2s',
                }}>
                  Start Free Analysis →
                </Link>
                <a href="#how-it-works" style={{
                  display: 'inline-flex', alignItems: 'center', padding: '14px 32px',
                  background: C.onPrimary, color: C.primary, borderRadius: 12, fontSize: 16, fontWeight: 600,
                  textDecoration: 'none', border: `1px solid ${C.outlineVariant}`, transition: 'all 0.2s',
                }}>
                  See How It Works
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8 }}>
                {['Demodicosis', 'Fungal Infections', 'Dermatitis', 'Hypersensitivity', 'Healthy Skin', 'Ringworm'].map(d => (
                  <span key={d} style={{
                    padding: '4px 12px', borderRadius: 100, background: C.surfaceContainer,
                    border: `1px solid ${C.outlineVariant}60`, fontSize: 12, fontWeight: 500, color: C.onSurfaceVariant,
                  }}>
                    {d}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   STATS BAND
   ═══════════════════════════════════════════════ */
function StatsBand() {
  const stats = [
    { value: '91%+', label: 'Accuracy Rate' },
    { value: '6', label: 'Diseases Detected' },
    { value: '<5s', label: 'Analysis Time' },
    { value: '24/7', label: 'Available' },
  ];

  return (
    <section style={{ background: C.surfaceContainer, borderTop: `1px solid ${C.outlineVariant}30`, borderBottom: `1px solid ${C.outlineVariant}30` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 24, textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 28, fontWeight: 700, color: C.primary, fontFamily: "'Manrope', sans-serif" }}>{s.value}</p>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FEATURES — 6 CARDS
   ═══════════════════════════════════════════════ */
const features = [
  { icon: 'biotech', title: 'AI-Powered Diagnosis', description: 'Advanced Vision Transformer model trained on 4,200+ canine skin disease images for accurate identification.', bg: `${C.secondaryFixed}40`, ic: C.secondary },
  { icon: 'bolt', title: 'Instant Results', description: 'Get disease predictions and detailed analysis in seconds. Upload a photo and let our AI do the rest.', bg: `${C.secondaryContainer}30`, ic: C.tertiary },
  { icon: 'favorite', title: 'Treatment Guidance', description: 'Comprehensive treatment recommendations, symptom details, and severity assessments for each diagnosis.', bg: `${C.primaryFixedDim}40`, ic: '#b45050' },
  { icon: 'bar_chart', title: 'Track Health History', description: "Keep a complete record of all diagnoses. Monitor your pet's skin health over time with detailed analytics.", bg: '#e8f5e940', ic: '#2e7d32' },
  { icon: 'shield', title: 'Secure & Private', description: "Your pet's data is encrypted and protected. We follow industry-standard security practices.", bg: `${C.surfaceVariant}80`, ic: C.primary },
  { icon: 'schedule', title: '24/7 Availability', description: 'Access PawLens anytime, anywhere. No appointments needed — get instant peace of mind.', bg: '#e3f2fd50', ic: '#1565c0' },
];

function Features() {
  return (
    <section id="features" style={{ background: C.surfaceContainerLow, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px auto' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.secondary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Features</p>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>Everything for Pet Skin Care</h2>
            <p style={{ fontSize: 15, color: C.onSurfaceVariant }}>Advanced AI technology meets compassionate pet care.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(39,19,16,0.06)', borderColor: C.outlineVariant }}
                transition={{ duration: 0.25 }}
                style={{
                  background: C.surface, border: `1px solid ${C.outlineVariant}40`, borderRadius: 16,
                  padding: 28, transition: 'all 0.25s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon name={f.icon} size={22} style={{ color: f.ic }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.primary, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.6 }}>{f.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS — 4 STEPS
   ═══════════════════════════════════════════════ */
const steps = [
  { num: '1', title: 'Upload Photo', desc: 'Take a clear photo of the affected skin area on your dog and upload it.' },
  { num: '2', title: 'AI Analysis', desc: 'Our Vision Transformer model analyzes the image and identifies skin conditions.' },
  { num: '3', title: 'Get Results', desc: 'Receive a detailed diagnosis with disease name, symptoms, treatment, and severity.' },
  { num: '4', title: 'Take Action', desc: 'Follow treatment guidance and consult your vet with the generated report.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: C.surface, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px auto' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.secondary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>How It Works</p>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em', margin: 0 }}>Simple 4-Step Process</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 24, textAlign: 'center' }}>
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                  color: C.onPrimary, fontSize: 20, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px auto', boxShadow: '0 4px 12px rgba(39,19,16,0.25)',
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.primary, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════ */
const hardcodedTestimonials = [
  { name: 'Dr. Sarah Mitchell', role: 'Veterinarian', text: 'PawLens has been invaluable for early screening. The AI accuracy is impressive and helps pet owners identify issues early.', rating: 5 },
  { name: 'James Rodriguez', role: 'Dog Owner', text: 'I noticed a weird patch on my Golden Retriever and PawLens identified it as a fungal infection. The vet confirmed it!', rating: 5 },
  { name: 'Emily Chen', role: 'Pet Groomer', text: 'I recommend PawLens to all my clients. Quick, accurate, and gives detailed treatment guidance. A game-changer for pet care.', rating: 5 },
];

function TestimonialCard({ name, role, text, rating }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(39,19,16,0.06)' }}
      transition={{ duration: 0.25 }}
      style={{
        background: C.surface, border: `1px solid ${C.outlineVariant}40`,
        borderRadius: 16, padding: 28, transition: 'all 0.25s',
      }}
    >
      <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
        {Array.from({ length: rating }).map((_, j) => (
          <Star key={j} size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
        ))}
        {Array.from({ length: 5 - rating }).map((_, j) => (
          <Star key={`e${j}`} size={16} style={{ color: C.outlineVariant }} />
        ))}
      </div>
      <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.7, marginBottom: 20 }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: `1px solid ${C.outlineVariant}30` }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.secondary}, ${C.primaryContainer})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 700,
        }}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{name}</p>
          <p style={{ fontSize: 12, color: C.onSurfaceVariant }}>{role}</p>
        </div>
      </div>
    </motion.div>
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
    <section style={{ padding: '80px 0', background: C.surfaceContainer }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px auto' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.secondary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Community Feedback</p>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em', margin: 0 }}>What Users Are Saying</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {feedbacks.map((f) => (
            <Reveal key={f._id}>
              <TestimonialCard name={f.name} role={f.role} text={f.message} rating={f.stars} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ refreshKey }) {
  return (
    <>
      <section id="testimonials" style={{ padding: '80px 0', background: C.surfaceContainerLow }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px auto' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.secondary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Testimonials</p>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em', margin: 0 }}>Trusted by Pet Lovers</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
            {hardcodedTestimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <TestimonialCard name={t.name} role={t.role} text={t.text} rating={t.rating} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LiveTestimonials key={refreshKey} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   FEEDBACK FORM
   ═══════════════════════════════════════════════ */
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

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid ${C.outlineVariant}`, fontSize: 13, outline: 'none',
    background: C.surface, fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.outlineVariant}40`,
      borderRadius: 16, padding: 32, maxWidth: 480, width: '100%',
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.primary, marginBottom: 4 }}>Share Your Experience</h3>
      <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginBottom: 24 }}>We'd love to hear your feedback about PawLens</p>

      {success && (
        <div style={{ padding: 12, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
          ✓ Thank you for your feedback!
        </div>
      )}
      {error && (
        <div style={{ padding: 12, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>Role <span style={{ color: C.outlineVariant }}>(optional)</span></label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Dog Owner" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>Rating *</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setStars(s)}
                onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, transition: 'transform 0.15s', transform: (hoveredStar >= s || stars >= s) ? 'scale(1.15)' : 'scale(1)' }}>
                <Star size={24} style={{ color: (hoveredStar >= s || stars >= s) ? '#f59e0b' : C.outlineVariant, fill: (hoveredStar >= s || stars >= s) ? '#f59e0b' : 'none', transition: 'all 0.15s' }} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 6 }}>Message *</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about your experience..."
            rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: 12, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: C.primary, color: C.onPrimary, borderRadius: 12, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1, boxShadow: '0 2px 8px rgba(39,19,16,0.25)', fontFamily: 'inherit', transition: 'all 0.2s',
        }}>
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

function FeedbackSection({ onSubmitted }) {
  return (
    <section style={{ padding: '80px 0', background: C.surface }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 600, marginBottom: 32 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.secondary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Leave Feedback</p>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em', margin: 0 }}>Tell Us What You Think</h2>
            <p style={{ fontSize: 15, color: C.onSurfaceVariant, marginTop: 12 }}>Your feedback helps us improve PawLens for everyone.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <FeedbackForm onSubmitted={onSubmitted} />
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════ */
function CTASection() {
  return (
    <section style={{ padding: '80px 0', background: C.surfaceContainerLow }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <Reveal>
          <div style={{
            borderRadius: 24, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
            padding: 'clamp(40px, 6vw, 60px) clamp(24px, 4vw, 40px)', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em', position: 'relative' }}>
              Ready to Protect Your Pet?
            </h2>
            <p style={{ fontSize: 16, color: C.primaryFixedDim, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px auto', lineHeight: 1.6, position: 'relative' }}>
              Join pet owners who trust PawLens for early detection and peace of mind.
            </p>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
              background: '#fff', color: C.primary, borderRadius: 12, fontWeight: 600, fontSize: 16,
              textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', position: 'relative', transition: 'transform 0.2s',
            }}>
              Get Started Free →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ padding: '24px 0', borderTop: `1px solid ${C.outlineVariant}30`, background: C.surfaceContainerHigh }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg style={{ width: 14, height: 14, color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, color: C.primary }}>PawLens</span>
        </div>
        <p style={{ fontSize: 13, color: C.onSurfaceVariant }}>© 2026 PawLens. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   LANDING PAGE — ROOT
   ═══════════════════════════════════════════════ */
export default function LandingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{
      minHeight: '100vh', fontFamily: "'Hanken Grotesk', sans-serif",
      background: C.surface, color: C.onSurface,
      WebkitFontSmoothing: 'antialiased',
    }}>
      <Navbar />

      <main style={{ marginTop: 64 }}>
        {/* bg: surface (#fbf9f4) */}
        <HeroSection />

        {/* bg: surfaceContainer (#f0eee9) */}
        <StatsBand />

        {/* bg: surfaceContainerLow (#f5f3ee) */}
        <Features />

        {/* bg: surface (#fbf9f4) */}
        <HowItWorks />

        {/* bg: surfaceContainerLow (#f5f3ee) */}
        <Testimonials refreshKey={refreshKey} />

        {/* bg: surface (#fbf9f4) */}
        <FeedbackSection onSubmitted={() => setRefreshKey(k => k + 1)} />

        {/* bg: surfaceContainerLow (#f5f3ee) */}
        <CTASection />
      </main>

      {/* bg: surfaceContainerHigh (#eae8e3) */}
      <Footer />
    </div>
  );
}

import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, Zap, BarChart3, Upload, ArrowRight, Star, 
  ChevronRight, Dog, Microscope, Heart, Clock, Menu, X 
} from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <Dog className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-surface-200 bg-clip-text text-transparent">
              PawLens
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-surface-200 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-surface-200 hover:text-white transition-colors text-sm font-medium">How It Works</a>
            <a href="#testimonials" className="text-surface-200 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-surface-200 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu btn */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block text-surface-200 hover:text-white py-2">Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-surface-200 hover:text-white py-2">How It Works</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block text-surface-200 hover:text-white py-2">Testimonials</a>
            <div className="pt-3 border-t border-white/10 space-y-2">
              {user ? (
                <Link to="/dashboard" className="block w-full text-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="block text-center text-surface-200 hover:text-white py-2">Sign In</Link>
                  <Link to="/register" className="block w-full text-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const features = [
  {
    icon: <Microscope className="w-6 h-6" />,
    title: 'AI-Powered Diagnosis',
    description: 'Advanced Vision Transformer model trained on thousands of canine skin disease images for accurate identification.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Results',
    description: 'Get disease predictions and detailed analysis in seconds. Just upload a photo and let our AI do the rest.',
    color: 'from-amber-400 to-amber-500',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Treatment Guidance',
    description: 'Receive comprehensive treatment recommendations, symptom details, and severity assessments for each diagnosis.',
    color: 'from-rose-400 to-rose-500',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Track History',
    description: 'Keep a complete record of all diagnoses. Monitor your pet\'s skin health over time with detailed analytics.',
    color: 'from-emerald-400 to-emerald-500',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure & Private',
    description: 'Your pet\'s data is encrypted and protected. We follow industry-standard security practices.',
    color: 'from-accent-400 to-accent-500',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '24/7 Availability',
    description: 'Access PawLens anytime, anywhere. No appointments needed — get instant peace of mind for your pet.',
    color: 'from-primary-400 to-accent-400',
  },
];

const steps = [
  { step: '01', title: 'Upload Photo', description: 'Take a clear photo of the affected skin area on your dog and upload it to PawLens.' },
  { step: '02', title: 'AI Analysis', description: 'Our Vision Transformer model analyzes the image and identifies potential skin conditions.' },
  { step: '03', title: 'Get Results', description: 'Receive a detailed diagnosis with disease name, symptoms, treatment options, and severity.' },
  { step: '04', title: 'Take Action', description: 'Follow the treatment guidance and consult your vet with the diagnosis report.' },
];

const testimonials = [
  { name: 'Dr. Sarah Mitchell', role: 'Veterinarian', text: 'PawLens has been an invaluable tool for early screening. The AI accuracy is impressive and helps pet owners identify issues before they become serious.', rating: 5 },
  { name: 'James Rodriguez', role: 'Dog Owner', text: 'I noticed a weird patch on my Golden Retriever and PawLens identified it as a fungal infection. Took him to the vet and the diagnosis was confirmed!', rating: 5 },
  { name: 'Emily Chen', role: 'Pet Groomer', text: 'I recommend PawLens to all my clients. It\'s quick, accurate, and gives detailed treatment guidance. A game-changer for pet care.', rating: 5 },
];

const diseases = ['Bacterial Dermatosis', 'Fungal Infections', 'Allergic Dermatosis', 'Parasitic Disease', 'Healthy Skin'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary-600/20 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-accent-600/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-br from-primary-600/5 to-accent-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 md:mb-8 text-xs md:text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-surface-200">Powered by Vision Transformer AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
                Protect Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Dog's Skin Health
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-surface-200 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
              Upload a photo of your dog's skin condition and get an instant AI-powered diagnosis 
              with treatment recommendations. Fast, accurate, and always available.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 glass rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 text-center"
              >
                See How It Works
              </a>
            </div>

            {/* Disease tags */}
            <div className="mt-10 md:mt-16 flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <span className="text-xs text-surface-200/60 mr-1 md:mr-2">Detects:</span>
              {diseases.map((d) => (
                <span key={d} className="px-3 py-1.5 rounded-full glass text-xs text-surface-200 hover:text-white hover:bg-white/10 transition-all cursor-default">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary-400 font-semibold text-sm tracking-wider uppercase">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 md:mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"> Pet Skin Care</span>
            </h2>
            <p className="text-surface-200 max-w-2xl mx-auto text-base md:text-lg">
              Advanced AI technology meets compassionate pet care. PawLens gives you the tools to keep your furry friend healthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 md:p-8 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:border-white/20 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-surface-200 text-sm md:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary-400 font-semibold text-sm tracking-wider uppercase">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 md:mb-6">
              Simple as
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"> 1-2-3-4</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="p-6 md:p-8 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 text-center">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-primary-500/20 to-accent-500/20 bg-clip-text text-transparent mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                  <p className="text-surface-200 text-sm leading-relaxed">{s.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-primary-500/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary-400 font-semibold text-sm tracking-wider uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              Trusted by
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"> Pet Lovers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-200 text-sm md:text-base leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-surface-200 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 md:p-16 rounded-3xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-accent-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Ready to Protect Your Pet?</h2>
              <p className="text-surface-200 text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto">
                Join thousands of pet owners who trust PawLens for early detection and peace of mind.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 md:px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Dog className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">PawLens</span>
            </div>
            <p className="text-surface-200 text-sm">© 2026 PawLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

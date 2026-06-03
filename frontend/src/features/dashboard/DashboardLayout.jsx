import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Upload, History, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const C = {
  surface: '#fbf9f4', surfaceContainerLow: '#f5f3ee', surfaceContainer: '#f0eee9',
  surfaceContainerHigh: '#eae8e3', onSurface: '#1b1c19', onSurfaceVariant: '#504442',
  outlineVariant: '#d3c3c0', primary: '#271310', onPrimary: '#ffffff',
  primaryContainer: '#3e2723', secondary: '#895200',
};

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'New Scan', icon: Upload, path: '/dashboard/scan' },
  { label: 'History', icon: History, path: '/dashboard/history' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/'); };
  const isActive = (path) => path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.surfaceContainerLow, fontFamily: "'Hanken Grotesk', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 40 }} className="lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={sidebarOpen ? '' : 'hidden lg:flex'} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 260, background: C.surface, borderRight: `1px solid ${C.outlineVariant}40`, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(39,19,16,0.15)' }}>
              <svg style={{ width: 20, height: 20, color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" /><circle cx="7" cy="6" r="1.5" fill="currentColor" /><circle cx="17" cy="6" r="1.5" fill="currentColor" />
                <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: C.primary }}>PawLens</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ background: 'none', border: 'none', color: C.onSurfaceVariant, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 500, textDecoration: 'none', marginBottom: 2, transition: 'all 0.15s',
                background: active ? `${C.secondary}12` : 'transparent', color: active ? C.primary : C.onSurfaceVariant,
              }}>
                <item.icon size={18} style={{ color: active ? C.secondary : C.onSurfaceVariant }} />
                {item.label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', color: C.secondary }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 12, borderTop: `1px solid ${C.outlineVariant}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: C.surfaceContainerLow, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.secondary}, ${C.primaryContainer})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: C.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.username}</p>
              <p style={{ fontSize: 11, color: C.onSurfaceVariant, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 500, color: C.onSurfaceVariant, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
          }}
            onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; e.target.style.color = '#dc2626'; }}
            onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.color = C.onSurfaceVariant; }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 260, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="max-lg:!ml-0">
        <header style={{ position: 'sticky', top: 0, zIndex: 30, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: `${C.surface}dd`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.outlineVariant}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ background: 'none', border: 'none', color: C.onSurfaceVariant, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
              <Menu size={20} />
            </button>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 600, color: C.primary, margin: 0 }}>
              {navItems.find(n => isActive(n.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <Link to="/dashboard/scan" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '8px 16px',
            background: C.primary, color: C.onPrimary, borderRadius: 10, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(39,19,16,0.2)',
          }}>
            <Upload size={14} /> New Scan
          </Link>
        </header>

        <div style={{ flex: 1, padding: 32 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Upload, History, LogOut, Menu, X, ChevronRight } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 40 }} className="lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={sidebarOpen ? '' : 'hidden lg:flex'} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '260px', background: '#fff', borderRight: '1px solid #e2e8f0', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(99,102,241,0.15)' }}>
              <svg style={{ width: '20px', height: '20px', color: '#fff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" /><circle cx="7" cy="6" r="1.5" fill="currentColor" /><circle cx="17" cy="6" r="1.5" fill="currentColor" />
                <path d="M12 13c-4 0-7 2-7 5a2 2 0 002 2h10a2 2 0 002-2c0-3-3-5-7-5z" />
              </svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>PawLens</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s',
                background: active ? '#eef2ff' : 'transparent', color: active ? '#4338ca' : '#64748b',
              }}>
                <item.icon size={18} style={{ color: active ? '#4f46e5' : '#94a3b8' }} />
                {item.label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#818cf8' }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.username}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; e.target.style.color = '#dc2626'; }}
            onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.color = '#64748b'; }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="max-lg:!ml-0">
        <header style={{ position: 'sticky', top: 0, zIndex: 30, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px', marginLeft: '-6px' }}>
              <Menu size={20} />
            </button>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              {navItems.find(n => isActive(n.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <Link to="/dashboard/scan" className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px', gap: '6px' }}>
            <Upload size={14} /> New Scan
          </Link>
        </header>

        <div style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

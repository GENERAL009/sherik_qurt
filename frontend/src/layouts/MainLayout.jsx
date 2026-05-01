import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ScanLine, LayoutDashboard, X, CheckCircle2, AlertCircle, Moon, Sun } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleNotify = (event) => {
      setToast(event.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('app-notify', handleNotify);
    return () => window.removeEventListener('app-notify', handleNotify);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Skaner', path: '/scan', icon: ScanLine },
    { name: 'Chiqimlar', path: '/withdrawals', icon: Package },
  ];

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: toast.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
      )}

      <header className="glass-panel" style={{ 
        position: 'sticky', top: 0, zIndex: 10, 
        borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderRadius: 0,
        padding: '0'
      }}>

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--nav-height)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <Package size={24} />
              <span className="brand-text" style={{ fontSize: '1.25rem' }}>Qurt Inventory</span>
            </Link>
            <nav style={{ display: 'flex', gap: '8px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                    style={{ border: isActive ? 'none' : '' }}
                  >
                    <Icon size={18} />
                    <span className="nav-text">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <button 
                onClick={toggleTheme} 
                className="btn btn-outline" 
                style={{ padding: '8px', borderRadius: '50%' }}
                title={theme === 'light' ? 'Tungi rejim' : 'Kungi rejim'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="nav-text" style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.username}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.is_admin ? 'Admin' : 'Ishchi'}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                  Chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container" style={{ flex: 1, padding: '32px 24px', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

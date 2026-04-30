import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, ScanLine, LayoutDashboard, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  useEffect(() => {
    const handleNotify = (event) => {
      setToast(event.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('app-notify', handleNotify);
    return () => window.removeEventListener('app-notify', handleNotify);
  }, []);

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
      </header>
      <main className="container" style={{ flex: 1, padding: '32px 24px', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, ScanLine, LayoutDashboard } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Skaner', path: '/scan', icon: ScanLine },
  ];

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

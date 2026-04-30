import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, Search, Plus, Filter, Tag, CalendarClock, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ today_out_quantity: 0, month_out_sum: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hamma');

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, statsRes] = await Promise.all([
        api.get('products/'),
        api.get('stats/')
      ]);
      setProducts(prodRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique types for filtering
  const productTypes = [...new Set(products.map(p => p.type).filter(type => type && type.trim() !== ''))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchesFilter = activeFilter === 'Hamma' ? true : 
                          p.type === activeFilter;
    return matchesSearch && matchesFilter;
  });


  return (
    <div>
      <div className="flex-header">
        <h1 className="heading-lg" style={{ margin: 0 }}>Dashboard</h1>
        <div className="flex-actions">
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-base" 
              placeholder="Qidiruv (nomi yoki shtrix-kod)..." 
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/product/new" className="btn btn-primary" style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
            <Plus size={18} /> Yangi qo'shish
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--success-color)', padding: '12px', borderRadius: '50%' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-subtle" style={{ fontSize: '0.85rem' }}>Bugun chiqim bo'ldi</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.today_out_quantity} dona</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: 'var(--danger-color)', padding: '12px', borderRadius: '50%' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-subtle" style={{ fontSize: '0.85rem' }}>Oylik savdo (chiqim)</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{Number(stats.month_out_sum).toLocaleString('uz-UZ')} UZS</p>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '16px', marginBottom: '16px', WebkitOverflowScrolling: 'touch' }}>
        
        {/* All Products Filter */}
        <div 
          onClick={() => setActiveFilter('Hamma')}
          className="glass-panel card-hover" 
          style={{ minWidth: '140px', padding: '16px', cursor: 'pointer', border: activeFilter === 'Hamma' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: activeFilter === 'Hamma' ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
            <Package size={20} />
            <span style={{ fontWeight: 600 }}>Hamma</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{products.length}</div>
          <div className="text-subtle" style={{ fontSize: '0.8rem' }}>dona tovar</div>
        </div>

        {/* Dynamic Type Filters */}
        {productTypes.map(type => {
          const count = products.filter(p => p.type === type).length;
          const isActive = activeFilter === type;
          return (
            <div 
              key={type}
              onClick={() => setActiveFilter(type)}
              className="glass-panel card-hover" 
              style={{ minWidth: '140px', padding: '16px', cursor: 'pointer', border: isActive ? '2px solid var(--accent-color)' : '1px solid var(--border-color)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                <Tag size={20} />
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{type}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{count}</div>
              <div className="text-subtle" style={{ fontSize: '0.8rem' }}>dona tovar</div>
            </div>
          );
        })}

      </div>


      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-secondary)' }}>Yuklanmoqda...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '64px', textAlign: 'center' }}>
          <Package size={48} style={{ color: 'var(--border-color)', marginBottom: '16px' }} opacity={0.5} />
          <h3 className="heading-md">Mahsulotlar topilmadi</h3>
          <p className="text-subtle">Hozircha omborda mahsulot yo'q yoki qidiruvga mos kelmadi.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="glass-panel card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>{product.name}</h3>
                  <span style={{ 
                    background: product.quantity > 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)', 
                    color: product.quantity > 0 ? 'var(--success-color)' : 'var(--danger-color)', 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 
                  }}>
                    {product.quantity} dona
                  </span>
                </div>
                <p className="text-subtle" style={{ marginTop: '4px' }}>{product.type} • {product.weight}</p>
              </div>

              
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Narxi</p>
                  <p style={{ fontWeight: 600 }}>{Number(product.price).toLocaleString('uz-UZ')} UZS</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Shtrix-kod</p>
                  <p style={{ fontFamily: 'monospace' }}>{product.barcode}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

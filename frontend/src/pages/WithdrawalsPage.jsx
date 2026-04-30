import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Search, DollarSign, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawalsPage() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await api.get('withdrawals/');
      // Response format: { results: [...], total_sum: 0 }
      setWithdrawals(response.data.results);
      setTotalSum(response.data.total_sum);
    } catch (error) {
      console.error('Error fetching withdrawals', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('uz-UZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredWithdrawals = withdrawals.filter(w => 
    (w.comment && w.comment.toLowerCase().includes(search.toLowerCase())) ||
    (w.product_name && w.product_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="heading-lg" style={{ margin: 0 }}>Chiqimlar Tarixi</h1>
        </div>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-base" 
            placeholder="Izoh yoki mahsulot nomi bo'yicha..." 
            style={{ paddingLeft: '38px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Box */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        marginBottom: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 149, 0, 0.1) 100%)',
        border: '1px solid rgba(255, 59, 48, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--danger-color)', color: 'white', padding: '12px', borderRadius: '12px' }}>
            <DollarSign size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Jami Chiqim Summasi</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{Number(totalSum).toLocaleString('uz-UZ')} <span style={{ fontSize: '1rem', fontWeight: 600 }}>UZS</span></h2>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tranzaksiyalar soni</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{withdrawals.length} ta</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px' }}>Yuklanmoqda...</div>
      ) : filteredWithdrawals.length === 0 ? (
        <div className="glass-panel" style={{ padding: '64px', textAlign: 'center' }}>
          <Package size={48} style={{ color: 'var(--border-color)', marginBottom: '16px' }} opacity={0.5} />
          <p className="text-subtle">Chiqimlar topilmadi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredWithdrawals.map((item) => (
            <div key={item.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--danger-color)' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px' }}>
                   <Package size={24} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{item.product_name || `Mahsulot #${item.product}`}</h4>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {formatDate(item.created_at)}</span>
                    {item.comment && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-color)', fontWeight: 500 }}><MessageSquare size={14} /> {item.comment}</span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger-color)' }}>
                  -{ (item.quantity * (item.price_at_transaction || 0)).toLocaleString('uz-UZ') } UZS
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {item.quantity} dona × {Number(item.price_at_transaction || 0).toLocaleString('uz-UZ')} UZS
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

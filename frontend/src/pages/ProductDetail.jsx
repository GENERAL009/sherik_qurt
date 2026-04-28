import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Trash2, Calendar, Tag, Scale, Package } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    type: '',
    barcode: '',
    production_date: '',
    expiry_date: '',
    quantity: 0,
    weight: '',
    price: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (id !== 'new') {
      fetchProduct();
    } else {
      setLoading(false);
    }
    
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, navigate]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product', error);
      setMessage({ type: 'error', text: 'Mahsulotni yuklashda xatolik yuz berdi' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      if (id === 'new') {
        const response = await api.post('products/', product);
        navigate(`/product/${response.data.id}`);
        setMessage({ type: 'success', text: "Yangi mahsulot yaratildi!" });
      } else {
        await api.put(`products/${id}/`, product);
        setMessage({ type: 'success', text: "Ma'lumotlar saqlandi!" });
      }
    } catch (error) {
      console.error('Error saving product', error);
      setMessage({ type: 'error', text: 'Saqlashda xatolik yuz berdi' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      try {
        await api.delete(`products/${id}/`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting product', error);
        setMessage({ type: 'error', text: "O'chirishda xatolik" });
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '64px' }}>Yuklanmoqda...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button className="btn btn-outline" onClick={() => navigate('/')} style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading-lg" style={{ margin: 0 }}>
          {id === 'new' ? 'Yangi Mahsulot' : 'Mahsulot ma\'lumotlari'}
        </h1>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="grid-cols-2-gap">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Nomi <span style={{ color: 'var(--danger-color)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Package size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  required
                  type="text" 
                  name="name"
                  className="input-base" 
                  style={{ paddingLeft: '38px' }}
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Masalan: Rayhonli qurt"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Barcode <span style={{ color: 'var(--danger-color)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  required
                  type="text" 
                  name="barcode"
                  className="input-base" 
                  value={product.barcode}
                  onChange={handleChange}
                  placeholder="Shtrix kod"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Turi
              </label>
              <div style={{ position: 'relative' }}>
                <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  name="type"
                  className="input-base" 
                  style={{ paddingLeft: '38px' }}
                  value={product.type}
                  onChange={handleChange}
                  placeholder="Masalan: katta, kichik"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Og'irligi (g)
              </label>
              <div style={{ position: 'relative' }}>
                <Scale size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  name="weight"
                  className="input-base" 
                  style={{ paddingLeft: '38px' }}
                  value={product.weight}
                  onChange={handleChange}
                  placeholder="50g"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Narxi (UZS)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>UZS</span>
                <input 
                  type="number" 
                  name="price"
                  step="0.01"
                  className="input-base" 
                  style={{ paddingLeft: '44px' }}
                  value={product.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Sana (Dan - Gacha)
              </label>
              <div className="flex-gap-2">
                <div style={{ position: 'relative', flex: 1 }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="date" 
                    name="production_date"
                    className="input-base" 
                    title="Ishlab chiqarilgan sana (Dan)"
                    style={{ paddingLeft: '34px', fontSize: '0.9rem' }}
                    value={product.production_date || ''}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="date" 
                    name="expiry_date"
                    className="input-base" 
                    title="Yaroqlilik muddati (Gacha)"
                    style={{ paddingLeft: '34px', fontSize: '0.9rem' }}
                    value={product.expiry_date || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Soni (Mavjud miqdor: {product.quantity})
              </label>
              <p className="text-subtle" style={{ fontSize: '0.85rem' }}>
                Miqdorni o'zgartirish uchun skaner orqali "Kirim" / "Chiqim" amalini bajaring.
              </p>
            </div>
          </div>

          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              backgroundColor: message.type === 'success' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
              color: message.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            {id !== 'new' ? (
              <button type="button" className="btn" style={{ color: 'var(--danger-color)' }} onClick={handleDelete}>
                <Trash2 size={18} /> O'chirish
              </button>
            ) : <div></div>}
            
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

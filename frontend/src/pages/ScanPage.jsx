import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import api from '../services/api';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScanPage() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  
  const scannerRef = useRef(null);

  useEffect(() => {
    // Keyboard shortcuts
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    // Initialize Scanner on mount
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );
    
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        setBarcode(decodedText);
        // Play beep sound here if needed
      },
      (error) => {
        // ignore errors to avoid noise
      }
    );

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [navigate]);

  const handleTransaction = async (type) => {
    if (!barcode) {
      setStatus({ type: 'error', message: 'Iltimos shtrix-kodni kiriting yoki skanerlang' });
      return;
    }
    
    setLoading(true);
    setStatus(null);
    
    try {
      const endpoint = type === 'IN' ? 'scan/in/' : 'scan/out/';
      const response = await api.post(endpoint, {
        barcode,
        quantity: parseInt(quantity),
        comment: type === 'OUT' ? comment : ''
      });
      
      const msg = `${response.data.message}. Qoldiq: ${response.data.product.quantity} dona`;
      window.dispatchEvent(new CustomEvent('app-notify', { 
        detail: { message: msg, type: 'success' } 
      }));

      setStatus({ type: 'success', message: msg });
      setBarcode('');
      setQuantity(1);
      setComment('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Xatolik yuz berdi';
      window.dispatchEvent(new CustomEvent('app-notify', { 
        detail: { message: errorMsg, type: 'error' } 
      }));
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="heading-lg">Kirim / Chiqim</h1>
        <p className="text-subtle">Kameraga shtrix-kodni tuting yoki qo'lda kiriting</p>
      </div>

      <div className="grid-2">
        {/* Scanner Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div id="reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Kamera ishlamasa qo'lda kiriting:</span>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Shtrix-kod..." 
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTransaction('IN')}
              style={{ marginTop: '8px', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 'bold' }}
            />
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Miqdor (dona)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '8px 16px', fontSize: '1.2rem' }}
              >
                -
              </button>
              <input 
                type="number" 
                className="input-base" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                onKeyDown={(e) => e.key === 'Enter' && handleTransaction('IN')}
                min="1"
                style={{ textAlign: 'center', fontSize: '1.2rem' }}
              />
              <button 
                className="btn btn-outline" 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '8px 16px', fontSize: '1.2rem' }}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Izoh (Faqat Chiqim uchun)</label>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Masalan: Abdulazizga" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            />
          </div>


          <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>

            <button 
              className="btn" 
              style={{ flex: 1, backgroundColor: 'var(--success-color)', color: 'white', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}
              onClick={() => handleTransaction('IN')}
              disabled={loading}
            >
              <ArrowDownToLine size={24} />
              <span style={{ fontSize: '1.1rem' }}>KIRIM</span>
            </button>
            <button 
              className="btn" 
              style={{ flex: 1, backgroundColor: 'var(--danger-color)', color: 'white', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}
              onClick={() => handleTransaction('OUT')}
              disabled={loading}
            >
              <ArrowUpFromLine size={24} />
              <span style={{ fontSize: '1.1rem' }}>CHIQIM</span>
            </button>
          </div>

          {status && (
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              borderRadius: '8px', 
              backgroundColor: status.type === 'success' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
              color: status.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span style={{ fontWeight: 500 }}>{status.message}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS overwrite for html5-qrcode standard look to match our minimalist theme */}
      <style dangerouslySetInnerHTML={{__html: `
        #reader { 
          border: none !important; 
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        #reader img {
          display: none !important; /* Hides default placeholder image */
        }
        #reader__dashboard_section_csr span {
          color: var(--text-primary) !important;
          font-family: var(--font-sans) !important;
          font-weight: 500;
        }
        #reader__dashboard_section_csr button {
          background-color: var(--accent-color) !important;
          color: var(--bg-color) !important;
          border: none !important;
          border-radius: var(--radius-sm) !important;
          padding: 10px 20px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          margin-top: 10px !important;
          font-family: inherit !important;
          transition: transform 0.2s;
        }
        #reader__dashboard_section_csr button:active {
          transform: scale(0.98);
        }
        #reader__camera_selection {
          width: 100% !important;
          padding: 8px !important;
          margin-bottom: 12px !important;
          border: 1px solid var(--border-color) !important;
          border-radius: var(--radius-sm) !important;
          background: transparent !important;
          color: var(--text-primary) !important;
        }
        #reader__dashboard_section_swaplink { display: none !important; }
        #reader a { color: var(--text-primary) !important; text-decoration: underline; display: none !important; }
      `}} />
    </div>
  );
}

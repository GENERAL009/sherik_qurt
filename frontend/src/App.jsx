import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import ProductDetail from './pages/ProductDetail';
import WithdrawalsPage from './pages/WithdrawalsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="withdrawals" element={<WithdrawalsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;

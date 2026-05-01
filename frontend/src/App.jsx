import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import ProductDetail from './pages/ProductDetail';
import WithdrawalsPage from './pages/WithdrawalsPage';
import LoginPage from './pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
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

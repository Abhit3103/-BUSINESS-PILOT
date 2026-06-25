import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { AdminLayout } from '@/layouts/AdminLayout';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import ProductForm from '@/pages/ProductForm';
import Orders from '@/pages/Orders';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Customers from '@/pages/Customers';
import Inventory from '@/pages/Inventory';
import Billing from '@/pages/Billing';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="billing" element={<Billing />} />
              <Route path="reports" element={<Reports />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;

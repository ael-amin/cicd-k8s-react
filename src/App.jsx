import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Demande from './pages/Demande';
import Admin from './pages/Admin';
import Stock from './pages/Stock';
import History from './pages/History';
import AddProduct from './pages/AddProduct';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import EmailVerification from './pages/EmailVerification';
import MailSent from './pages/MailSent';
import Profile from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify/:token" element={<EmailVerification />} />
            <Route path="/mail-sent" element={<MailSent />} />

            
            {/* Regular user routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
              </Route>
            </Route>

            {/* User-only routes */}
            <Route element={<ProtectedRoute requireUser />}>
              <Route element={<DashboardLayout />}>
                <Route path="/demande" element={<Demande />} />
              </Route>
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/add-product" element={<AddProduct />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
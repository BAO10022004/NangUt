import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Auth } from './Auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Pages/LoginPage';
import AccountPage from './Pages/AccountPage';
import TypeTransactionPage from './Pages/TypeTransactionMPage';
import TransactionManagement from './Pages/TransactionPage';
import './style.css';
import Dashboard from './Pages/Dashboard';
export const auth = new Auth();

///////////=================== Protected Route Component======================================== //////////
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  
  if (auth.getUsername()  === null) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter basename="/NangUt">
      <Routes>
         {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
                <AccountPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/type-transaction"
          element={
            <ProtectedRoute>
                <TypeTransactionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
                <TransactionManagement />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
    </React.StrictMode>
  );
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. Import TanStack
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional: for debugging

// Pages
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/Appointments'; 
import DocumentCenter from './pages/DocumentCenter';
import VerifyClient from './pages/VerifyClient';
import ProfileCard from './pages/ProfileCard';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// 2. Create a Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents auto-refetch when switching tabs (optional)
      retry: 1, // Number of retries on failure
    },
  },
});

export default function App() {
  return (
    // 3. Wrap everything in the Provider
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Only accessible if logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <DocumentCenter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/verify" 
            element={
              <ProtectedRoute>
                <VerifyClient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileCard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      
      {/* 4. Devtools (Visible only in development mode) */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
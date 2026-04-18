import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

import Layout from '../components/Layout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Prediction from '../pages/Prediction';
import Profile from '../pages/Profile';

const PublicLayoutRoute = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading">Loading...</div>;

  return user ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : <Navigate to="/login" state={{ from: location }} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PublicLayoutRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<Prediction />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/userContext";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard";
import Resource from "../pages/Resource";

// Bloqueia telas privadas até que uma sessão autenticada esteja disponível.
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="feedback">Carregando sessão...</p>;
  return user ? (
    <Layout />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

// Declara todas as rotas da interface.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Resource name="products" />} />
        <Route path="/categories" element={<Resource name="categories" />} />
        <Route path="/suppliers" element={<Resource name="suppliers" />} />
        <Route path="/customers" element={<Resource name="customers" />} />
        <Route path="/inventory" element={<Resource name="inventory" />} />
        <Route path="/movements" element={<Resource name="movements" />} />
        <Route path="/sales" element={<Resource name="sales" />} />
        <Route path="/alerts" element={<Resource name="alerts" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

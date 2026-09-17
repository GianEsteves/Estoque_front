import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/userContext";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard";
import Resource from "../pages/Resource";
import Management from "../pages/Management";
import InventoryOperations from "../pages/Operations/Inventory";
import SalesOperations from "../pages/Operations/Sales";
import { Permissions } from "../pages/Administration";
import PasswordReset from "../pages/Auth/PasswordReset";
import Account from "../pages/Account";
import SalesReport from "../pages/Reports";

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
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Management name="products" />} />
        <Route path="/categories" element={<Management name="categories" />} />
        <Route path="/suppliers" element={<Management name="suppliers" />} />
        <Route path="/customers" element={<Management name="customers" />} />
        <Route path="/inventory" element={<InventoryOperations />} />
        <Route path="/balances" element={<Resource name="inventory" />} />
        <Route path="/movements" element={<Resource name="movements" />} />
        <Route path="/sales" element={<Resource name="sales" />} />
        <Route path="/sales/new" element={<SalesOperations />} />
        <Route path="/sales/report" element={<SalesReport />} />
        <Route path="/alerts" element={<Resource name="alerts" />} />
        <Route path="/users" element={<Management name="users" />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/audit" element={<Resource name="audit" />} />
        <Route path="/account" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

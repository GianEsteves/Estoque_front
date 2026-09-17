import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/userContext";
import "./stylesLayout.css";

const links = [{ to: "/", label: "Visão geral" }, { to: "/products", label: "Produtos" }, { to: "/categories", label: "Categorias" }, { to: "/suppliers", label: "Fornecedores" }, { to: "/customers", label: "Clientes" }, { to: "/inventory", label: "Estoque" }, { to: "/movements", label: "Movimentações" }, { to: "/sales", label: "Vendas" }, { to: "/alerts", label: "Alertas" }];

// Exibe a navegação principal e o conteúdo protegido da aplicação.
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Encerra a sessão e redireciona para a tela de acesso.
  async function handleLogout() { try { await logout(); } finally { navigate("/login"); } }
  return <div className="app-shell"><aside><div className="brand">ESTOQUE<span>Gestão simples</span></div><nav>{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/"}>{link.label}</NavLink>)}</nav><div className="profile"><strong>{user?.name}</strong><small>{user?.role}</small><button onClick={handleLogout}>Sair</button></div></aside><main><Outlet /></main></div>;
}

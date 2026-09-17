import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/userContext";
import "./stylesLayout.css";

const links = [
  { to: "/", label: "Visão geral" },
  { to: "/products", label: "Produtos" },
  { to: "/categories", label: "Categorias" },
  { to: "/suppliers", label: "Fornecedores" },
  { to: "/customers", label: "Clientes" },
  { to: "/inventory", label: "Estoque" },
  { to: "/balances", label: "Saldos" },
  { to: "/movements", label: "Movimentações" },
  { to: "/sales", label: "Vendas" },
  { to: "/sales/new", label: "Nova venda" },
  { to: "/sales/report", label: "Relatório de vendas" },
  { to: "/alerts", label: "Alertas" },
  { to: "/users", label: "Usuários" },
  { to: "/permissions", label: "Permissões" },
  { to: "/audit", label: "Auditoria" },
  { to: "/account", label: "Minha conta" },
];

// Exibe a navegação principal e o conteúdo protegido da aplicação.
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Encerra a sessão e redireciona para a tela de acesso.
  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  }
  return (
    <div className="app-shell">
      <aside>
        <div className="brand">
          ESTOQUE<span>Gestão simples</span>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="profile">
          <strong>{user?.name}</strong>
          <small>{user?.role}</small>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

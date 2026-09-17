import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BtnGreen from "../../../components/BtnGreen";
import { api } from "../../../services/api";
import { useAuth } from "../../../hooks/userContext";
import "./stylesLogin.css";

// Renderiza o acesso por e-mail e senha.
export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  const { setUser } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  // Envia as credenciais, carrega a sessão e entra na aplicação.
  async function handleSubmit(event) { event.preventDefault(); setPending(true); setError(""); try { await api("/auth/login", { method: "POST", body: { email, password } }); const { user } = await api("/auth/me"); setUser(user); navigate(location.state?.from?.pathname || "/", { replace: true }); } catch (requestError) { setError(requestError.message); } finally { setPending(false); } }
  return <section className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><p className="eyebrow">GESTÃO DE ESTOQUE</p><h1>Boas-vindas</h1><p>Acesse sua conta para continuar.</p>{error && <div className="form-error">{error}</div>}<label>E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" /></label><label>Senha<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete="current-password" /></label><BtnGreen type="submit" disabled={pending}>{pending ? "Entrando..." : "Entrar"}</BtnGreen><Link to="/register">Criar uma conta</Link></form></section>;
}

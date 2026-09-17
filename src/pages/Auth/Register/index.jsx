import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BtnGreen from "../../../components/BtnGreen";
import { api } from "../../../services/api";
import "../Login/stylesLogin.css";

// Permite registrar uma nova conta na API.
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" }); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false); const navigate = useNavigate();
  // Atualiza um campo do formulário de cadastro.
  function handleChange(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  // Cria a conta e orienta a pessoa a verificar o e-mail.
  async function handleSubmit(event) { event.preventDefault(); setPending(true); setError(""); try { await api("/auth/register", { method: "POST", body: form }); setMessage("Conta criada. Verifique seu e-mail antes de entrar."); setTimeout(() => navigate("/login"), 1800); } catch (requestError) { setError(requestError.message); } finally { setPending(false); } }
  return <section className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><p className="eyebrow">GESTÃO DE ESTOQUE</p><h1>Crie sua conta</h1>{error && <div className="form-error">{error}</div>}{message && <div className="form-success">{message}</div>}<label>Nome<input name="name" value={form.name} onChange={handleChange} required /></label><label>E-mail<input name="email" type="email" value={form.email} onChange={handleChange} required /></label><label>Telefone<input name="phone" value={form.phone} onChange={handleChange} required /></label><label>Senha<input name="password" type="password" value={form.password} onChange={handleChange} required minLength="8" /></label><BtnGreen type="submit" disabled={pending}>{pending ? "Criando..." : "Criar conta"}</BtnGreen><Link to="/login">Voltar para o acesso</Link></form></section>;
}

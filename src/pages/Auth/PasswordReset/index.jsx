import { Link } from "react-router-dom";
import { useState } from "react";
import BtnGreen from "../../../components/BtnGreen";
import { api } from "../../../services/api";
import "../Login/stylesLogin.css";

// Solicita o e-mail de recuperação de senha sem revelar se a conta existe.
export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Envia a solicitação de recuperação para a API.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/auth/password-reset", {
        method: "POST",
        body: { email },
      });
      setMessage(
        data.message ||
          "Se existir uma conta, você receberá as instruções no e-mail.",
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">ACESSO</p>
        <h1>Recuperar senha</h1>
        <p>Informe seu e-mail para receber as instruções.</p>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <BtnGreen type="submit">Enviar instruções</BtnGreen>
        <Link to="/login">Voltar para o acesso</Link>
      </form>
    </section>
  );
}

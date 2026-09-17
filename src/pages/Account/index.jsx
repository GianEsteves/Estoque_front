import { useState } from "react";
import BtnGreen from "../../components/BtnGreen";
import { api } from "../../services/api";

// Permite à pessoa autenticada alterar a própria senha.
export default function Account() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Envia a alteração de senha e limpa os campos sensíveis.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/auth/change-password", {
        method: "POST",
        body: form,
      });
      setMessage(
        data.message || "Senha alterada. Entre novamente caso necessário.",
      );
      setForm({ currentPassword: "", newPassword: "" });
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">CONTA</p>
          <h1>Alterar senha</h1>
        </div>
      </header>
      <form className="management-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <label>
          Senha atual
          <input
            type="password"
            value={form.currentPassword}
            onChange={(event) =>
              setForm({ ...form, currentPassword: event.target.value })
            }
            required
          />
        </label>
        <label>
          Nova senha
          <input
            type="password"
            minLength="12"
            value={form.newPassword}
            onChange={(event) =>
              setForm({ ...form, newPassword: event.target.value })
            }
            required
          />
        </label>
        <BtnGreen type="submit">Atualizar senha</BtnGreen>
      </form>
    </section>
  );
}

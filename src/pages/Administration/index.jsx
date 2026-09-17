import { useEffect, useState } from "react";
import { api } from "../../services/api";

// Mostra a matriz de permissões configurada no backend.
export function Permissions() {
  const [roles, setRoles] = useState(null);
  const [error, setError] = useState("");
  // Carrega a matriz efetiva de permissões.
  useEffect(() => {
    api("/permissions")
      .then((data) => setRoles(data.roles))
      .catch((requestError) => setError(requestError.message));
  }, []);
  if (error) return <p className="feedback error">{error}</p>;
  if (!roles) return <p className="feedback">Carregando permissões...</p>;
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">ADMINISTRAÇÃO</p>
          <h1>Permissões</h1>
        </div>
      </header>
      <div className="resource-card">
        <table>
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Permissões</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(roles).map(([role, permissions]) => (
              <tr key={role}>
                <td>{role}</td>
                <td>{permissions.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

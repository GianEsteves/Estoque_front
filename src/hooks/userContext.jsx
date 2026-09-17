import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const UserContext = createContext(null);

// Disponibiliza a sessão atual e as ações de autenticação para toda a interface.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api("/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      async logout() {
        await api("/auth/logout", { method: "POST" });
        setUser(null);
      },
    }),
    [user, loading],
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Retorna o contexto da sessão atual.
export function useAuth() {
  return useContext(UserContext);
}

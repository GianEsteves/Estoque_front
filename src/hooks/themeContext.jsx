import { createContext, useContext } from "react";

export const ThemeContext = createContext({ mode: "light" });

// Retorna o tema visual compartilhado pela aplicação.
export function useTheme() {
  return useContext(ThemeContext);
}

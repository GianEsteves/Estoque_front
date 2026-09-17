const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6868";

// Lê um cookie pelo nome para enviar o token CSRF ao backend.
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];
}

// Centraliza as requisições, cookies e erros da API.
export async function api(path, options = {}) {
  const method = options.method || "GET";
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };
  if (!["GET", "HEAD"].includes(method))
    headers["X-CSRF-Token"] = decodeURIComponent(getCookie("csrf_token") || "");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(payload.message || "Não foi possível concluir a operação.");
  return payload;
}

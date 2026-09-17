import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./stylesResource.css";

const resourceConfig = {
  products: {
    title: "Produtos",
    endpoint: "/products",
    key: "products",
    columns: [
      ["name", "Nome"],
      ["sku", "SKU"],
      ["salePrice", "Preço de venda"],
      ["stockQuantity", "Saldo"],
    ],
  },
  categories: {
    title: "Categorias",
    endpoint: "/categories",
    key: "categories",
    columns: [
      ["name", "Nome"],
      ["description", "Descrição"],
      ["isActive", "Status"],
    ],
  },
  suppliers: {
    title: "Fornecedores",
    endpoint: "/suppliers",
    key: "suppliers",
    columns: [
      ["legalName", "Razão social"],
      ["document", "CPF/CNPJ"],
      ["phone", "Telefone"],
      ["isActive", "Status"],
    ],
  },
  customers: {
    title: "Clientes",
    endpoint: "/customers",
    key: "customers",
    columns: [
      ["name", "Nome"],
      ["document", "CPF/CNPJ"],
      ["email", "E-mail"],
      ["isActive", "Status"],
    ],
  },
  inventory: {
    title: "Saldo de estoque",
    endpoint: "/inventory/balances",
    key: "balances",
    columns: [
      ["name", "Produto"],
      ["sku", "SKU"],
      ["stockQuantity", "Saldo"],
      ["minimumStock", "Mínimo"],
      ["isLowStock", "Alerta"],
    ],
  },
  movements: {
    title: "Movimentações",
    endpoint: "/inventory/movements",
    key: "movements",
    columns: [
      ["product.name", "Produto"],
      ["type", "Tipo"],
      ["quantity", "Quantidade"],
      ["newStock", "Saldo final"],
      ["createdAt", "Data"],
    ],
  },
  sales: {
    title: "Vendas",
    endpoint: "/sales",
    key: "sales",
    columns: [
      ["id", "Código"],
      ["customer.name", "Cliente"],
      ["status", "Status"],
      ["paymentMethod", "Pagamento"],
      ["total", "Total"],
    ],
  },
  alerts: {
    title: "Alertas de estoque",
    endpoint: "/alerts/low-stock",
    key: "alerts",
    columns: [
      ["product.name", "Produto"],
      ["currentQuantity", "Saldo"],
      ["minimumQuantity", "Mínimo"],
      ["severity", "Criticidade"],
    ],
  },
};

// Obtém um valor de um objeto, inclusive em propriedades aninhadas.
function readValue(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

// Converte os valores mais comuns em uma representação legível.
function displayValue(value, key) {
  if (typeof value === "boolean") return value ? "Ativo" : "Inativo";
  if (key === "createdAt")
    return value ? new Date(value).toLocaleString("pt-BR") : "—";
  if (["salePrice", "total"].includes(key))
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));
  return value ?? "—";
}

// Lista uma funcionalidade administrativa com pesquisa e paginação.
export default function Resource({ name }) {
  const config = resourceConfig[name];
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Consulta a API sempre que a busca ou página forem alteradas.
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      page: String(page),
      limit: "20",
      ...(search ? { search } : {}),
    });
    api(`${config.endpoint}?${query}`)
      .then((data) => {
        setItems(data[config.key] || []);
        setPagination(data.pagination || null);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [config.endpoint, config.key, page, search]);
  // Reinicia a paginação ao alterar o termo de pesquisa.
  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">GESTÃO</p>
          <h1>{config.title}</h1>
        </div>
      </header>
      <input
        className="search"
        value={search}
        onChange={handleSearch}
        placeholder="Pesquisar..."
      />
      {error && <p className="feedback error">{error}</p>}
      {loading ? (
        <p className="feedback">Carregando...</p>
      ) : (
        <div className="resource-card">
          <table>
            <thead>
              <tr>
                {config.columns.map(([, label]) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {config.columns.map(([key]) => (
                    <td key={key}>{displayValue(readValue(item, key), key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <p className="empty">Nenhum registro encontrado.</p>
          )}
        </div>
      )}
      {pagination && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Anterior
          </button>
          <span>
            Página {page} de {pagination.totalPages || 1}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}

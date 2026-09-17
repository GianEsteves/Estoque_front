import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./stylesDashboard.css";

// Formata valores monetários em real brasileiro.
function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

// Mostra os indicadores consolidados do negócio.
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  // Carrega os indicadores quando a tela é aberta.
  useEffect(() => {
    api("/dashboard")
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, []);
  if (error) return <p className="feedback error">{error}</p>;
  if (!data) return <p className="feedback">Carregando indicadores...</p>;
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">VISÃO GERAL</p>
          <h1>Dashboard</h1>
        </div>
        <span>Período atual</span>
      </header>
      <div className="stats">
        <article>
          <small>Vendas concluídas</small>
          <strong>{data.sales.count}</strong>
        </article>
        <article>
          <small>Faturamento líquido</small>
          <strong>{money(data.sales.total)}</strong>
        </article>
        {data.stock && (
          <>
            <article>
              <small>Unidades em estoque</small>
              <strong>{data.stock.units}</strong>
            </article>
            <article>
              <small>Estoque baixo</small>
              <strong className="danger">{data.stock.lowStock}</strong>
            </article>
          </>
        )}
      </div>
      <section className="panel">
        <h2>Produtos mais vendidos</h2>
        {data.topProducts?.length ? (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((item) => (
                <tr key={item.product?.id}>
                  <td>{item.product?.name || "Produto removido"}</td>
                  <td>{item.quantity}</td>
                  <td>{money(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma venda no período.</p>
        )}
      </section>
    </section>
  );
}

import { useState } from "react";
import BtnGreen from "../../components/BtnGreen";
import { api } from "../../services/api";

// Gera o relatório consolidado de vendas conforme o período informado.
export default function SalesReport() {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  // Consulta os totalizadores de vendas na API.
  async function handleSubmit(event) { event.preventDefault(); setError(""); try { const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)); setReport(await api(`/sales/reports?${query}`)); } catch (requestError) { setError(requestError.message); } }
  return <section><header className="page-header"><div><p className="eyebrow">RELATÓRIOS</p><h1>Relatório de vendas</h1></div></header><form className="operation-card" onSubmit={handleSubmit}><div className="operation-top"><label>Data inicial<input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label><label>Data final<input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label></div><BtnGreen type="submit">Gerar relatório</BtnGreen></form>{error && <p className="form-error">{error}</p>}{report && <div className="stats report-stats"><article><small>Vendas concluídas</small><strong>{report.totals.completedCount}</strong></article><article><small>Canceladas</small><strong>{report.totals.cancelledCount}</strong></article><article><small>Faturamento líquido</small><strong>R$ {Number(report.totals.netRevenue).toFixed(2)}</strong></article></div>}</section>;
}

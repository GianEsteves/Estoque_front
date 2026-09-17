import { useEffect, useState } from "react";
import BtnGreen from "../../components/BtnGreen";
import { api } from "../../services/api";
import "./stylesOperations.css";

// Gerencia entradas recebidas de fornecedores e saídas manuais de estoque.
export default function InventoryOperations() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [entry, setEntry] = useState({
    supplierId: "",
    notes: "",
    items: [{ productId: "", quantity: 1, unitCost: 0 }],
  });
  const [exit, setExit] = useState({
    productId: "",
    quantity: 1,
    reason: "",
    type: "EXIT",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Carrega produtos e fornecedores válidos para as operações.
  useEffect(() => {
    Promise.all([
      api("/products?isActive=true&limit=100"),
      api("/suppliers?isActive=true&limit=100"),
    ])
      .then(([productData, supplierData]) => {
        setProducts(productData.products);
        setSuppliers(supplierData.suppliers);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);
  // Atualiza um item da entrada em edição.
  function changeEntryItem(index, field, value) {
    setEntry((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }
  // Registra a entrada e atualiza os saldos no backend.
  async function submitEntry(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/inventory/entries", {
        method: "POST",
        body: {
          ...entry,
          items: entry.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            unitCost: Number(item.unitCost),
          })),
        },
      });
      setMessage("Entrada registrada e saldo atualizado.");
      setEntry({
        supplierId: "",
        notes: "",
        items: [{ productId: "", quantity: 1, unitCost: 0 }],
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  // Registra uma saída ou ajuste de estoque.
  async function submitExit(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/inventory/exits", {
        method: "POST",
        body: { ...exit, quantity: Number(exit.quantity) },
      });
      setMessage("Saída registrada e saldo atualizado.");
      setExit({ productId: "", quantity: 1, reason: "", type: "EXIT" });
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">OPERAÇÕES</p>
          <h1>Movimentar estoque</h1>
        </div>
      </header>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      <div className="operation-grid">
        <form className="operation-card" onSubmit={submitEntry}>
          <h2>Entrada de estoque</h2>
          <label>
            Fornecedor
            <select
              required
              value={entry.supplierId}
              onChange={(event) =>
                setEntry({ ...entry, supplierId: event.target.value })
              }
            >
              <option value="">Selecione</option>
              {suppliers.map((supplier) => (
                <option value={supplier.id} key={supplier.id}>
                  {supplier.legalName}
                </option>
              ))}
            </select>
          </label>
          {entry.items.map((item, index) => (
            <div className="line-item" key={index}>
              <select
                required
                value={item.productId}
                onChange={(event) =>
                  changeEntryItem(index, "productId", event.target.value)
                }
              >
                <option value="">Produto</option>
                {products.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                required
                value={item.quantity}
                onChange={(event) =>
                  changeEntryItem(index, "quantity", event.target.value)
                }
              />
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={item.unitCost}
                onChange={(event) =>
                  changeEntryItem(index, "unitCost", event.target.value)
                }
              />
              {entry.items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setEntry({
                      ...entry,
                      items: entry.items.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            className="text-button"
            type="button"
            onClick={() =>
              setEntry({
                ...entry,
                items: [
                  ...entry.items,
                  { productId: "", quantity: 1, unitCost: 0 },
                ],
              })
            }
          >
            + Adicionar item
          </button>
          <label>
            Observações
            <input
              value={entry.notes}
              onChange={(event) =>
                setEntry({ ...entry, notes: event.target.value })
              }
            />
          </label>
          <BtnGreen type="submit">Registrar entrada</BtnGreen>
        </form>
        <form className="operation-card" onSubmit={submitExit}>
          <h2>Saída ou ajuste</h2>
          <label>
            Produto
            <select
              required
              value={exit.productId}
              onChange={(event) =>
                setExit({ ...exit, productId: event.target.value })
              }
            >
              <option value="">Selecione</option>
              {products.map((product) => (
                <option value={product.id} key={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tipo
            <select
              value={exit.type}
              onChange={(event) =>
                setExit({ ...exit, type: event.target.value })
              }
            >
              <option value="EXIT">Saída manual</option>
              <option value="ADJUSTMENT">Ajuste</option>
            </select>
          </label>
          <label>
            Quantidade
            <input
              type="number"
              min="1"
              required
              value={exit.quantity}
              onChange={(event) =>
                setExit({ ...exit, quantity: event.target.value })
              }
            />
          </label>
          <label>
            Motivo
            <input
              required
              minLength="3"
              value={exit.reason}
              onChange={(event) =>
                setExit({ ...exit, reason: event.target.value })
              }
            />
          </label>
          <BtnGreen type="submit">Registrar saída</BtnGreen>
        </form>
      </div>
    </section>
  );
}

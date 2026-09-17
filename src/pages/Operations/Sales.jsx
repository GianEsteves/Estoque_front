import { useEffect, useState } from "react";
import BtnGreen from "../../components/BtnGreen";
import { api } from "../../services/api";
import "./stylesOperations.css";

// Permite finalizar uma venda usando os preços e saldos da API.
export default function SalesOperations() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sale, setSale] = useState({
    customerId: "",
    paymentMethod: "DINHEIRO",
    discount: 0,
    items: [{ productId: "", quantity: 1, discount: 0 }],
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Carrega produtos e clientes ativos para compor a venda.
  useEffect(() => {
    Promise.all([
      api("/products?isActive=true&limit=100"),
      api("/customers?isActive=true&limit=100"),
    ])
      .then(([productData, customerData]) => {
        setProducts(productData.products);
        setCustomers(customerData.customers);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);
  // Atualiza uma linha de item da venda.
  function changeItem(index, field, value) {
    setSale((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }
  // Envia a venda e deixa o backend baixar o estoque em transação.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const { sale: createdSale } = await api("/sales", {
        method: "POST",
        body: {
          ...sale,
          customerId: sale.customerId || null,
          discount: Number(sale.discount),
          items: sale.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            discount: Number(item.discount),
          })),
        },
      });
      setMessage(`Venda ${createdSale.id} finalizada com sucesso.`);
      setSale({
        customerId: "",
        paymentMethod: "DINHEIRO",
        discount: 0,
        items: [{ productId: "", quantity: 1, discount: 0 }],
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">OPERAÇÕES</p>
          <h1>Nova venda</h1>
        </div>
      </header>
      <form className="operation-card wide" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <div className="operation-top">
          <label>
            Cliente (opcional)
            <select
              value={sale.customerId}
              onChange={(event) =>
                setSale({ ...sale, customerId: event.target.value })
              }
            >
              <option value="">Consumidor final</option>
              {customers.map((customer) => (
                <option value={customer.id} key={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Pagamento
            <select
              value={sale.paymentMethod}
              onChange={(event) =>
                setSale({ ...sale, paymentMethod: event.target.value })
              }
            >
              <option>DINHEIRO</option>
              <option>PIX</option>
              <option>CARTAO</option>
              <option>TRANSFERENCIA</option>
            </select>
          </label>
          <label>
            Desconto total
            <input
              type="number"
              min="0"
              step="0.01"
              value={sale.discount}
              onChange={(event) =>
                setSale({ ...sale, discount: event.target.value })
              }
            />
          </label>
        </div>
        {sale.items.map((item, index) => (
          <div className="line-item sales-line" key={index}>
            <select
              required
              value={item.productId}
              onChange={(event) =>
                changeItem(index, "productId", event.target.value)
              }
            >
              <option value="">Produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — saldo {product.stockQuantity}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              required
              value={item.quantity}
              onChange={(event) =>
                changeItem(index, "quantity", event.target.value)
              }
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.discount}
              onChange={(event) =>
                changeItem(index, "discount", event.target.value)
              }
            />
            {sale.items.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSale({
                    ...sale,
                    items: sale.items.filter(
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
            setSale({
              ...sale,
              items: [
                ...sale.items,
                { productId: "", quantity: 1, discount: 0 },
              ],
            })
          }
        >
          + Adicionar produto
        </button>
        <BtnGreen type="submit">Finalizar venda</BtnGreen>
      </form>
    </section>
  );
}

import { useEffect, useState } from "react";
import BtnGreen from "../../components/BtnGreen";
import { api } from "../../services/api";
import "./stylesManagement.css";

const addressFields = [
  "street",
  "number",
  "complement",
  "neighborhood",
  "city",
  "state",
  "zipCode",
];
const definitions = {
  categories: {
    title: "Categorias",
    endpoint: "/categories",
    key: "categories",
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "description", label: "Descrição" },
      { name: "isActive", label: "Ativa", type: "checkbox" },
    ],
    columns: ["name", "description", "isActive"],
  },
  products: {
    title: "Produtos",
    endpoint: "/products",
    key: "products",
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "sku", label: "SKU", required: true },
      {
        name: "categoryId",
        label: "Categoria",
        type: "category",
        required: true,
      },
      { name: "description", label: "Descrição" },
      {
        name: "costPrice",
        label: "Preço de custo",
        type: "number",
        required: true,
      },
      {
        name: "salePrice",
        label: "Preço de venda",
        type: "number",
        required: true,
      },
      {
        name: "minimumStock",
        label: "Estoque mínimo",
        type: "number",
        required: true,
      },
      { name: "isActive", label: "Ativo", type: "checkbox" },
    ],
    columns: ["name", "sku", "category.name", "stockQuantity", "isActive"],
  },
  suppliers: {
    title: "Fornecedores",
    endpoint: "/suppliers",
    key: "suppliers",
    fields: [
      { name: "legalName", label: "Razão social", required: true },
      { name: "tradeName", label: "Nome fantasia" },
      { name: "document", label: "CPF/CNPJ" },
      { name: "email", label: "E-mail", type: "email" },
      { name: "phone", label: "Telefone" },
      ...addressFields.map((name) => ({
        name,
        label: {
          street: "Logradouro",
          number: "Número",
          complement: "Complemento",
          neighborhood: "Bairro",
          city: "Cidade",
          state: "UF",
          zipCode: "CEP",
        }[name],
        required: name !== "complement",
      })),
      { name: "isActive", label: "Ativo", type: "checkbox" },
    ],
    columns: ["legalName", "document", "phone", "isActive"],
  },
  customers: {
    title: "Clientes",
    endpoint: "/customers",
    key: "customers",
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "document", label: "CPF/CNPJ" },
      { name: "email", label: "E-mail", type: "email" },
      { name: "phone", label: "Telefone" },
      ...addressFields.map((name) => ({
        name,
        label: {
          street: "Logradouro",
          number: "Número",
          complement: "Complemento",
          neighborhood: "Bairro",
          city: "Cidade",
          state: "UF",
          zipCode: "CEP",
        }[name],
        required: name !== "complement",
      })),
      { name: "isActive", label: "Ativo", type: "checkbox" },
    ],
    columns: ["name", "document", "email", "isActive"],
  },
  users: {
    title: "Usuários",
    endpoint: "/users",
    key: "users",
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "phone", label: "Telefone", required: true },
      {
        name: "password",
        label: "Senha",
        type: "password",
        createOnly: true,
        required: true,
      },
      {
        name: "role",
        label: "Perfil",
        type: "select",
        options: ["ADMIN", "VENDEDOR", "ESTOQUISTA"],
      },
      { name: "mfaRequired", label: "Exigir MFA", type: "checkbox" },
      { name: "isActive", label: "Ativo", type: "checkbox", updateOnly: true },
    ],
    columns: ["name", "email", "role", "isActive"],
  },
};

// Obtém uma propriedade possivelmente aninhada de um registro.
function valueAt(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

// Cria o estado inicial do formulário para um novo registro.
function blankForm(definition) {
  return Object.fromEntries(
    definition.fields.map((field) => [
      field.name,
      field.type === "checkbox" ? true : "",
    ]),
  );
}

// Converte um registro da API no formato utilizado pelo formulário.
function recordToForm(record, definition) {
  const form = blankForm(definition);
  definition.fields.forEach((field) => {
    form[field.name] = addressFields.includes(field.name)
      ? record.address?.[field.name] || ""
      : (record[field.name] ??
        (field.name === "categoryId" ? record.category?.id : ""));
  });
  return form;
}

// Monta a carga útil removendo campos de interface e agrupando o endereço.
function payloadFrom(form, definition, editing) {
  const payload = {};
  definition.fields.forEach((field) => {
    if (field.createOnly && editing) return;
    if (field.updateOnly && !editing) return;
    if (addressFields.includes(field.name)) return;
    if (field.type === "number") payload[field.name] = Number(form[field.name]);
    else if (field.type === "checkbox")
      payload[field.name] = Boolean(form[field.name]);
    else if (form[field.name] !== "") payload[field.name] = form[field.name];
  });
  if (definition.fields.some((field) => addressFields.includes(field.name)))
    payload.address = Object.fromEntries(
      addressFields.map((key) => [key, form[key] || null]),
    );
  return payload;
}

// Exibe uma tela completa de cadastro, edição e listagem para uma entidade.
export default function Management({ name }) {
  const definition = definitions[name];
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() => blankForm(definition));
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  // Carrega os registros e categorias auxiliares da tela.
  async function load() {
    try {
      const data = await api(`${definition.endpoint}?limit=100`);
      setItems(data[definition.key] || []);
      if (name === "products") {
        const categoryData = await api("/categories?isActive=true&limit=100");
        setCategories(categoryData.categories || []);
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  useEffect(() => {
    load();
  }, [name]);
  // Atualiza um campo do formulário.
  function handleChange(event) {
    const { name: fieldName, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [fieldName]: type === "checkbox" ? checked : value,
    }));
  }
  // Submete um cadastro ou uma alteração à API.
  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setNotice("");
    setError("");
    try {
      const body = payloadFrom(form, definition, editing);
      const data = await api(
        editing ? `${definition.endpoint}/${editing.id}` : definition.endpoint,
        { method: editing ? "PATCH" : "POST", body },
      );
      setNotice(editing ? "Registro atualizado." : "Registro criado.");
      setEditing(null);
      setForm(blankForm(definition));
      await load();
      return data;
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  }
  // Preenche o formulário para edição de um registro.
  function startEditing(record) {
    setEditing(record);
    setForm(recordToForm(record, definition));
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  // Cancela a edição e limpa o formulário.
  function cancelEditing() {
    setEditing(null);
    setForm(blankForm(definition));
  }
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">GESTÃO</p>
          <h1>{definition.title}</h1>
        </div>
      </header>
      <div className="management-grid">
        <form className="management-form" onSubmit={handleSubmit}>
          <h2>{editing ? "Editar registro" : "Novo registro"}</h2>
          {error && <p className="form-error">{error}</p>}
          {notice && <p className="form-success">{notice}</p>}
          {definition.fields
            .filter(
              (field) =>
                !(field.createOnly && editing) &&
                !(field.updateOnly && !editing),
            )
            .map((field) => (
              <label
                key={field.name}
                className={field.type === "checkbox" ? "checkbox" : ""}
              >
                {field.type === "checkbox" ? (
                  <>
                    <input
                      name={field.name}
                      checked={Boolean(form[field.name])}
                      onChange={handleChange}
                      type="checkbox"
                    />{" "}
                    {field.label}
                  </>
                ) : (
                  <>
                    {field.label}
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                      >
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === "category" ? (
                      <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        type={field.type || "text"}
                        required={field.required}
                        step={field.type === "number" ? "0.01" : undefined}
                      />
                    )}
                  </>
                )}
              </label>
            ))}
          <BtnGreen type="submit" disabled={pending}>
            {pending
              ? "Salvando..."
              : editing
                ? "Salvar alterações"
                : "Cadastrar"}
          </BtnGreen>
          {editing && (
            <button
              className="text-button"
              type="button"
              onClick={cancelEditing}
            >
              Cancelar
            </button>
          )}
        </form>
        <div className="resource-card">
          <table>
            <thead>
              <tr>
                {definition.columns.map((column) => (
                  <th key={column}>{column.split(".").at(-1)}</th>
                ))}
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {definition.columns.map((column) => (
                    <td key={column}>
                      {typeof valueAt(item, column) === "boolean"
                        ? valueAt(item, column)
                          ? "Ativo"
                          : "Inativo"
                        : (valueAt(item, column) ?? "—")}
                    </td>
                  ))}
                  <td>
                    <button
                      className="table-action"
                      onClick={() => startEditing(item)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <p className="empty">Nenhum registro encontrado.</p>
          )}
        </div>
      </div>
    </section>
  );
}

import "./stylesBtnGreen.css";

// Renderiza o botão primário da aplicação.
export default function BtnGreen({ children, type = "button", ...props }) {
  return <button className="btn-green" type={type} {...props}>{children}</button>;
}

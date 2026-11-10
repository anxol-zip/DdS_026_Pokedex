import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// index.css va antes que App para que los estilos de App.css puedan sobrescribirlo
// import "./index.css";
import App from "./App.jsx";
import LoginDemo from "./LoginDemo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*<App />*/}
    <LoginDemo />
  </StrictMode>,
);

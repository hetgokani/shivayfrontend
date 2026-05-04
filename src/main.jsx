import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* NO ROUTER HERE - it's already inside App.jsx */}
      <App />
    </AuthProvider>
  </StrictMode>,
);

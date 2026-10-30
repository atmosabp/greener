import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/login/Login.tsx";
import Homepage from "./pages/home/Homepage.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Ranking from "./pages/ranking/Ranking.tsx";
import Comparison from "./pages/comparison/Comparison.tsx";
import Admin from "./pages/admin/Admin.tsx";
import ThemeProvider from "./providers/ThemeProvider.tsx";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas que exigem autenticação */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/comparison" element={<Comparison />} />
          </Route>

          {/* Rota exclusiva para administradores */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

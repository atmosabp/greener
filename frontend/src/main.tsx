import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/login/Login.tsx";
import Homepage from "./pages/home/homepage.tsx";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import Ranking from "./pages/ranking/ranking.tsx";
import Comparison from "./pages/comparison/comparison.tsx";
import Admin from "./pages/admin/admin.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

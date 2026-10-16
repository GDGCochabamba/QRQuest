import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./theme.css";
import AlmuerzoRegistrado from "./AlmuerzoRegistrado";
import Almuerzos from "./Almuerzos";
import Home from "./Home";
import QrReader from "./scanner";
import Login from "./login";
import Unlocked from "./unlocked";
import Rewards from "./Rewards";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scan" element={<QrReader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unlocked" element={<Unlocked />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/almuerzos" element={<Almuerzos />} />
        <Route path="/almuerzo-registrado" element={<AlmuerzoRegistrado />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
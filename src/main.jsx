import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./theme.css";
import Home from "./Home";
import QrReader from "./scanner";
import Login from "./login";
import Unlocked from "./unlocked";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scan" element={<QrReader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unlocked" element={<Unlocked />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
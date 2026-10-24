import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
// A fresh visit should open at the hero, not at a browser-restored partial scroll.
// Keep anchor deep links and back/forward navigation intact.
if (!window.location.hash) {
  history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  window.addEventListener("load", () => window.scrollTo({ top: 0, left: 0, behavior: "instant" }), { once: true });
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

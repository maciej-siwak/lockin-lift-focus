import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applySkin, getSkin } from "./lib/skin";

applySkin(getSkin());

createRoot(document.getElementById("root")!).render(<App />);

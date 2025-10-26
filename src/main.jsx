// main.jsx - EI FILE TA CHECK KORUN
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./root/Router.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import { ThemeProvider } from "./pages/darack/ThemeContext.jsx"; // ✅ Path change korlam
import { ActivityProvider } from "./hook/ActivityContext.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider> {/* ✅ ThemeProvider FIRST e rakhlam */}
        <AuthProvider> {/* ✅ Then AuthProvider */}
          <ActivityProvider> 
            <RouterProvider router={Router} />
          </ActivityProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
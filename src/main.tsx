import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./root/Router.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import { ThemeProvider } from "./pages/darack/ThemeContext.jsx"; // ✅ Theme Provider
import { ActivityProvider } from "./hook/ActivityContext.jsx";   // ✅ Activity Provider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ActivityProvider> 
          <RouterProvider router={Router} />
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
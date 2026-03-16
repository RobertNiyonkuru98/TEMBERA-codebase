import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n.tsx";
import { store } from "./store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <TooltipProvider delayDuration={0}>
        <ThemeProvider>
          <I18nProvider>
            <App />
          </I18nProvider>
        </ThemeProvider>
      </TooltipProvider>
    </Provider>
  </StrictMode>,
);

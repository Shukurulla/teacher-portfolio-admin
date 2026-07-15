import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import "./index.css";

// MUI mavzu (theme). Tailwind bilan birga ishlaydi — CssBaseline qo'shilmadi.
const theme = createTheme({
  palette: {
    primary: { main: "#1e40af" },
    secondary: { main: "#4f46e5" },
    success: { main: "#16a34a" },
    warning: { main: "#d97706" },
    error: { main: "#dc2626" },
    background: { default: "#f3f4f6" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

import { createTheme } from "@mui/material/styles";

// Portfolio-sport admin — yagona, jipslashgan dizayn tizimi
export const theme = createTheme({
  palette: {
    primary: { main: "#2563eb", dark: "#1d4ed8", light: "#60a5fa" },
    secondary: { main: "#7c3aed" },
    success: { main: "#16a34a", light: "#dcfce7" },
    warning: { main: "#d97706", light: "#fef3c7" },
    error: { main: "#dc2626", light: "#fee2e2" },
    info: { main: "#0891b2" },
    background: { default: "#f1f5f9", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
    divider: "#e2e8f0",
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 800, letterSpacing: "-0.015em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#f1f5f9" },
        "*::-webkit-scrollbar": { width: 8, height: 8 },
        "*::-webkit-scrollbar-thumb": {
          background: "#cbd5e1",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10, paddingInline: 18 } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          color: "#0f172a",
          borderBottom: "1px solid #e2e8f0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#64748b",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          background: "#f8fafc",
        },
        root: { borderColor: "#eef2f7" },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginInline: 8,
          "&.Mui-selected": {
            backgroundColor: "rgba(255,255,255,0.16)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" },
          },
        },
      },
    },
  },
});

export default theme;

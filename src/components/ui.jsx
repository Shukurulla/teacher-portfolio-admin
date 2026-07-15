import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

// Sahifa sarlavhasi + tavsif + o'ng tomonda amal tugmasi
export const PageHeader = ({ title, subtitle, action }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    gap={2}
    mb={3}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="h5">{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
  </Stack>
);

// Statistika kartasi — bosiladi (drilldown), ikonка + qiymat
export const StatCard = ({
  icon,
  label,
  value,
  color = "#2563eb",
  onClick,
  loading,
  hint,
}) => (
  <Card
    onClick={onClick}
    sx={{
      height: "100%",
      cursor: onClick ? "pointer" : "default",
      transition: "transform .15s ease, box-shadow .15s ease",
      "&:hover": onClick
        ? { transform: "translateY(-3px)", boxShadow: "0 10px 28px rgba(15,23,42,0.1)" }
        : {},
    }}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(color, 0.12),
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ color }}>
            {loading ? "…" : value}
          </Typography>
        </Box>
      </Stack>
      {hint && (
        <Typography variant="caption" color="text.secondary" mt={1.5} display="block">
          {hint}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const STATUS_MAP = {
  Tasdiqlandi: { color: "#16a34a", label: "Tasdiqlandi" },
  Tasdiqlanmadi: { color: "#dc2626", label: "Tasdiqlanmadi" },
  "Rad etildi": { color: "#dc2626", label: "Rad etildi" },
  Tekshirilmoqda: { color: "#d97706", label: "Tekshirilmoqda" },
};

// Holat chipi — yumshoq (soft) rangli
export const StatusChip = ({ status }) => {
  const m = STATUS_MAP[status] || { color: "#64748b", label: status || "—" };
  return (
    <Chip
      size="small"
      label={m.label}
      sx={{
        bgcolor: alpha(m.color, 0.12),
        color: m.color,
        fontWeight: 600,
      }}
    />
  );
};

// Umumiy soft chip
export const SoftChip = ({ label, color = "#2563eb", ...props }) => (
  <Chip
    size="small"
    label={label}
    sx={{ bgcolor: alpha(color, 0.12), color, fontWeight: 600 }}
    {...props}
  />
);

// Markazlashgan yuklanish
export const Loader = ({ height = 300, label }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5,
      minHeight: height,
    }}
  >
    <CircularProgress />
    {label && (
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    )}
  </Box>
);

// Bo'sh holat
export const EmptyState = ({ icon, title, description, action }) => (
  <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
    {icon && (
      <Box sx={{ color: "text.disabled", mb: 1.5, "& svg": { fontSize: 56 } }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" color="text.primary" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" mb={2}>
        {description}
      </Typography>
    )}
    {action}
  </Box>
);

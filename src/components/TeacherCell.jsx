import { Link } from "react-router-dom";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const PALETTE = [
  "#2563eb",
  "#7c3aed",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#db2777",
];

const colorFromName = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
};

const DEFAULT_IMG =
  "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

// O'qituvchi identifikatori: rasm (yoki bosh harflar) + ism-familiya (+ telefon).
// id berilsa — bosilганda /teachers/:id profiliga o'tadi.
const TeacherCell = ({
  id,
  firstName,
  lastName,
  image,
  phone,
  size = 40,
  onClick,
}) => {
  const name = `${firstName || ""} ${lastName || ""}`.trim() || "—";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
  const color = colorFromName(name);
  const realImage = image && image !== DEFAULT_IMG ? image : undefined;

  const content = (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
      <Avatar
        src={realImage}
        sx={{
          width: size,
          height: size,
          bgcolor: alpha(color, 0.16),
          color,
          fontWeight: 700,
          fontSize: size * 0.38,
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          className="tc-name"
          variant="body2"
          sx={{ fontWeight: 600, lineHeight: 1.2 }}
          noWrap
        >
          {name}
        </Typography>
        {phone && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {phone}
          </Typography>
        )}
      </Box>
    </Stack>
  );

  if (!id) return content;

  return (
    <Box
      component={Link}
      to={`/teachers/${id}`}
      onClick={onClick}
      sx={{
        display: "inline-flex",
        maxWidth: "100%",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        "&:hover .tc-name": {
          color: "primary.main",
          textDecoration: "underline",
        },
      }}
    >
      {content}
    </Box>
  );
};

export default TeacherCell;

import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { logout } from "../store/slices/authSlice";

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { admin } = useSelector((s) => s.auth);
  const isSuper = admin?.role === "superadmin";

  const items = [
    {
      to: "/",
      label: "Bosh sahifa",
      icon: <DashboardRoundedIcon />,
      end: true,
    },
    ...(isSuper
      ? [{ to: "/filials", label: "Filiallar", icon: <ApartmentRoundedIcon /> }]
      : []),
    { to: "/teachers", label: "Mutaxassislar", icon: <GroupsRoundedIcon /> },
    { to: "/new-files", label: "Yangi hujjatlar", icon: <InboxRoundedIcon /> },
    {
      to: "/approved",
      label: "Tasdiqlangan",
      icon: <CheckCircleRoundedIcon />,
    },
    { to: "/rejected", label: "Rad etilgan", icon: <CancelRoundedIcon /> },
    {
      to: "/special-review",
      label: "Maxsus yutuqlar",
      icon: <WorkspacePremiumRoundedIcon />,
    },
    { to: "/malaka", label: "Malaka oshirish", icon: <SchoolRoundedIcon /> },
    {
      to: "/criteria",
      label: "Baholash natijalari",
      icon: <AssessmentRoundedIcon />,
    },
  ];

  const active = (to, end) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#e2e8f0",
        background: "linear-gradient(180deg,#0f172a 0%,#1e293b 100%)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={1.5}
        sx={{ px: 2.5, py: 2.75 }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 42, height: 42 }}>
          <SchoolRoundedIcon />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            Portfolio Sport
          </Typography>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            Admin panel
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ flex: 1, py: 1.5 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.to}
            component={NavLink}
            to={it.to}
            end={it.end}
            selected={active(it.to, it.end)}
            onClick={onNavigate}
            sx={{
              color: "#cbd5e1",
              mb: 0.5,
              "&.Mui-selected": { color: "#fff" },
              "& .MuiListItemIcon-root": { color: "inherit" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{it.icon}</ListItemIcon>
            <ListItemText
              primary={it.label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ py: 1 }}>
        <ListItemButton
          onClick={() => dispatch(logout())}
          sx={{
            color: "#fca5a5",
            "& .MuiListItemIcon-root": { color: "inherit" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Chiqish"
            primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;

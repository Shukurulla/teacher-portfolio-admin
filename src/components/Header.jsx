import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { logout } from "../store/slices/authSlice";

const TITLES = {
  "/": "Bosh sahifa",
  "/filials": "Filiallar boshqaruvi",
  "/teachers": "O'qituvchilar",
  "/new-files": "Yangi hujjatlar",
  "/approved": "Tasdiqlangan hujjatlar",
  "/rejected": "Rad etilgan hujjatlar",
};

const titleFor = (pathname) => {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/teachers")) return "O'qituvchi ma'lumotlari";
  if (pathname.startsWith("/files")) return "Hujjat ma'lumotlari";
  return "Admin panel";
};

const Header = ({ onMenuClick, drawerWidth }) => {
  const { admin } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState(null);
  const roleLabel =
    admin?.role === "superadmin" ? "Super admin" : "Filial admin";

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: "none" } }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1 }} noWrap>
          {titleFor(pathname)}
        </Typography>

        <Box
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            cursor: "pointer",
            px: 1,
            py: 0.5,
            borderRadius: 2,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontSize: 15 }}>
            {admin?.username?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
              {admin?.username || "Admin"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {roleLabel}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchor}
          open={!!anchor}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{admin?.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {roleLabel}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => dispatch(logout())}>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            Chiqish
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

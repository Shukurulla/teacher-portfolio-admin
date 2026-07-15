import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  Alert,
  InputAdornment,
} from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { login, clearError } from "../store/slices/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || "/", { replace: true });
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, location, dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          <Stack alignItems="center" spacing={1.5} mb={3}>
            <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
              <SchoolRoundedIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box textAlign="center">
              <Typography variant="h5">Portfolio Sport</Typography>
              <Typography variant="body2" color="text.secondary">
                Admin panelga kirish
              </Typography>
            </Box>
          </Stack>

          <form onSubmit={submit}>
            <Stack spacing={2.5}>
              <TextField
                label="Foydalanuvchi nomi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Parol"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.25 }}
              >
                {loading ? "Kirilmoqda..." : "Kirish"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

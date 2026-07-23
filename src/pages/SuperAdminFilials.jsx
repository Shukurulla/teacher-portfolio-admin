import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { toast } from "react-hot-toast";
import {
  getFilials,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../services/superAdminService";
import { PageHeader } from "../components/ui";

const emptyForm = { id: null, username: "", password: "", filial: "" };

const Stat = ({ label, value, color, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      textAlign: "center",
      py: 1,
      borderRadius: 2,
      cursor: onClick ? "pointer" : "default",
      transition: "background-color .15s",
      "&:hover": onClick ? { bgcolor: "action.hover" } : {},
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 700, color }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

const SuperAdminFilials = () => {
  const { admin } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [filials, setFilials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getFilials();
      setFilials(data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Filiallarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = (filialKey = "") => {
    setMode("create");
    setForm({ ...emptyForm, filial: filialKey });
    setDialogOpen(true);
  };

  const openEdit = (a) => {
    setMode("edit");
    setForm({ id: a._id, username: a.username, password: "", filial: a.filial });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (
      !form.username ||
      !form.filial ||
      (mode === "create" && !form.password)
    ) {
      toast.error(
        "username, filial" + (mode === "create" ? " va parol" : "") + " majburiy"
      );
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await createAdmin({
          username: form.username,
          password: form.password,
          filial: form.filial,
        });
        toast.success("Admin tayinlandi");
      } else {
        const payload = { username: form.username, filial: form.filial };
        if (form.password) payload.password = form.password;
        await updateAdmin(form.id, payload);
        toast.success("Admin yangilandi");
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a) => {
    if (!window.confirm(`"${a.username}" adminni o'chirasizmi?`)) return;
    try {
      await deleteAdmin(a._id);
      toast.success("Admin o'chirildi");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "O'chirishda xatolik");
    }
  };

  if (admin && admin.role !== "superadmin") {
    return (
      <Alert severity="warning">Bu sahifa faqat super admin uchun.</Alert>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Filiallar boshqaruvi"
        subtitle="Har bir filialga admin tayinlang. Mutaxassislar viloyati bo'yicha o'z filial adminiga yo'naltiriladi."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openCreate()}
          >
            Admin qo'shish
          </Button>
        }
      />


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          {filials.map((f) => (
            <Card key={f.key} variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  mb={2}
                >
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "#fff",
                      p: 1,
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    <ApartmentIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{f.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {f.key}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{ bgcolor: "grey.50", borderRadius: 2, mb: 2 }}
                >
                  <Stat
                    label="Mutaxassis"
                    value={f.teacherCount}
                    color="primary.main"
                    onClick={() =>
                      navigate(`/teachers?filial=${encodeURIComponent(f.key)}`)
                    }
                  />
                  <Stat
                    label="Yangi"
                    value={f.newCount}
                    color="warning.main"
                    onClick={() => navigate("/new-files")}
                  />
                  <Stat
                    label="Tasdiqlangan"
                    value={f.approvedCount}
                    color="success.main"
                    onClick={() => navigate("/approved")}
                  />
                  <Stat
                    label="Rad etilgan"
                    value={f.rejectedCount}
                    color="error.main"
                    onClick={() => navigate("/rejected")}
                  />
                </Stack>

                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Filial admini
                </Typography>

                {f.admins?.length ? (
                  <Stack spacing={1}>
                    {f.admins.map((a) => (
                      <Stack
                        key={a._id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          bgcolor: "grey.50",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2">{a.username}</Typography>
                        <Box>
                          <Tooltip title="Tahrirlash">
                            <IconButton size="small" onClick={() => openEdit(a)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="O'chirish">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(a)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Stack>
                    ))}
                    <Button
                      size="small"
                      startIcon={<PersonAddAlt1Icon />}
                      onClick={() => openCreate(f.key)}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Yana admin
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={() => openCreate(f.key)}
                  >
                    Admin tayinlash
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {mode === "create" ? "Filialga admin tayinlash" : "Adminni tahrirlash"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              fullWidth
            />
            <TextField
              label={mode === "create" ? "Parol" : "Yangi parol (ixtiyoriy)"}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Filial"
              value={form.filial}
              onChange={(e) => setForm({ ...form, filial: e.target.value })}
              fullWidth
            >
              {filials.map((f) => (
                <MenuItem key={f.key} value={f.key}>
                  {f.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminFilials;

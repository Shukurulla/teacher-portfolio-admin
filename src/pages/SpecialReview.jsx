import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { toast } from "react-hot-toast";
import { getSpecialAll, reviewSpecial } from "../services/phase2Service";
import { PageHeader, StatusChip, Loader, EmptyState, SoftChip } from "../components/ui";

const SERVER = "https://server.portfolio-sport.uz";

const SpecialReview = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setList((await getSpecialAll()) || []);
    } catch {
      toast.error("Ma'lumotlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const open = (rec) => {
    setDialog(rec);
    setResultMessage(rec.resultMessage || "");
  };

  const review = async (status) => {
    if (status === "Tasdiqlanmadi" && !resultMessage.trim()) {
      toast.error("Rad etish sababini yozing");
      return;
    }
    setSaving(true);
    try {
      await reviewSpecial(dialog._id, status, resultMessage);
      toast.success("Saqlandi");
      setDialog(null);
      setResultMessage("");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Xatolik");
    } finally {
      setSaving(false);
    }
  };

  const pending = list.filter((r) => r.status === "Tekshirilmoqda").length;

  return (
    <Box>
      <PageHeader
        title="Maxsus yutuqlar (18-band)"
        subtitle="O'qituvchilar yuborgan maxsus yutuq hujjatlarini tasdiqlang"
        action={<SoftChip label={`${pending} ta yangi`} color="#d97706" />}
      />

      <Card>
        {loading ? (
          <Loader label="Yuklanmoqda..." />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<WorkspacePremiumRoundedIcon />}
            title="Hujjatlar yo'q"
            description="Hozircha maxsus yutuq hujjatlari yuborilmagan"
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>O'qituvchi</TableCell>
                  <TableCell>Maxsus yutuq</TableCell>
                  <TableCell>Sana</TableCell>
                  <TableCell>Holat</TableCell>
                  <TableCell align="right">Amal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                      {r.from?.firstName} {r.from?.lastName}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 380 }}>
                      <Typography variant="body2">{r.itemTitle}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                      {new Date(r.createdAt).toLocaleDateString("uz-UZ")}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={r.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => open(r)}>
                        {r.status === "Tekshirilmoqda" ? "Baholash" : "Ko'rish"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} fullWidth maxWidth="sm">
        {dialog && (
          <>
            <DialogTitle>Maxsus yutuqni baholash</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    O'qituvchi
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {dialog.from?.firstName} {dialog.from?.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Maxsus yutuq
                  </Typography>
                  <Typography variant="body2">{dialog.itemTitle}</Typography>
                </Box>
                <Button
                  variant="outlined"
                  href={`${SERVER}${dialog.fileUrl}`}
                  target="_blank"
                  rel="noopener"
                  startIcon={<OpenInNewRoundedIcon />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Hujjatni ochish
                </Button>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                    Joriy holat
                  </Typography>
                  <StatusChip status={dialog.status} />
                </Box>
                {dialog.status === "Tekshirilmoqda" && (
                  <TextField
                    label="Izoh / rad etish sababi"
                    multiline
                    rows={2}
                    value={resultMessage}
                    onChange={(e) => setResultMessage(e.target.value)}
                    fullWidth
                  />
                )}
              </Stack>
            </DialogContent>
            {dialog.status === "Tekshirilmoqda" && (
              <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelRoundedIcon />}
                  onClick={() => review("Tasdiqlanmadi")}
                  disabled={saving}
                >
                  Rad etish
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleRoundedIcon />}
                  onClick={() => review("Tasdiqlandi")}
                  disabled={saving}
                >
                  Tasdiqlash
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SpecialReview;

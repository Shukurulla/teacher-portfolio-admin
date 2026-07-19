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
  Stack,
  Button,
} from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { toast } from "react-hot-toast";
import { getMalaka } from "../services/phase2Service";
import { PageHeader, Loader, EmptyState, SoftChip } from "../components/ui";
import { TeacherCell } from "../components";
import { formatDate } from "../utils/format";
import { FiTrash2 } from "react-icons/fi";
import api from "../api/api";

const FILIAL_NAMES = {
  Nukus: "JTSBMQTMOI Nukus Filiali",
  Fargʻona: "JTSBMQTMOI Fargʻona Filiali",
  Samarqand: "JTSBMQTMOI Samarqand Filiali",
  Toshkent: "JTSBMQTMO Instituti",
};

const MalakaList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setList((await getMalaka()) || []);
      } catch {
        toast.error("Ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const data = await api.delete(`/malaka/${id}`);
      setList((await getMalaka()) || []);
      setLoading(false);
      toast.success(data.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Malaka oshirish jadvali"
        subtitle="O'qituvchilar qachon va qaysi filialga malaka oshirishga borishi"
        action={<SoftChip label={`${list.length} ta yozuv`} color="#2563eb" />}
      />

      <Card>
        {loading ? (
          <Loader label="Yuklanmoqda..." />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<SchoolRoundedIcon />}
            title="Yozuvlar yo'q"
            description="Hozircha malaka oshirish rejalari kiritilmagan"
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>O'qituvchi</TableCell>
                  <TableCell>Sana</TableCell>
                  <TableCell>Filial</TableCell>
                  <TableCell>Viloyat</TableCell>
                  <TableCell>Yo'nalish</TableCell>
                  <TableCell>Izoh</TableCell>
                  <TableCell>Boshqarish</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell>
                      <TeacherCell
                        id={r.from?.id}
                        firstName={r.from?.firstName}
                        lastName={r.from?.lastName}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" alignItems="center" gap={0.75}>
                        <EventRoundedIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(r.date)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{FILIAL_NAMES[r.filial] || r.filial}</TableCell>
                    <TableCell>
                      {r.province ? (
                        <Stack direction="row" alignItems="center" gap={0.75}>
                          <PlaceRoundedIcon
                            fontSize="small"
                            sx={{ color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, minWidth: 140 }}
                          >
                            {r.province}
                          </Typography>
                        </Stack>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 280, maxWidth: 420 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", lineHeight: 1.45 }}
                      >
                        {r.direction || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {r.note || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(r._id)}
                      >
                        <span className="mr-2">
                          <FiTrash2 />
                        </span>{" "}
                        O'chirish
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MalakaList;

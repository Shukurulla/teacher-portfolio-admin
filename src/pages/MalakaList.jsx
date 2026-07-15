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
} from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import { toast } from "react-hot-toast";
import { getMalaka } from "../services/phase2Service";
import { PageHeader, Loader, EmptyState, SoftChip } from "../components/ui";
import { TeacherCell } from "../components";

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
                  <TableCell>Izoh</TableCell>
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
                          {new Date(r.date).toLocaleDateString("uz-UZ", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{FILIAL_NAMES[r.filial] || r.filial}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {r.note || "—"}
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

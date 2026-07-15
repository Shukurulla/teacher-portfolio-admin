import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
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
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRounded from "@mui/icons-material/SearchRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import { fetchAllTeachers, removeTeacher } from "../store/slices/teacherSlice";
import { toast } from "react-hot-toast";
import { PageHeader, Loader, EmptyState, SoftChip } from "../components/ui";
import { TeacherCell } from "../components";

const FILIAL_NAMES = {
  Nukus: "JTSBMQTMOI Nukus Filiali",
  Fargʻona: "JTSBMQTMOI Fargʻona Filiali",
  Samarqand: "JTSBMQTMOI Samarqand Filiali",
  Toshkent: "JTSBMQTMO Instituti",
};

const DEFAULT_PROFILE_IMAGE =
  "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

// Reyting nishoni: 1-3 o'rin oltin/kumush/bronza
const rankStyle = (i) => {
  if (i === 0) return { bg: "#fef9c3", fg: "#a16207" };
  if (i === 1) return { bg: "#f1f5f9", fg: "#475569" };
  if (i === 2) return { bg: "#ffedd5", fg: "#c2410c" };
  return { bg: "#f8fafc", fg: "#94a3b8" };
};

const TeacherList = () => {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const filialParam = searchParams.get("filial");

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Haqiqatan ham bu o'qituvchini o'chirmoqchimisiz?")) {
      dispatch(removeTeacher(id))
        .unwrap()
        .then(() => toast.success("O'qituvchi muvaffaqiyatli o'chirildi"))
        .catch((err) =>
          toast.error(err || "O'qituvchini o'chirishda xatolik yuz berdi")
        );
    }
  };

  // Filtrlash + jami ball bo'yicha kamayish tartibida (reyting)
  const ranked = (teachers || [])
    .filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesFilial =
        !filialParam || teacher.region?.region === filialParam;
      return matchesSearch && matchesFilial;
    })
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

  return (
    <Box>
      <PageHeader
        title="O'qituvchilar reytingi"
        subtitle="To'plagan bali bo'yicha tartiblangan o'qituvchilar ro'yxati"
        action={
          !loading && (
            <SoftChip label={`${ranked.length} ta o'qituvchi`} color="#2563eb" />
          )
        }
      />

      <Card>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <TextField
            size="small"
            placeholder="O'qituvchi qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", sm: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
          {filialParam && (
            <Chip
              label={FILIAL_NAMES[filialParam] || filialParam}
              onDelete={() => setSearchParams({})}
              sx={{
                bgcolor: alpha("#2563eb", 0.12),
                color: "#2563eb",
                fontWeight: 600,
                "& .MuiChip-deleteIcon": {
                  color: "#2563eb",
                  "&:hover": { color: "#1d4ed8" },
                },
              }}
            />
          )}
        </Stack>

        {loading ? (
          <Loader label="O'qituvchilar yuklanmoqda..." />
        ) : error ? (
          <Box sx={{ p: 6, textAlign: "center", color: "error.main" }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        ) : ranked.length === 0 ? (
          <EmptyState
            icon={<GroupsRounded />}
            title="O'qituvchilar topilmadi"
            description="Qidiruv yoki filtr shartlariga mos o'qituvchi mavjud emas"
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 64 }} align="center">
                    O'rin
                  </TableCell>
                  <TableCell>O'qituvchi</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell align="center">Ish joylari</TableCell>
                  <TableCell align="center">Yutuqlar</TableCell>
                  <TableCell align="center">Jami ball</TableCell>
                  <TableCell align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ranked.map((teacher, i) => {
                  const rs = rankStyle(i);
                  return (
                    <TableRow key={teacher._id} hover>
                      <TableCell align="center">
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            bgcolor: rs.bg,
                            color: rs.fg,
                            fontWeight: 800,
                            fontSize: 13,
                            display: "grid",
                            placeItems: "center",
                            mx: "auto",
                          }}
                        >
                          {i + 1}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TeacherCell
                          id={teacher._id}
                          firstName={teacher.firstName}
                          lastName={teacher.lastName}
                          image={teacher.profileImage}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                        {teacher.phone}
                      </TableCell>
                      <TableCell align="center">
                        <SoftChip label={teacher.jobsCount || 0} color="#2563eb" />
                      </TableCell>
                      <TableCell align="center">
                        <SoftChip
                          label={teacher.achievementsCount || 0}
                          color="#7c3aed"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, color: "#16a34a", lineHeight: 1 }}
                        >
                          {teacher.totalPoints || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ball
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityRounded />}
                            component={Link}
                            to={`/teachers/${teacher._id}`}
                          >
                            Ko'rish
                          </Button>
                          <Tooltip title="O'chirish">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(teacher._id)}
                            >
                              <DeleteOutlineRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TeacherList;

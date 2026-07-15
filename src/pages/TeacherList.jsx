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

const FILIAL_NAMES = {
  Nukus: "JTSBMQTMOI Nukus Filiali",
  Fargʻona: "JTSBMQTMOI Fargʻona Filiali",
  Samarqand: "JTSBMQTMOI Samarqand Filiali",
  Toshkent: "JTSBMQTMO Instituti",
};

const DEFAULT_PROFILE_IMAGE =
  "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

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
        .then(() => {
          toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
        })
        .catch((error) => {
          toast.error(error || "O'qituvchini o'chirishda xatolik yuz berdi");
        });
    }
  };

  const filteredTeachers = teachers?.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesFilial =
      !filialParam || teacher.region?.region === filialParam;
    return matchesSearch && matchesFilial;
  });

  return (
    <Box>
      <PageHeader
        title="O'qituvchilar ro'yxati"
        subtitle="Barcha o'qituvchilar va ularning portfolio ma'lumotlari"
        action={
          !loading && (
            <SoftChip
              label={`${filteredTeachers?.length || 0} ta o'qituvchi`}
              color="#2563eb"
            />
          )
        }
      />

      <Card>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
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
        ) : filteredTeachers?.length === 0 ? (
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
                  <TableCell>O'qituvchi</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Ish joylari</TableCell>
                  <TableCell>Yutuqlar</TableCell>
                  <TableCell align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeachers?.map((teacher) => (
                  <TableRow key={teacher._id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={teacher.profileImage || DEFAULT_PROFILE_IMAGE}
                          alt={`${teacher.firstName} ${teacher.lastName}`}
                          sx={{ width: 40, height: 40 }}
                        >
                          <PersonRounded />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {teacher.firstName} {teacher.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                    >
                      {teacher.phone}
                    </TableCell>
                    <TableCell>
                      <SoftChip label={teacher.jobsCount || 0} color="#2563eb" />
                    </TableCell>
                    <TableCell>
                      <SoftChip
                        label={teacher.achievementsCount || 0}
                        color="#7c3aed"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
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
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TeacherList;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { fetchAllFiles } from "../store/slices/fileSlice";
import { PageHeader, StatCard, StatusChip, Loader, EmptyState } from "../components/ui";
import { TeacherCell } from "../components";
import { formatDate } from "../utils/format";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teachers, loading: tLoading } = useSelector((s) => s.teachers);
  const { files, loading: fLoading } = useSelector((s) => s.files);

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchAllFiles());
  }, [dispatch]);

  const list = Array.isArray(files) ? files : [];
  const byStatus = (st) => list.filter((f) => f.status === st).length;
  const pending = byStatus("Tekshirilmoqda");
  const approved = byStatus("Tasdiqlandi");
  const rejected = byStatus("Tasdiqlanmadi");
  const recent = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <Box>
      <PageHeader
        title="Boshqaruv paneli"
        subtitle="Umumiy ko'rsatkichlar va so'nggi hujjatlar"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4,1fr)" },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatCard
          icon={<GroupsRoundedIcon />}
          label="Mutaxassislar"
          value={teachers?.length || 0}
          color="#2563eb"
          loading={tLoading}
          onClick={() => navigate("/teachers")}
        />
        <StatCard
          icon={<HourglassTopRoundedIcon />}
          label="Yangi hujjatlar"
          value={pending}
          color="#d97706"
          loading={fLoading}
          onClick={() => navigate("/new-files")}
        />
        <StatCard
          icon={<CheckCircleRoundedIcon />}
          label="Tasdiqlangan"
          value={approved}
          color="#16a34a"
          loading={fLoading}
          onClick={() => navigate("/approved")}
        />
        <StatCard
          icon={<CancelRoundedIcon />}
          label="Rad etilgan"
          value={rejected}
          color="#dc2626"
          loading={fLoading}
          onClick={() => navigate("/rejected")}
        />
      </Box>

      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="h6">So'nggi hujjatlar</Typography>
          <Button size="small" onClick={() => navigate("/new-files")}>
            Barchasi
          </Button>
        </Stack>

        {fLoading ? (
          <Loader label="Hujjatlar yuklanmoqda..." />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<InboxRoundedIcon />}
            title="Hujjatlar yo'q"
            description="Hozircha hech qanday hujjat yuborilmagan"
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mutaxassis</TableCell>
                  <TableCell>Yutuq</TableCell>
                  <TableCell>Sana</TableCell>
                  <TableCell>Holat</TableCell>
                  <TableCell align="right">Amal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((file) => (
                  <TableRow
                    key={file._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/files/${file._id}`)}
                  >
                    <TableCell>
                      <TeacherCell
                        id={file.from?.id}
                        firstName={file.from?.firstName}
                        lastName={file.from?.lastName}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {file.achievments?.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {file.achievments?.section}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                      {formatDate(file.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={file.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small">Ko'rish</Button>
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

export default Dashboard;

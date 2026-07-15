"use client";

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import WorkRounded from "@mui/icons-material/WorkRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import { fetchJobById, clearCurrentJob } from "../store/slices/jobSlice";
import {
  PageHeader,
  StatusChip,
  SoftChip,
  Loader,
  EmptyState,
} from "../components/ui";
import { formatDate } from "../utils/format";

const JobDetail = () => {
  const { teacherId, jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, jobFiles, loading, error } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchJobById(jobId));

    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, jobId]);

  const BackButton = null;

  if (loading && !currentJob) {
    return <Loader label="Ma'lumotlar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <Box>
        {BackButton}
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentJob) {
    return (
      <Box>
        {BackButton}
        <Alert severity="warning">Ish joyi topilmadi.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {BackButton}

      <PageHeader
        title="Ish joyi ma'lumotlari"
        subtitle={currentJob.title}
      />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack direction="row" spacing={2.5} alignItems="flex-start">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: alpha("#2563eb", 0.12),
                color: "#2563eb",
                flexShrink: 0,
              }}
            >
              <WorkRounded />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6">{currentJob.title}</Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.75, sm: 3 }}
                mt={1.25}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolRounded
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Ish joyi:
                    </Box>{" "}
                    {currentJob.workplace}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    Qo'shilgan sana:
                  </Box>{" "}
                  {formatDate(currentJob.createdAt)}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="h6">Yuborilgan fayllar</Typography>
          <SoftChip label={jobFiles?.length || 0} />
        </Stack>

        {loading ? (
          <Loader label="Fayllar yuklanmoqda..." />
        ) : jobFiles?.length === 0 ? (
          <EmptyState
            icon={<EmojiEventsRounded />}
            title="Fayllar mavjud emas"
            description="Bu ish joyi bo'yicha hali hujjat yuborilmagan"
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Yutuq</TableCell>
                  <TableCell>Bo'lim</TableCell>
                  <TableCell>Ball</TableCell>
                  <TableCell>Holat</TableCell>
                  <TableCell>Sana</TableCell>
                  <TableCell align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobFiles?.map((file) => {
                  const ball =
                    file.files?.reduce(
                      (sum, f) => sum + (f.rating?.rating || 0),
                      0
                    ) || "-";
                  return (
                    <TableRow
                      key={file._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/files/${file._id}`)}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        {file.achievments.title}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {file.achievments.section}
                      </TableCell>
                      <TableCell>
                        {ball === "-" ? (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        ) : (
                          <SoftChip label={ball} color="#7c3aed" />
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={file.status} />
                      </TableCell>
                      <TableCell
                        sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                      >
                        {formatDate(file.createdAt)}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          to={`/files/${file._id}`}
                          size="small"
                          startIcon={<VisibilityRounded />}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ko'rish
                        </Button>
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

export default JobDetail;

"use client";

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Avatar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import WorkRounded from "@mui/icons-material/WorkRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import {
  fetchTeacherById,
  fetchTeacherJobs,
  clearCurrentTeacher,
} from "../store/slices/teacherSlice";
import { PageHeader, StatCard, Loader, EmptyState } from "../components/ui";

const FALLBACK_IMAGE =
  "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

// Ikonка + matn juftligi (profil ma'lumotlari uchun)
const InfoRow = ({ icon, children }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        color: "text.disabled",
        "& svg": { fontSize: 18 },
      }}
    >
      {icon}
    </Box>
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Stack>
);

const TeacherDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTeacher, teacherJobs, loading, error } = useSelector(
    (state) => state.teachers
  );

  useEffect(() => {
    dispatch(fetchTeacherById(id));
    dispatch(fetchTeacherJobs(id));

    return () => {
      dispatch(clearCurrentTeacher());
    };
  }, [dispatch, id]);

  const backButton = (
    <Button
      startIcon={<ArrowBackRounded />}
      onClick={() => navigate(-1)}
      color="inherit"
      sx={{ mb: 2, ml: -1, color: "text.secondary" }}
    >
      Orqaga
    </Button>
  );

  if (loading && !currentTeacher) {
    return <Loader height={400} label="Ma'lumotlar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <Box>
        {backButton}
        <Alert severity="error" variant="outlined">
          <AlertTitle>Xatolik</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!currentTeacher) {
    return (
      <Box>
        {backButton}
        <Alert severity="warning" variant="outlined">
          <AlertTitle>Diqqat</AlertTitle>
          O'qituvchi topilmadi.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {backButton}
      <PageHeader
        title={`${currentTeacher.firstName} ${currentTeacher.lastName}`}
        subtitle="O'qituvchi ma'lumotlari"
      />

      {/* Profil sarlavhasi */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Avatar
              src={currentTeacher.profileImage || FALLBACK_IMAGE}
              alt={`${currentTeacher.firstName} ${currentTeacher.lastName}`}
              sx={{
                width: 112,
                height: 112,
                boxShadow: "0 0 0 4px #fff, 0 0 0 5px #e2e8f0",
              }}
            >
              <PersonRounded sx={{ fontSize: 48 }} />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {currentTeacher.firstName} {currentTeacher.lastName}
              </Typography>
              <Stack spacing={0.75}>
                {currentTeacher.phone && (
                  <InfoRow icon={<PhoneRounded />}>
                    {currentTeacher.phone}
                  </InfoRow>
                )}
                {currentTeacher.region?.region && (
                  <InfoRow icon={<PlaceRounded />}>
                    {currentTeacher.region.region}
                  </InfoRow>
                )}
              </Stack>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 1, display: "block" }}
              >
                Ro'yxatdan o'tgan sana:{" "}
                {new Date(currentTeacher.createdAt).toLocaleDateString("uz-UZ")}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistika */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatCard
          icon={<WorkRounded />}
          label="Ish joylari"
          value={teacherJobs?.length || 0}
          color="#2563eb"
        />
        <StatCard
          icon={<EmojiEventsRounded />}
          label="Yutuqlar"
          value={currentTeacher.achievementsCount || 0}
          color="#d97706"
        />
      </Box>

      {/* Ish joylari ro'yxati */}
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="h6">Ish joylari</Typography>
        </Stack>

        {loading ? (
          <Loader label="Ish joylari yuklanmoqda..." />
        ) : teacherJobs?.length === 0 ? (
          <EmptyState
            icon={<WorkRounded />}
            title="Ish joylari mavjud emas"
            description="Bu o'qituvchi uchun ish joylari qo'shilmagan"
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              p: 3,
            }}
          >
            {teacherJobs?.map((job) => (
              <Card
                key={job._id}
                component={Link}
                to={`/teachers/${id}/jobs/${job._id}`}
                sx={{
                  textDecoration: "none",
                  transition: "transform .15s ease, box-shadow .15s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 28px rgba(15,23,42,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: alpha("#2563eb", 0.12),
                        color: "#2563eb",
                        flexShrink: 0,
                      }}
                    >
                      <WorkRounded />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        noWrap
                      >
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.workplace}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {new Date(job.createdAt).toLocaleDateString("uz-UZ")}
                      </Typography>
                    </Box>
                    <VisibilityRounded
                      sx={{ color: "text.disabled", flexShrink: 0 }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TeacherDetail;

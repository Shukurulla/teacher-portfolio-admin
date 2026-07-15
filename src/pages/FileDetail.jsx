import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {
  fetchFileById,
  updateFile,
  fetchFilePreview,
  clearCurrentFile,
} from "../store/slices/fileSlice";
import { toast } from "react-hot-toast";
import { StatusChip, Loader } from "../components/ui";
import { TeacherCell } from "../components";

const InfoRow = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.25 }}>
      {children}
    </Typography>
  </Box>
);

const FileDetail = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentFile: fileData,
    loading,
    error,
  } = useSelector((state) => state.files);
  const { admin } = useSelector((state) => state.auth);

  const [resultMessage, setResultMessage] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);

  const currentFile = fileData?.data || null;

  useEffect(() => {
    dispatch(fetchFileById(fileId));
    dispatch(fetchFilePreview(fileId));
    return () => {
      dispatch(clearCurrentFile());
    };
  }, [dispatch, fileId]);

  useEffect(() => {
    if (currentFile) {
      setResultMessage(currentFile.resultMessage || "");
      setSelectedRatings((currentFile.files || []).map(() => ""));
    }
  }, [currentFile]);

  const handleApprove = () => {
    const achRatings = currentFile?.achievments?.ratings || [];
    if (
      selectedRatings.length !== currentFile?.files?.length ||
      selectedRatings.some((v) => v === "" || v == null)
    ) {
      toast.error("Har bir hujjat uchun toifani tanlang");
      return;
    }
    const ratings = selectedRatings.map((ri) => {
      const r = achRatings[Number(ri)];
      return { about: r.about, rating: r.rating };
    });
    dispatch(
      updateFile({
        id: fileId,
        data: {
          status: "Tasdiqlandi",
          resultMessage,
          inspector: admin?._id,
          ratings,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Fayl muvaffaqiyatli tasdiqlandi");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err || "Faylni tasdiqlashda xatolik yuz berdi");
      });
  };

  const handleReject = () => {
    if (!resultMessage.trim()) {
      toast.error("Iltimos, rad etish sababini kiriting");
      return;
    }
    dispatch(
      updateFile({
        id: fileId,
        data: {
          status: "Tasdiqlanmadi",
          resultMessage,
          inspector: admin?._id,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Fayl rad etildi");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err || "Faylni rad etishda xatolik yuz berdi");
      });
  };

  const renderSingleFile = (file, idx) => {
    const fileUrl = `https://server.portfolio-sport.uz${file.fileUrl}`;
    const ext = file.fileUrl?.split(".").pop()?.toLowerCase() || "";

    let preview;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      preview = (
        <Box
          component="img"
          src={fileUrl}
          alt={file.fileTitle}
          sx={{ maxWidth: "100%", maxHeight: 500, objectFit: "contain", borderRadius: 2 }}
        />
      );
    } else if (ext === "pdf") {
      preview = (
        <Box
          component="iframe"
          src={fileUrl}
          title={file.fileTitle}
          sx={{ width: "100%", height: 600, border: 0, borderRadius: 2 }}
        />
      );
    } else if (["mp4", "webm"].includes(ext)) {
      preview = (
        <Box component="video" controls sx={{ maxWidth: "100%", maxHeight: 500 }}>
          <source src={fileUrl} type={`video/${ext}`} />
        </Box>
      );
    } else if (["mp3", "wav", "ogg"].includes(ext)) {
      preview = (
        <Box component="audio" controls>
          <source src={fileUrl} type={`audio/${ext}`} />
        </Box>
      );
    } else {
      preview = (
        <Button
          variant="contained"
          href={fileUrl}
          download
          startIcon={<DownloadRoundedIcon />}
        >
          Faylni yuklab olish
        </Button>
      );
    }

    return (
      <Box
        key={file._id || idx}
        sx={{ mb: 3, pb: 3, borderBottom: "1px solid", borderColor: "divider", "&:last-of-type": { border: 0, mb: 0, pb: 0 } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography variant="subtitle2">{file.fileTitle}</Typography>
          {file.rating?.rating != null && (
            <StatusChip status="Tasdiqlandi" />
          )}
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "center" }}>{preview}</Box>
      </Box>
    );
  };

  if (loading && !currentFile) return <Loader height={400} />;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!currentFile) {
    return <Alert severity="warning">Fayl topilmadi.</Alert>;
  }

  const totalBall =
    currentFile.files?.reduce((sum, f) => sum + (f.rating?.rating || 0), 0) || 0;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackRoundedIcon />}
          color="inherit"
        >
          Orqaga
        </Button>
        <Typography variant="h5">Hujjat ma'lumotlari</Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* Preview */}
        <Card>
          <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6">Fayl ko'rinishi</Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Loader height={300} />
            ) : (
              currentFile.files?.map(renderSingleFile)
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <Stack spacing={2.5}>
          <Card>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="h6">Hujjat haqida</Typography>
            </Box>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, display: "block", mb: 0.75 }}
                  >
                    O'qituvchi
                  </Typography>
                  <TeacherCell
                    id={currentFile.from?.id}
                    firstName={currentFile.from?.firstName}
                    lastName={currentFile.from?.lastName}
                  />
                </Box>
                <InfoRow label="Yutuq">{currentFile.achievments?.title}</InfoRow>
                <InfoRow label="Bo'lim">{currentFile.achievments?.section}</InfoRow>
                <InfoRow label="Jami ball">
                  <Typography component="span" sx={{ fontWeight: 800, color: "primary.main" }}>
                    {totalBall || "—"}
                  </Typography>
                </InfoRow>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
                    Holat
                  </Typography>
                  <StatusChip status={currentFile.status} />
                </Box>
                <InfoRow label="Yuborilgan sana">
                  {new Date(currentFile.createdAt).toLocaleDateString("uz-UZ")}
                </InfoRow>
              </Stack>
            </CardContent>
          </Card>

          {currentFile.status === "Tekshirilmoqda" && (
            <Card>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6">Baholash</Typography>
              </Box>
              <CardContent>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Har bir hujjat uchun toifani tanlang
                    </Typography>
                    <Stack spacing={1.5}>
                      {currentFile.files?.map((f, idx) => (
                        <TextField
                          key={f._id || idx}
                          select
                          size="small"
                          fullWidth
                          label={f.fileTitle}
                          value={selectedRatings[idx] ?? ""}
                          onChange={(e) => {
                            const next = [...selectedRatings];
                            next[idx] = e.target.value;
                            setSelectedRatings(next);
                          }}
                        >
                          <MenuItem value="">
                            <em>Toifani tanlang</em>
                          </MenuItem>
                          {currentFile.achievments?.ratings?.map((r, ri) => (
                            <MenuItem key={r._id || ri} value={ri}>
                              {r.rating} ball — {r.about}
                            </MenuItem>
                          ))}
                        </TextField>
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  <TextField
                    label="Natija xabari"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Natija haqida xabar yozing..."
                    value={resultMessage}
                    onChange={(e) => setResultMessage(e.target.value)}
                  />

                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleRoundedIcon />}
                      onClick={handleApprove}
                      fullWidth
                    >
                      Tasdiqlash
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelRoundedIcon />}
                      onClick={handleReject}
                      fullWidth
                    >
                      Rad etish
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {currentFile.status !== "Tekshirilmoqda" && currentFile.resultMessage && (
            <Card>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6">Natija xabari</Typography>
              </Box>
              <CardContent>
                <Typography variant="body2">{currentFile.resultMessage}</Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default FileDetail;

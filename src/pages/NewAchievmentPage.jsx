import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { fetchNewFiles } from "../store/slices/fileSlice";
import { PageHeader, StatusChip, Loader, EmptyState } from "../components/ui";
import { TeacherCell } from "../components";
import { formatDate } from "../utils/format";

const NewAchievementsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { newFiles: achievements, loading } = useSelector(
    (state) => state.files
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchNewFiles());
  }, [dispatch]);

  const list = Array.isArray(achievements) ? achievements : [];
  const filtered = list.filter((file) => {
    const name = `${file.from?.firstName ?? ""} ${
      file.from?.lastName ?? ""
    }`.toLowerCase();
    return name.includes(query.trim().toLowerCase());
  });

  return (
    <Box>
      <PageHeader
        title="Yangi hujjatlar"
        subtitle="Tekshirish uchun kutilayotgan hujjatlar"
      />

      <Card>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {loading ? "Yuklanmoqda..." : `Jami: ${filtered.length}`}
          </Typography>
          <TextField
            size="small"
            placeholder="O'qituvchi bo'yicha qidirish"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 280 } }}
          />
        </Stack>

        {loading ? (
          <Loader label="Hujjatlar yuklanmoqda..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<InboxRoundedIcon />}
            title={query ? "Natija topilmadi" : "Yangi hujjatlar yo'q"}
            description={
              query
                ? "Boshqa ism bilan qidirib ko'ring"
                : "Hozircha tekshirish uchun yangi hujjatlar topilmadi"
            }
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>O'qituvchi</TableCell>
                  <TableCell>Yutuq</TableCell>
                  <TableCell>Sana</TableCell>
                  <TableCell>Holat</TableCell>
                  <TableCell align="right">Amal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((file) => (
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
                    <TableCell
                      sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                    >
                      {formatDate(file.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={file.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<VisibilityRoundedIcon />}>
                        Ko'rish
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

export default NewAchievementsPage;

import { useEffect, useState } from "react";
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
  Pagination,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { toast } from "react-hot-toast";
import { PageHeader, StatusChip, Loader, EmptyState, SoftChip } from "./ui";
import TeacherCell from "./TeacherCell";
import { formatDate } from "../utils/format";

const LIMIT = 10;

const FilesTablePage = ({ title, subtitle, emptyTitle, fetcher }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  // qidiruvni kechiktirish (debounce) + sahifani boshiga qaytarish
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetcher(page, LIMIT, debounced);
        if (!active) return;
        setItems(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || 0);
      } catch {
        if (active) toast.error("Ma'lumotlarni olishda xatolik");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debounced]);

  return (
    <Box>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          !loading && <SoftChip label={`Jami: ${total}`} color="#2563eb" />
        }
      />

      <Card>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <TextField
            size="small"
            placeholder="O'qituvchi bo'yicha qidirish"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Loader label="Hujjatlar yuklanmoqda..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<InboxRoundedIcon />}
            title={query ? "Natija topilmadi" : emptyTitle}
            description={
              query ? "Boshqa ism bilan qidirib ko'ring" : "Hozircha hujjat yo'q"
            }
          />
        ) : (
          <>
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
                  {items.map((file) => (
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
                        <Button size="small" startIcon={<VisibilityRoundedIcon />}>
                          Ko'rish
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {totalPages > 1 && (
              <Stack alignItems="center" sx={{ py: 2.5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            )}
          </>
        )}
      </Card>
    </Box>
  );
};

export default FilesTablePage;

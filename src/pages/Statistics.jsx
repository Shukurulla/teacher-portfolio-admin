import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Divider,
  LinearProgress,
  Chip,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { toast } from "react-hot-toast";
import { getTeachers } from "../services/phase2Service";
import { PageHeader, Loader, EmptyState } from "../components/ui";

const FILIALS = [
  { key: "Toshkent", name: "JTSBMQTMO Instituti", color: "#2563eb" },
  { key: "Nukus", name: "Nukus filiali", color: "#d97706" },
  { key: "Fargʻona", name: "Fargʻona filiali", color: "#7c3aed" },
  { key: "Samarqand", name: "Samarqand filiali", color: "#0891b2" },
];

const PROVINCE_TO_FILIAL = {
  "Toshkent shahri": "Toshkent",
  "Toshkent viloyati": "Toshkent",
  "Jizzax viloyati": "Toshkent",
  "Sirdaryo viloyati": "Toshkent",
  "Qoraqalpog'iston Respublikasi": "Nukus",
  "Xorazm viloyati": "Nukus",
  "Buxoro viloyati": "Nukus",
  "Samarqand viloyati": "Samarqand",
  "Qashqadaryo viloyati": "Samarqand",
  "Navoiy viloyati": "Samarqand",
  "Surxondaryo viloyati": "Samarqand",
  "Fargʻona viloyati": "Fargʻona",
  "Andijon viloyati": "Fargʻona",
  "Namangan viloyati": "Fargʻona",
};

// Toifalar o'zaro kesishmaydi — har kim faqat bittasida.
const CATS = [
  {
    key: 1,
    label: "Muqobil malaka oshirish shakli",
    short: "Muqobil shakl",
    desc: "85 va undan yuqori ball",
    color: "#16a34a",
    icon: <CheckCircleRoundedIcon />,
  },
  {
    key: 4,
    label: "Maxsus yutuqlari borlar",
    short: "Maxsus yutuq",
    desc: "Maxsus yutuqi tasdiqlangan",
    color: "#7c3aed",
    icon: <WorkspacePremiumRoundedIcon />,
  },
  {
    key: 2,
    label: "Yakuniy attestatsiyadan ozod",
    short: "Attestatsiyadan ozod",
    desc: "56 dan 84 ballgacha",
    color: "#2563eb",
    icon: <VerifiedRoundedIcon />,
  },
  {
    key: 3,
    label: "Yetarli ball to'play olmaganlar",
    short: "Yetarli emas",
    desc: "0 dan 55 ballgacha",
    color: "#dc2626",
    icon: <ReportProblemRoundedIcon />,
  },
];

const categoryOf = (tp, hasSpecial) => {
  if (hasSpecial) return 4;
  if (tp >= 85) return 1;
  if (tp >= 56) return 2;
  return 3;
};

// 0 ga bo'lishdan himoya
const pct = (part, total) =>
  !total ? 0 : Math.round((part / total) * 1000) / 10;

const filialName = (key) => FILIALS.find((f) => f.key === key)?.name || key;
const filialColor = (key) => FILIALS.find((f) => f.key === key)?.color || "#64748b";

/* ---------- Kichik komponentlar ---------- */

// Katta, bir qarashda o'qiladigan toifa kartasi
const CatCard = ({ cat, count, total, onClick }) => {
  const p = pct(count, total);
  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        borderTop: `4px solid ${cat.color}`,
        transition: "transform .15s, box-shadow .15s",
        "&:hover": onClick
          ? { transform: "translateY(-3px)", boxShadow: "0 10px 28px rgba(15,23,42,.10)" }
          : {},
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(cat.color, 0.12),
              color: cat.color,
              flexShrink: 0,
            }}
          >
            {cat.icon}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
            {cat.short}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: cat.color }}>
            {count.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            nafar
          </Typography>
          <Box flex={1} />
          <Typography variant="subtitle2" sx={{ color: cat.color }}>
            {p}%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={p}
          sx={{
            mt: 1.25,
            height: 6,
            borderRadius: 3,
            bgcolor: alpha(cat.color, 0.14),
            "& .MuiLinearProgress-bar": { bgcolor: cat.color, borderRadius: 3 },
          }}
        />
        <Typography variant="caption" color="text.secondary" mt={1} display="block">
          {cat.desc}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Toifa bo'yicha kichik raqamlar qatori (jadval kataklari uchun)
const CatChip = ({ cat, value }) => (
  <Chip
    size="small"
    label={value}
    sx={{
      minWidth: 44,
      bgcolor: alpha(cat.color, 0.12),
      color: cat.color,
      fontWeight: 700,
    }}
  />
);

/* ---------- Asosiy sahifa ---------- */

const Statistics = () => {
  const { admin } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilial, setSelectedFilial] = useState(null);

  const isSuperAdmin = admin?.role === "superadmin";
  const currentFilial = isSuperAdmin ? selectedFilial : admin?.filial || null;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ts = await getTeachers();
        setTeachers(Array.isArray(ts) ? ts : []);
      } catch {
        toast.error("Ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const withCat = teachers.map((t) => {
    const tp = t.totalPoints || 0;
    const hasSpecial = !!t.hasSpecial;
    return { ...t, tp, hasSpecial, cat: categoryOf(tp, hasSpecial) };
  });

  // Ko'rilayotgan to'plam: super admin filial tanlamagan bo'lsa — hammasi
  const scope = currentFilial
    ? withCat.filter((t) => t.region?.region === currentFilial)
    : withCat;

  const total = scope.length;
  const countOf = (key, list = scope) => list.filter((t) => t.cat === key).length;

  const donutData = (
    currentFilial
      ? CATS.map((c) => ({
          name: c.short,
          value: countOf(c.key),
          color: c.color,
        }))
      : FILIALS.map((f) => ({
          name: f.name,
          value: withCat.filter((t) => t.region?.region === f.key).length,
          color: f.color,
          filialKey: f.key,
        }))
  ).filter((d) => d.value > 0);

  const filialRows = FILIALS.map((f) => {
    const list = withCat.filter((t) => t.region?.region === f.key);
    return {
      ...f,
      total: list.length,
      c1: countOf(1, list),
      c4: countOf(4, list),
      c2: countOf(2, list),
      c3: countOf(3, list),
      share: pct(list.length, withCat.length),
    };
  });

  const provinceRows = currentFilial
    ? Object.entries(PROVINCE_TO_FILIAL)
        .filter(([, f]) => f === currentFilial)
        .map(([province]) => {
          const list = withCat.filter((t) => t.region?.title === province);
          return {
            name: province,
            total: list.length,
            c1: countOf(1, list),
            c4: countOf(4, list),
            c2: countOf(2, list),
            c3: countOf(3, list),
          };
        })
    : [];

  if (loading) return <Loader label="Statistika yuklanmoqda..." />;

  return (
    <Box>
      <PageHeader
        title="Statistika"
        subtitle={
          currentFilial
            ? `${filialName(currentFilial)} — hududlar kesimida`
            : "Institut va filiallar kesimida umumiy ko'rsatkichlar"
        }
        action={
          isSuperAdmin && currentFilial ? (
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => setSelectedFilial(null)}
            >
              Barcha filiallar
            </Button>
          ) : null
        }
      />

      {total === 0 ? (
        <Card>
          <EmptyState
            icon={<GroupsRoundedIcon />}
            title="Ma'lumot yo'q"
            description="Bu bo'lim bo'yicha hozircha mutaxassislar ro'yxatga olinmagan"
          />
        </Card>
      ) : (
        <>
          {/* 1-qator: jami + toifalar */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(5,1fr)" },
              gap: 2.5,
              mb: 3,
            }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(255,255,255,.16)",
                    }}
                  >
                    <GroupsRoundedIcon />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.85 }}>
                    Jami mutaxassis
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {total.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {currentFilial ? filialName(currentFilial) : "Institut va 3 ta filial"}
                </Typography>
              </CardContent>
            </Card>

            {CATS.map((c) => (
              <CatCard
                key={c.key}
                cat={c}
                count={countOf(c.key)}
                total={total}
                onClick={() => navigate("/criteria")}
              />
            ))}
          </Box>

          {/* 2-qator: donut + tafsilot */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(320px,420px) 1fr" },
              gap: 2.5,
              mb: 3,
              alignItems: "stretch",
            }}
          >
            <Card>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6">
                  {currentFilial ? "Toifalar bo'yicha" : "Filiallar bo'yicha"}
                </Typography>
                {!currentFilial && isSuperAdmin && (
                  <Typography variant="caption" color="text.secondary">
                    Bo'lakni bosing — filial tafsilotiga o'tadi
                  </Typography>
                )}
              </Box>
              <CardContent>
                <Box sx={{ position: "relative", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={82}
                        outerRadius={122}
                        paddingAngle={3}
                        dataKey="value"
                        onClick={(d) =>
                          !currentFilial &&
                          isSuperAdmin &&
                          d?.filialKey &&
                          setSelectedFilial(d.filialKey)
                        }
                        style={{
                          cursor: !currentFilial && isSuperAdmin ? "pointer" : "default",
                        }}
                      >
                        {donutData.map((d, i) => (
                          <Cell key={i} fill={d.color} stroke="#fff" strokeWidth={3} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <Paper sx={{ p: 1.5, border: "1px solid", borderColor: "divider" }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {payload[0].name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {payload[0].value} nafar ·{" "}
                                {pct(payload[0].value, total)}%
                              </Typography>
                            </Paper>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {total.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        nafar
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  {donutData.map((d, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1.25}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: d.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap>
                        {d.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {d.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ width: 44, textAlign: "right" }}>
                        {pct(d.value, total)}%
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Jadval: filiallar yoki hududlar */}
            <Card>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6">
                  {currentFilial
                    ? `${filialName(currentFilial)} — hududlar`
                    : "Filiallar bo'yicha batafsil"}
                </Typography>
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{currentFilial ? "Hudud" : "Filial"}</TableCell>
                      <TableCell align="center">Jami</TableCell>
                      {CATS.map((c) => (
                        <TableCell key={c.key} align="center">
                          {c.short}
                        </TableCell>
                      ))}
                      {!currentFilial && <TableCell align="center">Ulush</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(currentFilial ? provinceRows : filialRows).map((row) => (
                      <TableRow
                        key={row.name || row.key}
                        hover
                        sx={{ cursor: !currentFilial && isSuperAdmin ? "pointer" : "default" }}
                        onClick={() =>
                          !currentFilial && isSuperAdmin && setSelectedFilial(row.key)
                        }
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {!currentFilial && (
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  bgcolor: row.color,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {row.name}
                            </Typography>
                            {!currentFilial && isSuperAdmin && (
                              <ChevronRightRoundedIcon
                                fontSize="small"
                                sx={{ color: "text.disabled" }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {row.total}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <CatChip cat={CATS[0]} value={row.c1} />
                        </TableCell>
                        <TableCell align="center">
                          <CatChip cat={CATS[1]} value={row.c4} />
                        </TableCell>
                        <TableCell align="center">
                          <CatChip cat={CATS[2]} value={row.c2} />
                        </TableCell>
                        <TableCell align="center">
                          <CatChip cat={CATS[3]} value={row.c3} />
                        </TableCell>
                        {!currentFilial && (
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">
                              {row.share}%
                            </Typography>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Statistics;

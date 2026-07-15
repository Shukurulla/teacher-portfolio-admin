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
  Tabs,
  Tab,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { toast } from "react-hot-toast";
import { getTeachers, getSpecialAll } from "../services/phase2Service";
import { PageHeader, StatCard, Loader, EmptyState, SoftChip } from "../components/ui";
import { TeacherCell } from "../components";

const FILIAL_NAMES = {
  Nukus: "Nukus Filiali",
  Fargʻona: "Fargʻona Filiali",
  Samarqand: "Samarqand Filiali",
  Toshkent: "JTSBMQTMO Instituti",
};

const CATS = [
  {
    key: 1,
    label: "Muqobil malaka oshirish shakliga o'tganlar",
    short: "Muqobil shakl",
    desc: "85+ ball yoki maxsus yutug'i bor",
    color: "#16a34a",
    icon: <CheckCircleRoundedIcon />,
  },
  {
    key: 2,
    label: "Yakuniy attestatsiyadan ozod qilinganlar",
    short: "Attestatsiyadan ozod",
    desc: "56 – 84 ball",
    color: "#2563eb",
    icon: <VerifiedRoundedIcon />,
  },
  {
    key: 3,
    label: "Yetarli ball to'play olmaganlar",
    short: "Yetarli emas",
    desc: "56 balldan kam",
    color: "#dc2626",
    icon: <ReportProblemRoundedIcon />,
  },
];

const categoryOf = (tp, hasSpecial) =>
  tp >= 85 || hasSpecial ? 1 : tp >= 56 ? 2 : 3;

const Criteria = () => {
  const [teachers, setTeachers] = useState([]);
  const [specialSet, setSpecialSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [ts, specials] = await Promise.all([
          getTeachers(),
          getSpecialAll(),
        ]);
        setTeachers(Array.isArray(ts) ? ts : []);
        const s = new Set(
          (specials || [])
            .filter((x) => x.status === "Tasdiqlandi")
            .map((x) => x.from?.id?.toString())
        );
        setSpecialSet(s);
      } catch {
        toast.error("Ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const withCat = teachers.map((t) => {
    const tp = t.totalPoints || 0;
    const hasSpecial = specialSet.has(t._id?.toString());
    return { ...t, tp, hasSpecial, cat: categoryOf(tp, hasSpecial) };
  });
  const countOf = (k) => withCat.filter((t) => t.cat === k).length;

  const activeCat = CATS[tab];
  const filtered = withCat
    .filter((t) => t.cat === activeCat.key)
    .sort((a, b) => b.tp - a.tp);

  return (
    <Box>
      <PageHeader
        title="Baholash mezoni bo'yicha"
        subtitle="O'qituvchilar to'plagan bali va maxsus yutug'iga ko'ra toifalarga ajratilgan"
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
              gap: 2.5,
              mb: 3,
            }}
          >
            {CATS.map((c, i) => (
              <StatCard
                key={c.key}
                icon={c.icon}
                label={c.short}
                value={countOf(c.key)}
                color={c.color}
                hint={c.desc}
                onClick={() => setTab(i)}
              />
            ))}
          </Box>

          <Card>
            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              {CATS.map((c) => (
                <Tab key={c.key} label={`${c.short} (${countOf(c.key)})`} />
              ))}
            </Tabs>

            <Box sx={{ px: 3, py: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2">{activeCat.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {activeCat.desc}
              </Typography>
            </Box>

            {filtered.length === 0 ? (
              <EmptyState title="Bu toifada o'qituvchi yo'q" />
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>O'qituvchi</TableCell>
                      <TableCell>Filial</TableCell>
                      <TableCell align="center">Maxsus yutuq</TableCell>
                      <TableCell align="center">Jami ball</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((t) => (
                      <TableRow key={t._id} hover>
                        <TableCell>
                          <TeacherCell
                            id={t._id}
                            firstName={t.firstName}
                            lastName={t.lastName}
                            image={t.profileImage}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {FILIAL_NAMES[t.region?.region] || t.region?.region || "—"}
                        </TableCell>
                        <TableCell align="center">
                          {t.hasSpecial ? (
                            <SoftChip label="Bor" color="#16a34a" />
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontWeight: 800, color: activeCat.color }}>
                            {t.tp}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Card>
        </>
      )}
    </Box>
  );
};

export default Criteria;

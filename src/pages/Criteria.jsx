import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { toast } from "react-hot-toast";
import { getTeachers, getSpecialAll } from "../services/phase2Service";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import {
  PageHeader,
  StatCard,
  Loader,
  EmptyState,
  SoftChip,
} from "../components/ui";
import { TeacherCell } from "../components";
import { formatDate } from "../utils/format";

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
    desc: "85 va undan yuqori ball yoki maxsus yutuq",
    color: "#16a34a",
    icon: <CheckCircleRoundedIcon />,
  },
  {
    key: 4,
    label: "Maxsus yutuqlari borlar",
    short: "Maxsus yutuqlar",
    desc: "Maxsus yutuqi tasdiqlangan",
    color: "#7c3aed",
    icon: <WorkspacePremiumRoundedIcon />,
  },
  {
    key: 2,
    label: "Yakuniy attestatsiyadan ozod qilinganlar",
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
  // 1. Muqobil shakl: 85+ ball yoki maxsus yutuq
  if (tp >= 85 || hasSpecial) return 1;
  // 2. Attestatsiyadan ozod: 56-84 ball (85 dan kam)
  if (tp >= 56 && tp < 85) return 2;
  // 3. Yetarli emas: 0-55 ball (56 dan kam)
  if (tp >= 0 && tp < 56) return 3;
  return 3;
};

const directions = [
  "I.Sport taʼlim muassasalari rahbar va oʻrinbosarlari",
  "II. Sport taʼlim muassasalari yoʻriqchi-uslubchilari  ",
  "III. Sport turlarini rivojlantirish respublika markazlari, Olimpiya va paralimpiya sport turlariga tayyorlash markazlari, ixtisoslashtirilgan sport maktablari, ixtisoslashtirilgan olimpiya zaxiralari maktablari trenerlari",
  "IV. Sport maktablari trenerlari",
  "V. Sport psixologlari",
  "VI. Oliy taʼlim muassasalarining jismoniy tarbiya va sport yoʻnalishlari boʻyicha rahbar va pedagog kadrlari",
  "VII. Kasbiy taʼlim tashkilotlari jismoniy tarbiya fani oʻqituvchilari(jismoniy tarbiya va sportga ixtisoslashtirilganlar bundan mustasno)",
  "VIII. Umumiy oʻrta va oʻrta maxsus taʼlim tashkilotlari jismoniy tarbiya fani oʻqituvchilari",
  "IX. Maktabgacha taʼlim tashkilotlari jismoniy tarbiya yuriqchilari",
];

// O'zbekiston viloyatlari
const provinces = [
  { title: "Toshkent shahri", region: "Toshkent" },
  { title: "Toshkent viloyati", region: "Toshkent" },
  { title: "Jizzax viloyati", region: "Toshkent" },
  { title: "Sirdaryo viloyati", region: "Toshkent" },
  { title: "Qoraqalpog'iston Respublikasi", region: "Nukus" },
  { title: "Xorazm viloyati", region: "Nukus" },
  { title: "Buxoro viloyati", region: "Nukus" },
  { title: "Samarqand viloyati", region: "Samarqand" },
  { title: "Qashqadaryo viloyati", region: "Samarqand" },
  { title: "Navoiy viloyati", region: "Samarqand" },
  { title: "Surxondaryo viloyati", region: "Samarqand" },
  { title: "Fargʻona viloyati", region: "Fargʻona" },
  { title: "Andijon viloyati", region: "Fargʻona" },
  { title: "Namangan viloyati", region: "Fargʻona" },
];

// O'zbekiston tumanlari
const DISTRICTS = {
  "Toshkent shahri": [
    "Bektemir tumani",
    "Chilonzor tumani",
    "Mirobod tumani",
    "Mirzo Ulug'bek tumani",
    "Olmazor tumani",
    "Sergeli tumani",
    "Shayxontohur tumani",
    "Uchtepa tumani",
    "Yashnobod tumani",
    "Yakkasaroy tumani",
    "Yunusobod tumani",
  ],
  "Toshkent viloyati": [
    "Angren shahri",
    "Bekobod shahri",
    "Chirchiq shahri",
    "Nurafshon shahri",
    "Olmaliq shahri",
    "Ohangaron shahri",
    "Yangiyoʻl shahri",
    "Akkurgan tumani",
    "Bekobod tumani",
    "Boʻka tumani",
    "Boʻstonliq tumani",
    "Chinoz tumani",
    "Oʻrtachirchiq tumani",
    "Ohangaron tumani",
    "Parkent tumani",
    "Piskent tumani",
    "Qibray tumani",
    "Quyichirchiq tumani",
    "Toshkent tumani",
    "Yangiyo'l tumani",
    "Yuqorichirchiq tumani",
    "Zangiota tumani",
  ],
  "Jizzax viloyati": [
    "Jizzax shahri",
    "Arnasoy tumani",
    "Baxmal tumani",
    "Do'stlik tumani",
    "Forish tumani",
    "G'allaorol tumani",
    "Mirzacho'l tumani",
    "Paxtakor tumani",
    "Sharof Rashidov tumani",
    "Yangiobod tumani",
    "Zomin tumani",
    "Zafarobod tumani",
  ],
  "Sirdaryo viloyati": [
    "Guliston shahri",
    "Shirin shahri",
    "Yangiyer shahri",
    "Boyovut tumani",
    "Guliston tumani",
    "Mirzaobod tumani",
    "Oqoltin tumani",
    "Sardoba tumani",
    "Sayxunobod tumani",
    "Sirdaryo tumani",
    "Xovos tumani",
  ],
  "Qoraqalpog'iston Respublikasi": [
    "Nukus shahri",
    "Beruniy tumani",
    "Qonliko'l tumani",
    "Qorao'zak tumani",
    "Kegeyli tumani",
    "Mo'ynoq tumani",
    "Nukus tumani",
    "Taxtako'pir tumani",
    "To'rtko'l tumani",
    "Xo'jayli tumani",
    "Chimboy tumani",
    "Sho'manoy tumani",
    "Ellikqal'a tumani",
    "Amudaryo tumani",
    "Bo'zatov tumani",
  ],
  "Xorazm viloyati": [
    "Urganch shahri",
    "Xiva shahri",
    "Bog'ot tumani",
    "Gurlan tumani",
    "Xonqa tumani",
    "Xazorasp tumani",
    "Qo'shko'pir tumani",
    "Shovot tumani",
    "Urganch tumani",
    "Yangiariq tumani",
    "Yangibozor tumani",
  ],
  "Buxoro viloyati": [
    "Buxoro shahri",
    "Kogon shahri",
    "Buxoro tumani",
    "Vobkent tumani",
    "G'ijduvon tumani",
    "Jondor tumani",
    "Kogon tumani",
    "Olot tumani",
    "Peshku tumani",
    "Qorako'l tumani",
    "Qorovulbozor tumani",
    "Romitan tumani",
    "Shofirkon tumani",
  ],
  "Samarqand viloyati": [
    "Samarqand shahri",
    "Kattaqo'rg'on shahri",
    "Oqdaryo tumani",
    "Bulung'ur tumani",
    "Jomboy tumani",
    "Ishtixon tumani",
    "Kattaqo'rg'on tumani",
    "Narpay tumani",
    "Nurobod tumani",
    "Paxtachi tumani",
    "Payariq tumani",
    "Pastdarg'om tumani",
    "Samarqand tumani",
    "Toyloq tumani",
    "Urgut tumani",
  ],
  "Qashqadaryo viloyati": [
    "Qarshi shahri",
    "Shahrisabz shahri",
    "Chiroqchi tumani",
    "Dehqonobod tumani",
    "G'uzor tumani",
    "Kasbi tumani",
    "Kitob tumani",
    "Koson tumani",
    "Mirishkor tumani",
    "Muborak tumani",
    "Nishon tumani",
    "Qamashi tumani",
    "Qarshi tumani",
    "Shahrisabz tumani",
    "Yakkabog' tumani",
  ],
  "Navoiy viloyati": [
    "Navoiy shahri",
    "Zarafshon shahri",
    "Karmana tumani",
    "Konimex tumani",
    "Xatirchi tumani",
    "Navbahor tumani",
    "Nurota tumani",
    "Tomdi tumani",
    "Uchquduq tumani",
    "Qiziltepa tumani",
  ],
  "Surxondaryo viloyati": [
    "Termiz shahri",
    "Angor tumani",
    "Boysun tumani",
    "Denov tumani",
    "Jarqo'rg'on tumani",
    "Qiziriq tumani",
    "Qumqo'rg'on tumani",
    "Muzrobod tumani",
    "Oltinsoy tumani",
    "Sariosiyo tumani",
    "Sherobod tumani",
    "Sho'rchi tumani",
    "Termiz tumani",
    "Uzun tumani",
  ],
  "Fargʻona viloyati": [
    "Farg'ona shahri",
    "Marg'ilon shahri",
    "Qo'qon shahri",
    "Beshariq tumani",
    "Bog'dod tumani",
    "Buvayda tumani",
    "Dang'ara tumani",
    "Farg'ona tumani",
    "Furqat tumani",
    "O'zbekiston tumani",
    "Oltiariq tumani",
    "Qo'shtepa tumani",
    "Quva tumani",
    "Rishton tumani",
    "So'x tumani",
    "Toshloq tumani",
    "Uchko'prik tumani",
    "Yozyovon tumani",
  ],
  "Andijon viloyati": [
    "Andijon shahri",
    "Xonobod shahri",
    "Andijon tumani",
    "Asaka tumani",
    "Baliqchi tumani",
    "Bo'z tumani",
    "Buloqboshi tumani",
    "Jalaquduq tumani",
    "Izboskan tumani",
    "Qo'rg'ontepa tumani",
    "Marhamat tumani",
    "Oltinko'l tumani",
    "Paxtaobod tumani",
    "Ulug'nor tumani",
    "Xo'jaobod tumani",
  ],
  "Namangan viloyati": [
    "Namangan shahri",
    "Chortoq tumani",
    "Chust tumani",
    "Kosonsoy tumani",
    "Mingbuloq tumani",
    "Namangan tumani",
    "Norin tumani",
    "Pop tumani",
    "To'raqo'rg'on tumani",
    "Uchqo'rg'on tumani",
    "Uychi tumani",
    "Yangiqo'rg'on tumani",
  ],
};

const Criteria = () => {
  const { admin } = useSelector((state) => state.auth);
  const [teachers, setTeachers] = useState([]);
  const [specialSet, setSpecialSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [selectedFilial, setSelectedFilial] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");

  const isSuperAdmin = admin?.role === "superadmin";

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
            .map((x) => x.from?.id?.toString()),
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
    const hasSpecial = t.hasSpecial || specialSet.has(t._id?.toString());
    return { ...t, tp, hasSpecial, cat: categoryOf(tp, hasSpecial) };
  });

  // Filter logic
  let filtered = withCat;

  // Filial bo'yicha filterlash (superadmin uchun)
  if (isSuperAdmin && selectedFilial) {
    filtered = filtered.filter((t) => t.region?.region === selectedFilial);
  }

  // Viloyat bo'yicha filterlash
  if (selectedProvince) {
    filtered = filtered.filter((t) => t.region?.title === selectedProvince);
  }

  // Tuman bo'yicha filterlash
  if (selectedDistrict) {
    filtered = filtered.filter((t) => t.district === selectedDistrict);
  }

  // Lavozim bo'yicha filterlash
  if (selectedDirection) {
    filtered = filtered.filter((t) => {
      // teacher'ning job'lari ichida selectedDirection bor yoki yo'qligini tekshirish
      return t.jobs?.some((job) => job.title === selectedDirection);
    });
  }

  const countOf = (k) => {
    if (k === 4) {
      // Maxsus yutuqlari borlar
      return filtered.filter((t) => t.hasSpecial).length;
    }
    return filtered.filter((t) => t.cat === k).length;
  };

  const activeCat = CATS[tab];
  const filteredByCategory =
    activeCat.key === 4
      ? filtered.filter((t) => t.hasSpecial).sort((a, b) => b.tp - a.tp)
      : filtered
          .filter((t) => t.cat === activeCat.key)
          .sort((a, b) => b.tp - a.tp);

  // Barcha filiallar (static list)
  const allFilials = ["Toshkent", "Nukus", "Fargʻona", "Samarqand"];

  // Barcha viloyatlar (static list)
  const allProvinces = provinces.map((p) => p.title).sort();

  // Tanlangan viloyatga tegishli tumanlar
  const allDistricts = selectedProvince
    ? DISTRICTS[selectedProvince] || []
    : [];

  return (
    <Box>
      <PageHeader
        title="Baholash mezoni bo'yicha"
        subtitle="Mutaxassislar to'plagan bali va maxsus yutug'iga ko'ra toifalarga ajratilgan"
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Filter Section */}
          <Card sx={{ mb: 3, p: 2.5 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              useFlexGap
            >
              {isSuperAdmin && (
                <TextField
                  select
                  label="Filial bo'yicha"
                  value={selectedFilial}
                  onChange={(e) => {
                    setSelectedFilial(e.target.value);
                    setSelectedProvince("");
                    setSelectedDistrict("");
                  }}
                  sx={{ minWidth: 200 }}
                  size="small"
                >
                  <MenuItem value="">
                    <em>Barchasi</em>
                  </MenuItem>
                  {allFilials.map((filial) => (
                    <MenuItem key={filial} value={filial}>
                      {FILIAL_NAMES[filial] || filial}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                select
                label="Viloyat bo'yicha"
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                }}
                sx={{ minWidth: 200 }}
                size="small"
              >
                <MenuItem value="">
                  <em>Barchasi</em>
                </MenuItem>
                {allProvinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Tuman bo'yicha"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                sx={{ minWidth: 200 }}
                size="small"
              >
                <MenuItem value="">
                  <em>Barchasi</em>
                </MenuItem>
                {allDistricts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Lavozim bo'yicha"
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value)}
                sx={{ minWidth: 250 }}
                size="small"
              >
                <MenuItem value="">
                  <em>Barchasi</em>
                </MenuItem>
                {directions.map((direction, idx) => (
                  <MenuItem key={idx} value={direction}>
                    {direction}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Card>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4,1fr)" },
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

            {filteredByCategory.length === 0 ? (
              <EmptyState title="Bu toifada mutaxassis yo'q" />
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mutaxassis</TableCell>
                      <TableCell>Filial</TableCell>
                      <TableCell>Viloyat</TableCell>
                      <TableCell>Tuman</TableCell>
                      <TableCell>Lavozim</TableCell>
                      <TableCell align="center">Yutuqlar</TableCell>
                      <TableCell align="center">Maxsus yutuq</TableCell>
                      <TableCell>Malaka rejasi</TableCell>
                      <TableCell align="center">Jami ball</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredByCategory.map((t) => (
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
                          {FILIAL_NAMES[t.region?.region] ||
                            t.region?.region ||
                            "—"}
                        </TableCell>
                        <TableCell
                          sx={{ color: "text.secondary", minWidth: 160 }}
                        >
                          {t.region?.title || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {t.district || "—"}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "text.secondary",
                            minWidth: 200,
                            maxWidth: 350,
                          }}
                        >
                          {t.jobs && t.jobs.length > 0 ? (
                            <Typography
                              variant="body2"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {t.jobs[0].title}
                            </Typography>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontWeight: 700 }}>
                            {t.approvedAchievementsCount || 0}
                          </Typography>
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
                        <TableCell sx={{ minWidth: 260, maxWidth: 360 }}>
                          {t.nextMalaka ? (
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700 }}
                              >
                                {formatDate(t.nextMalaka.date)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t.nextMalaka.province ||
                                  "Viloyat ko'rsatilmagan"}
                              </Typography>
                              {t.nextMalaka.direction && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  sx={{ mt: 0.5, lineHeight: 1.35 }}
                                >
                                  {t.nextMalaka.direction}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              Reja yo'q
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            sx={{ fontWeight: 800, color: activeCat.color }}
                          >
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

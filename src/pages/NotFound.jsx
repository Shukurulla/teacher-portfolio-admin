import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 3,
        bgcolor: "background.default",
      }}
    >
      <Stack alignItems="center" spacing={2} textAlign="center">
        <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 80, color: "text.disabled" }} />
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          404
        </Typography>
        <Typography variant="h6">Sahifa topilmadi</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeRoundedIcon />}
          onClick={() => navigate("/")}
        >
          Bosh sahifaga qaytish
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFound;

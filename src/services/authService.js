import api from "../api/api";
import { toast } from "react-hot-toast";

// Admin tizimga kirishi
export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials);

    if (response.data.status === "success") {
      // Token va admin ma'lumotlarini saqlash
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.data.admin));

      toast.success("Tizimga muvaffaqiyatli kirdingiz");
      return response.data.data;
    }
  } catch (error) {
    const message =
      error.response?.data?.message || "Tizimga kirishda xatolik yuz berdi";
    toast.error(message);
    throw error;
  }
};

// Admin profilini olish
export const getAdminProfile = async () => {
  try {
    const response = await api.get("/admin/profile");
    return response.data.data;
  } catch (error) {
    toast.error("Admin profilini olishda xatolik yuz berdi");
    throw error;
  }
};

// Tizimdan chiqish
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  toast.success("Tizimdan muvaffaqiyatli chiqdingiz");
};

// Foydalanuvchi tizimga kirganligini tekshirish
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Admin ma'lumotlarini olish
export const getAdmin = () => {
  const admin = localStorage.getItem("admin");
  return admin ? JSON.parse(admin) : null;
};

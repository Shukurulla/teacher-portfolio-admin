import api from "../api/api";
import { toast } from "react-hot-toast";

// Barcha yutuqlarni olish
export const getAchievements = async (jobId) => {
  try {
    const response = await api.get(`/achievments/${jobId}`);
    return response.data.data;
  } catch (error) {
    toast.error("Yutuqlar ro'yxatini olishda xatolik yuz berdi");
    throw error;
  }
};

// Yangi yutuq qo'shish
export const createAchievement = async (data) => {
  try {
    const response = await api.post("/achievments", data);
    toast.success("Yutuq muvaffaqiyatli qo'shildi");
    return response.data.data;
  } catch (error) {
    toast.error("Yutuq qo'shishda xatolik yuz berdi");
    throw error;
  }
};

// Yutuqni o'chirish
export const deleteAchievement = async (id) => {
  try {
    const response = await api.delete(`/achievments/delete/${id}`);
    toast.success("Yutuq muvaffaqiyatli o'chirildi");
    return response.data;
  } catch (error) {
    toast.error("Yutuqni o'chirishda xatolik yuz berdi");
    throw error;
  }
};

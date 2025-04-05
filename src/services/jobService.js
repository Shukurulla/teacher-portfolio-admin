import api from "../api/api";
import { toast } from "react-hot-toast";

// Ish ma'lumotlarini ID bo'yicha olish
export const getJobById = async (id) => {
  try {
    const response = await api.get(`/job/${id}`);
    return response.data;
  } catch (error) {
    toast.error("Ish ma'lumotlarini olishda xatolik yuz berdi");
    throw error;
  }
};

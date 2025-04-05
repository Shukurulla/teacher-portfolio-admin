import api from "../api/api";
import { toast } from "react-hot-toast";

// Yangi fayllarni olish
export const getNewFiles = async () => {
  try {
    const response = await api.get("/new-files");
    console.log(response.data.data);

    return response.data.data;
  } catch (error) {
    toast.error("Yangi fayllarni olishda xatolik yuz berdi");
    throw error;
  }
};

// Barcha fayllarni olish
export const getAllFiles = async () => {
  try {
    const response = await api.get("/files");
    console.log(response.data);

    return response.data;
  } catch (error) {
    toast.error("Fayllar ro'yxatini olishda xatolik yuz berdi");
    throw error;
  }
};

// Fayl ma'lumotlarini ID bo'yicha olish
export const getFileById = async (id) => {
  try {
    const response = await api.get(`/file/${id}`);
    return response.data;
  } catch (error) {
    toast.error("Fayl ma'lumotlarini olishda xatolik yuz berdi");
    throw error;
  }
};

// Fayl holatini yangilash (tasdiqlash/rad etish)
export const updateFileStatus = async (id, data) => {
  try {
    const response = await api.patch(`/files/${id}`, data);
    toast.success(
      data.status === "Tasdiqlandi"
        ? "Fayl muvaffaqiyatli tasdiqlandi"
        : "Fayl rad etildi"
    );
    return response.data;
  } catch (error) {
    toast.error("Fayl holatini yangilashda xatolik yuz berdi");
    throw error;
  }
};

// Fayl ko'rish ma'lumotlarini olish
export const getFilePreview = async (id) => {
  try {
    const response = await api.get(`/preview/${id}`);
    return response.data;
  } catch (error) {
    toast.error("Fayl ko'rish ma'lumotlarini olishda xatolik yuz berdi");
    throw error;
  }
};

// Faylni o'chirish
export const deleteFile = async (id) => {
  try {
    const response = await api.delete(`/file/delete/${id}`);
    toast.success("Fayl muvaffaqiyatli o'chirildi");
    return response.data;
  } catch (error) {
    toast.error("Faylni o'chirishda xatolik yuz berdi");
    throw error;
  }
};

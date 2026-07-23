import api from "../api/api";
import { toast } from "react-hot-toast";

// Barcha mutaxassislarni olish
export const getAllTeachers = async () => {
  try {
    const response = await api.get("/teachers");
    return response.data;
  } catch (error) {
    toast.error("Mutaxassislar ro'yxatini olishda xatolik yuz berdi");
    throw error;
  }
};

// Mutaxassis ma'lumotlarini ID bo'yicha olish
export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/teacher/${id}`);
    return response.data;
  } catch (error) {
    toast.error("Mutaxassis ma'lumotlarini olishda xatolik yuz berdi");
    throw error;
  }
};

// Mutaxassisning ish joylarini olish
export const getTeacherJobs = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/${teacherId}/jobs`);
    return response.data;
  } catch (error) {
    toast.error("Mutaxassis ish joylarini olishda xatolik yuz berdi");
    throw error;
  }
};

// Mutaxassisning yutuqlarini olish
export const getTeacherAchievements = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/${teacherId}/achievements`);
    return response.data;
  } catch (error) {
    toast.error("Mutaxassis yutuqlarini olishda xatolik yuz berdi");
    throw error;
  }
};

// Mutaxassisni o'chirish
export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/teacher/delete/${id}`);
    toast.success("Mutaxassis muvaffaqiyatli o'chirildi");
    return response.data;
  } catch (error) {
    toast.error("Mutaxassisni o'chirishda xatolik yuz berdi");
    throw error;
  }
};

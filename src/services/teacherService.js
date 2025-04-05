import api from "../api/api";
import { toast } from "react-hot-toast";

// Barcha o'qituvchilarni olish
export const getAllTeachers = async () => {
  try {
    const response = await api.get("/teachers");
    return response.data;
  } catch (error) {
    toast.error("O'qituvchilar ro'yxatini olishda xatolik yuz berdi");
    throw error;
  }
};

// O'qituvchi ma'lumotlarini ID bo'yicha olish
export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/teacher/${id}`);
    return response.data;
  } catch (error) {
    toast.error("O'qituvchi ma'lumotlarini olishda xatolik yuz berdi");
    throw error;
  }
};

// O'qituvchining ish joylarini olish
export const getTeacherJobs = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/${teacherId}/jobs`);
    return response.data;
  } catch (error) {
    toast.error("O'qituvchi ish joylarini olishda xatolik yuz berdi");
    throw error;
  }
};

// O'qituvchining yutuqlarini olish
export const getTeacherAchievements = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/${teacherId}/achievements`);
    return response.data;
  } catch (error) {
    toast.error("O'qituvchi yutuqlarini olishda xatolik yuz berdi");
    throw error;
  }
};

// O'qituvchini o'chirish
export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/teacher/delete/${id}`);
    toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
    return response.data;
  } catch (error) {
    toast.error("O'qituvchini o'chirishda xatolik yuz berdi");
    throw error;
  }
};

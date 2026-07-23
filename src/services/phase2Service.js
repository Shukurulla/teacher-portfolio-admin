import api from "../api/api";

// 18-band maxsus yutuqlar
export const getSpecialNew = async () =>
  (await api.get("/special/new")).data.data;
export const getSpecialAll = async () => (await api.get("/special")).data.data;
export const reviewSpecial = async (id, status, resultMessage) =>
  (await api.post(`/special/review/${id}`, { status, resultMessage })).data;

// Malaka oshirish
export const getMalaka = async () => (await api.get("/malaka")).data.data;

// Baholash mezoni uchun mutaxassislar (totalPoints bilan)
export const getTeachers = async () => (await api.get("/teachers")).data;

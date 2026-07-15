import api from "../api/api";

// Filiallar bo'yicha umumiy ko'rinish (adminlar + sanoqlar)
export const getFilials = async () => {
  const res = await api.get("/admin/filials");
  return res.data.data;
};

// Barcha adminlar
export const getAdmins = async () => {
  const res = await api.get("/admin/list");
  return res.data.data;
};

// Filialga admin tayinlash
export const createAdmin = async (payload) => {
  const res = await api.post("/admin/create", payload);
  return res.data.data;
};

// Adminni tahrirlash
export const updateAdmin = async (id, payload) => {
  const res = await api.put(`/admin/${id}`, payload);
  return res.data.data;
};

// Adminni o'chirish
export const deleteAdmin = async (id) => {
  const res = await api.delete(`/admin/${id}`);
  return res.data;
};

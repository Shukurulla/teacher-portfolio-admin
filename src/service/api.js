import axios from "axios";

axios.defaults.baseURL = "https://teacher-portfolio-server.vercel.app";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("teacher-admin")
    ? localStorage.getItem("teacher-admin")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});
export default axios;

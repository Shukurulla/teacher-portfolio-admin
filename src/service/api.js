import axios from "axios";

axios.defaults.baseURL = "http://localhost:7474";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("teacher-admin")
    ? localStorage.getItem("teacher-admin")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});
export default axios;

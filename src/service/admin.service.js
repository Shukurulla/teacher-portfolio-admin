import toast from "react-hot-toast";
import {
  getAdminFailure,
  getAdminStart,
  getAdminSuccess,
} from "../slice/admin.slice";
import axios from "./api.js";

const AdminService = {
  async getAdminByToken(dispatch) {
    dispatch(getAdminStart());
    try {
      const { data } = await axios.get("/admin/profile");
      dispatch(getAdminSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getAdminFailure());
    }
  },
  async loginAdmin(dispatch, value, navigate) {
    dispatch(getAdminStart());
    try {
      const { data } = await axios.post("/admin/login", value);
      dispatch(getAdminSuccess(data.data.data));

      localStorage.setItem("teacher-admin", data.data.token);
      toast.success("Profilga muaffaqiyatli kirildi");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(getAdminFailure());
    }
  },
};

export default AdminService;

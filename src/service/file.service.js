import { toast } from "react-hot-toast";
import {
  getFilesFailure,
  getFilesStart,
  getFilesSuccess,
} from "../slice/file.slice";
import axios from "./api.js";

const FilesService = {
  async getFiles(dispatch) {
    dispatch(getFilesStart());
    try {
      const { data } = await axios.get("/file/my-files/");
      dispatch(getFilesSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getFilesFailure());
    }
  },
  async postFiles(dispatch, value) {
    dispatch(getFilesStart());
    try {
      const { data } = await axios.post("/file/upload", value);
      if (data.status == "success") {
        const { data } = await axios.get("/file/my-files/");
        dispatch(getFilesSuccess(data.data));
      }
      toast.success(`Yutuq muaffaqiyatli qoshildi`);
    } catch (error) {
      console.log(error);
      dispatch(getFilesFailure());
    }
  },
};

export default FilesService;

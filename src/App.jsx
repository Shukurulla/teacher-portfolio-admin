import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import { useDispatch } from "react-redux";
import AdminService from "./service/admin.service";
import Login from "./pages/login";
import { Toaster } from "react-hot-toast";
import TeachersSystemPage from "./pages/teachers";
import TeacherProfilePage from "./pages/teacher-profile";
const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("teacher-admin");
    if (!token) {
      console.log(token);

      return navigate("/login");
    }
    AdminService.getAdminByToken(dispatch);
  }, []);

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout activePage={<Home />} />} />
        <Route
          path="/teachers"
          element={<Layout activePage={<TeachersSystemPage />} />}
        />
        <Route
          path="/teachers/:teacherId"
          element={<Layout activePage={<TeacherProfilePage />} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;

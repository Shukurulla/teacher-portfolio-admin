import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";

// Layouts
import AdminLayout from "./layout/AdminLayout";

// Pages
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import TeacherList from "./pages/teacherList.jsx";
import TeacherDetail from "./pages/teacherDetail.jsx";
import JobDetail from "./pages/jobDetail.jsx";
import FileDetail from "./pages/fileDetail.jsx";
import NotFound from "./pages/notFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NewAchievementsPage from "./pages/newAchievmentPage.jsx";
import ApprovedFilesPage from "./pages/approvedFiles.page.jsx";
import RejectedFilesPage from "./pages/rejectedFiles.page.jsx";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="teachers" element={<TeacherList />} />
            <Route path="teachers/:id" element={<TeacherDetail />} />
            <Route
              path="teachers/:teacherId/jobs/:jobId"
              element={<JobDetail />}
            />
            <Route path="files/:fileId" element={<FileDetail />} />
            <Route path="/new-files" element={<NewAchievementsPage />} />
            <Route path="/approved" element={<ApprovedFilesPage />} />
            <Route path="/rejected" element={<RejectedFilesPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

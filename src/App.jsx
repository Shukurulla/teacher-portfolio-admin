import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";

// Layouts
import AdminLayout from "./layout/AdminLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherList from "./pages/TeacherList";
import TeacherDetail from "./pages/TeacherDetail";
import JobDetail from "./pages/JobDetail";
import FileDetail from "./pages/FileDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import NewAchievementsPage from "./pages/NewAchievmentPage";
import ApprovedFilesPage from "./pages/ApprovedFiles.page";
import RejectedFilesPage from "./pages/RejectedFiles.page";

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

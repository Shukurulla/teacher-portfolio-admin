import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";

// Layouts
import AdminLayout from "./layout/AdminLayout";
import {
  ApprovedFilesPage,
  Dashboard,
  FileDetail,
  JobDetail,
  Login,
  NewAchievementsPage,
  NotFound,
  RejectedFilesPage,
  TeacherList,
  TeacterDetail,
  SuperAdminFilials,
  SpecialReview,
  MalakaList,
  Criteria,
} from "./pages";
import { ProtectedRoute } from "./components";

// Pages

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-center" />
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
            <Route path="filials" element={<SuperAdminFilials />} />
            <Route path="teachers" element={<TeacherList />} />
            <Route path="teachers/:id" element={<TeacterDetail />} />
            <Route
              path="teachers/:teacherId/jobs/:jobId"
              element={<JobDetail />}
            />
            <Route path="files/:fileId" element={<FileDetail />} />
            <Route path="/new-files" element={<NewAchievementsPage />} />
            <Route path="/approved" element={<ApprovedFilesPage />} />
            <Route path="/rejected" element={<RejectedFilesPage />} />
            <Route path="/special-review" element={<SpecialReview />} />
            <Route path="/malaka" element={<MalakaList />} />
            <Route path="/criteria" element={<Criteria />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { fetchNewFiles } from "../store/slices/fileSlice";
import { FiUsers, FiFileText, FiCheck, FiX, FiClock } from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { teachers, loading: teachersLoading } = useSelector(
    (state) => state.teachers
  );
  const { newFiles, loading: filesLoading } = useSelector(
    (state) => state.files
  );

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchNewFiles());
  }, [dispatch]);

  // Calculate file counts by status
  const pendingFiles =
    newFiles?.filter((file) => file.status === "Tekshirilmoqda") || [];
  const approvedFiles =
    newFiles?.filter((file) => file.status === "Tasdiqlandi") || [];
  const rejectedFiles =
    newFiles?.filter((file) => file.status === "Rad etildi") || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Boshqaruv paneli</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Teachers Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">O'qituvchilar</h2>
              <p className="text-2xl font-semibold">
                {teachersLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  teachers?.length || 0
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/teachers"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>

        {/* New Files Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <FiClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Yangi yutuqlar</h2>
              <p className="text-2xl font-semibold">
                {filesLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  pendingFiles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/new-files"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>

        {/* Approved Files Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <FiCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Tasdiqlanganlar</h2>
              <p className="text-2xl font-semibold">
                {filesLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  approvedFiles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/approved"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>

        {/* Rejected Files Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <FiX className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Rad etilganlar</h2>
              <p className="text-2xl font-semibold">
                {filesLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  rejectedFiles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/rejected"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Files Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">So'nggi yutuqlar</h2>
          <Link
            to="/files"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Barchasini ko'rish →
          </Link>
        </div>

        {filesLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Fayllar yuklanmoqda...</p>
          </div>
        ) : newFiles?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Yangi yutuqlar mavjud emas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    O'qituvchi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yutuq
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newFiles?.slice(0, 5).map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {file.from.firstName} {file.from.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {file.achievments.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {file.achievments.section}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.createdAt).toLocaleDateString("uz-UZ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          file.status === "Tasdiqlandi"
                            ? "bg-green-100 text-green-800"
                            : file.status === "Rad etildi"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {file.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/files/${file._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ko'rish
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

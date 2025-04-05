"use client";

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById, clearCurrentJob } from "../store/slices/jobSlice";

const JobDetail = () => {
  const { teacherId, jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, jobFiles, loading, error } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchJobById(jobId));

    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, jobId]);

  if (loading && !currentJob) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Xatolik!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Diqqat!</strong>
        <span className="block sm:inline"> Ish joyi topilmadi.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/teachers/${teacherId}`)}
            className="mr-4 text-blue-500 hover:text-blue-700"
          >
            ← Orqaga
          </button>
          <h1 className="text-2xl font-bold">Ish joyi ma'lumotlari</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold">{currentJob.title}</h2>
          <p className="text-gray-600 mt-2">
            <span className="font-medium">Ish joyi:</span>{" "}
            {currentJob.workplace}
          </p>
          <p className="text-gray-600 mt-2">
            <span className="font-medium">Qo'shilgan sana:</span>{" "}
            {new Date(currentJob.createdAt).toLocaleDateString("uz-UZ")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">Yuborilgan fayllar</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Fayllar yuklanmoqda...</p>
          </div>
        ) : jobFiles?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Fayllar mavjud emas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Yutuq
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bo'lim
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ball
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Holat
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sana
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobFiles?.map((file) => (
                  <tr key={file._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {file.achievments.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {file.achievments.section}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {file.achievments.rating.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          file.status === "Tasdiqlandi"
                            ? "bg-green-100 text-green-800"
                            : file.status === "Tasdiqlanmadi"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {file.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.createdAt).toLocaleDateString("uz-UZ")}
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

export default JobDetail;

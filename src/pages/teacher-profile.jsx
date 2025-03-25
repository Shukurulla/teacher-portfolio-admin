import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiAward,
  FiBriefcase,
  FiArrowLeft,
  FiPhone,
  FiFile,
  FiCheck,
  FiX,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { changePage } from "../slice/ui.slice";

const TeacherProfilePage = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const [teacherRes, jobsRes, achievementsRes] = await Promise.all([
          axios.get(`/teacher/${teacherId}`),
          axios.get(`/teacher/${teacherId}/jobs`),
          axios.get(`/teacher/${teacherId}/achievements`),
        ]);

        setTeacher(teacherRes.data);
        setJobs(jobsRes.data);
        setAchievements(achievementsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Ma'lumotlarni yuklashda xato:", err);
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changePage("O'qituvchilar"));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Tasdiqlandi":
        return {
          icon: <FiCheck className="mr-1" />,
          color: "bg-green-100 text-green-800",
        };
      case "Tasdiqlanmadi":
        return {
          icon: <FiX className="mr-1" />,
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: <FiClock className="mr-1" />,
          color: "bg-yellow-100 text-yellow-800",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800">
            O'qituvchi topilmadi
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-10xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Orqaga
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <img
                src={teacher.profileImage}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-800">
                {teacher.firstName} {teacher.lastName}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <FiPhone className="mr-2" />
                <span>{teacher.phone}</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-indigo-600">Ish joylari</div>
                  <div className="font-bold text-indigo-800">
                    {jobs.length} ta
                  </div>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-green-600">Yutuqlar</div>
                  <div className="font-bold text-green-800">
                    {achievements.length} ta
                  </div>
                </div>
                <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-yellow-600">Umumiy ball</div>
                  <div className="font-bold text-yellow-800">
                    {achievements.reduce(
                      (sum, ach) =>
                        sum + (ach.achievments?.rating?.rating || 0),
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 font-medium ${
              activeTab === "jobs"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            Ish joylari
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 font-medium ${
              activeTab === "achievements"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            Yutuqlar
          </button>
        </div>

        {activeTab === "jobs" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <h3 className="font-bold text-lg text-gray-800">
                      {job.workplace}
                    </h3>
                    <p className="text-gray-600">{job.title}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Ish joylari mavjud emas
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.length > 0 ? (
              achievements.map((achievement) => {
                const statusBadge = getStatusBadge(achievement.status);
                return (
                  <div
                    key={achievement._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">
                        {achievement.achievments.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${statusBadge.color}`}
                      >
                        {statusBadge.icon}
                        {achievement.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {achievement.achievments.section}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-700">
                        <FiStar className="text-yellow-500 mr-1" />
                        <span>
                          {achievement.achievments.rating.ratingTitle}:{" "}
                          {achievement.achievments.rating.rating}/5
                        </span>
                      </div>
                      <a
                        href={achievement.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        <FiFile className="mr-1" />
                        Yuklab olish
                      </a>
                    </div>

                    {achievement.resultMessage && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <span className="font-medium">Admin sharhi: </span>
                        {achievement.resultMessage}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Yutuqlar mavjud emas
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfilePage;

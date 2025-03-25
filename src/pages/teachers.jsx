import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiAward,
  FiBriefcase,
  FiSearch,
  FiFile,
  FiInfo,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { changePage } from "../slice/ui.slice";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changePage("O'qituvchilar"));

    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/teachers");
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("O'qituvchilarni yuklashda xato:", err);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            O'qituvchilar Tizimi
          </h1>

          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="O'qituvchi ismi bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border-l-4 border-indigo-500"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="mr-4">
                      <img
                        src={teacher.profileImage}
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-gray-600">{teacher.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <FiBriefcase className="mr-3 text-indigo-500" />
                        <span>{teacher.jobsCount || 0} ta ish joyi</span>
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                        {teacher.totalPoints || 0} ball
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiAward className="mr-3 text-indigo-500" />
                      <span>{teacher.achievementsCount || 0} ta yutuq</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/teachers/${teacher._id}`)}
                    className="flex border-indigo-600 border-[1px] px-3 py-1 rounded-2 mt-4 items-center text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <FiInfo className="mr-2" />
                    Koʻrish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                O'qituvchilar topilmadi
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Qidiruv bo'yicha hech narsa topilmadi"
                  : "Tizimda o'qituvchilar mavjud emas"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDownload,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiFile,
  FiUser,
  FiAward,
  FiStar,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { changePage } from "../slice/ui.slice";

const AdminFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalType, setModalType] = useState(null); // 'tasdiqlash', 'rad etish', 'fikr', 'koʻrish'
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("/files");
        const sortedFiles = response.data.sort((a, b) => {
          if (a.status === "Tekshirilmoqda" && b.status !== "Tekshirilmoqda")
            return -1;
          if (a.status !== "Tekshirilmoqda" && b.status === "Tekshirilmoqda")
            return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setFiles(sortedFiles);
        setLoading(false);
      } catch (err) {
        console.error("Fayllarni yuklashda xato:", err);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changePage("Bosh sahifa"));
  }, []);

  const handleStatusChange = async (status) => {
    try {
      await axios.patch(`/files/${selectedFile._id}`, {
        status,
        resultMessage:
          status === "Tasdiqlanmadi"
            ? feedbackMessage
            : selectedFile.resultMessage,
      });
      setFiles(
        files.map((file) =>
          file._id === selectedFile._id
            ? {
                ...file,
                status,
                resultMessage:
                  status === "Tasdiqlanmadi"
                    ? feedbackMessage
                    : file.resultMessage,
              }
            : file
        )
      );
      closeModal();
    } catch (err) {
      console.error("Statusni yangilashda xato:", err);
    }
  };

  const handleViewFile = async (file) => {
    try {
      setSelectedFile(file);
      // Haqiqiy loyihada fayl kontentini yuklash kerak
      setFileContent({
        url: file.fileUrl,
        type: file.fileName?.split(".").pop() || "file",
      });
      setModalType("koʻrish");
    } catch (err) {
      console.error("Faylni yuklashda xato:", err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedFile(null);
    setFeedbackMessage("");
    setFileContent(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Tasdiqlandi":
        return "bg-green-100 text-green-800";
      case "Tasdiqlanmadi":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-10xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Oʻqituvchi Portfoliolari
          </h1>
          <div className="text-sm text-gray-500">
            {files.filter((f) => f.status === "Tekshirilmoqda").length} ta
            tekshirish kutilmoqda
          </div>
        </div>

        <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-2 gap-6">
          {files.map((file) => (
            <div
              key={file._id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg
                ${
                  file.status === "Tekshirilmoqda"
                    ? "border-l-4 border-yellow-500"
                    : ""
                }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <FiUser className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">
                        {file.from.firstName} {file.from.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {file.from.job.title}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      file.status
                    )}`}
                  >
                    {file.status === "Tasdiqlandi"
                      ? "Tasdiqlangan"
                      : file.status === "Tasdiqlanmadi"
                      ? "Rad etilgan"
                      : "Tekshirilmoqda"}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FiAward className="mr-2" />
                    <span className="font-medium">Yutuq:</span>
                    <span className="ml-1">{file.achievments.title}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiStar className="mr-2" />
                    <span className="font-medium">Baholash:</span>
                    <span className="ml-1">
                      {file.achievments.rating.ratingTitle} (
                      {file.achievments.rating.rating}/5)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <button
                    onClick={() => handleViewFile(file)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <FiFile className="mr-2" />
                    Koʻrish
                  </button>

                  {file.status === "Tekshirilmoqda" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedFile(file);
                          setModalType("tasdiqlash");
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                        title="Tasdiqlash"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(file);
                          setModalType("rad etish");
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Rad etish"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal oynasi */}
      {(modalType || fileContent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Tasdiqlash modali */}
            {modalType === "tasdiqlash" && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Topshiriqni Tasdiqlash
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedFile.from.firstName} {selectedFile.from.lastName}
                  ning topshiriqni tasdiqlamoqchimisiz?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={() => handleStatusChange("Tasdiqlandi")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    <FiCheck className="mr-2" />
                    Tasdiqlash
                  </button>
                </div>
              </div>
            )}

            {/* Rad etish modali */}
            {modalType === "rad etish" && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Topshiriqni Rad Etish
                </h3>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={() => handleStatusChange("Tasdiqlanmadi")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                  >
                    <FiX className="mr-2" />
                    Rad etish
                  </button>
                </div>
              </div>
            )}

            {/* Fikr qoldirish modali */}
            {modalType === "fikr" && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Fikr Qoldirish
                </h3>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Fikringizni yozing..."
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={() => {
                      handleResultMessage(selectedFile._id, feedbackMessage);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                  >
                    <FiMessageSquare className="mr-2" />
                    Saqlash
                  </button>
                </div>
              </div>
            )}

            {/* Faylni ko'rish modali */}
            {modalType === "koʻrish" && selectedFile && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedFile.from.firstName}ning topshirig'i
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        O'qituvchi
                      </h4>
                      <p className="text-gray-900">
                        {selectedFile.from.firstName}{" "}
                        {selectedFile.from.lastName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Lavozim
                      </h4>
                      <p className="text-gray-900">
                        {selectedFile.from.job.title}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Yutuq
                      </h4>
                      <p className="text-gray-900">
                        {selectedFile.achievments.title}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Baholash
                      </h4>
                      <p className="text-gray-900">
                        {selectedFile.achievments.rating.ratingTitle} (
                        {selectedFile.achievments.rating.rating}/5)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fayl ko'rinishi */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Fayl ko'rinishi
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-48">
                    {fileContent ? (
                      fileContent.type.match(/^image/) ? (
                        <img
                          src={fileContent.url}
                          alt="Ko'rish"
                          className="max-h-64 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center py-8">
                          <FiFile
                            size={48}
                            className="mx-auto text-gray-400 mb-2"
                          />
                          <p className="text-gray-500">
                            Fileni korishni iloji yoq
                          </p>
                          <a
                            href={fileContent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center mt-2"
                          >
                            <FiDownload className="mr-1" />
                            Yuklab olish
                          </a>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                        <p className="text-gray-500">Yuklanmoqda...</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedFile.status === "Tekshirilmoqda" && (
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setModalType("rad etish");
                        setFeedbackMessage(selectedFile.resultMessage || "");
                      }}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center"
                    >
                      <FiX className="mr-2" />
                      Rad etish
                    </button>
                    <button
                      onClick={() => {
                        setModalType("tasdiqlash");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                    >
                      <FiCheck className="mr-2" />
                      Tasdiqlash
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFilesPage;

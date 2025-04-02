"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiCheck,
  FiX,
  FiFile,
  FiUser,
  FiAward,
  FiStar,
  FiChevronRight,
  FiBriefcase,
  FiClock,
  FiDownload,
  FiFileText,
  FiImage,
  FiPaperclip,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { changePage } from "../slice/ui.slice";
import { Document, Page, pdfjs } from "react-pdf";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminTeachersPage = () => {
  const [files, setFiles] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [showTeacherAchievements, setShowTeacherAchievements] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changePage("Bosh sahifa"));
  }, []);

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

        // Group files by teacher
        const teacherMap = {};
        sortedFiles.forEach((file) => {
          const teacherId = file.from._id;
          if (!teacherMap[teacherId]) {
            teacherMap[teacherId] = {
              ...file.from,
              achievements: [],
              pendingCount: 0,
            };
          }
          teacherMap[teacherId].achievements.push(file);
          if (file.status === "Tekshirilmoqda") {
            teacherMap[teacherId].pendingCount++;
          }
        });

        // Convert to array and sort by pending count
        const teachersArray = Object.values(teacherMap).sort(
          (a, b) => b.pendingCount - a.pendingCount
        );

        setTeachers(teachersArray);
        setLoading(false);
      } catch (err) {
        console.error("O'qituvchilarni yuklashda xato:", err);
        setLoading(false);
      }
    };

    fetchFiles();
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

      // Update files state
      const updatedFiles = files.map((file) =>
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
      );
      setFiles(updatedFiles);

      // Update teachers state
      const updatedTeachers = teachers.map((teacher) => {
        if (teacher._id === selectedFile.from._id) {
          const updatedAchievements = teacher.achievements.map((achievement) =>
            achievement._id === selectedFile._id
              ? {
                  ...achievement,
                  status,
                  resultMessage:
                    status === "Tasdiqlanmadi"
                      ? feedbackMessage
                      : achievement.resultMessage,
                }
              : achievement
          );

          // Recalculate pending count
          const pendingCount = updatedAchievements.filter(
            (a) => a.status === "Tekshirilmoqda"
          ).length;

          return {
            ...teacher,
            achievements: updatedAchievements,
            pendingCount,
          };
        }
        return teacher;
      });

      setTeachers(updatedTeachers);
      closeModal();
    } catch (err) {
      console.error("Statusni yangilashda xato:", err);
    }
  };

  const handleViewFile = async (file) => {
    try {
      setSelectedFile(file);
      setPageNumber(1); // Reset PDF page number

      // Get file extension from fileName or from URL
      const fileExtension = file.fileName
        ? file.fileName.split(".").pop().toLowerCase()
        : file.fileUrl.split(".").pop().toLowerCase();

      setFileContent({
        url: file.fileUrl,
        type: fileExtension || "unknown",
      });

      setModalType("koʻrish");
    } catch (err) {
      console.error("Faylni yuklashda xato:", err);
    }
  };

  const handleViewTeacherAchievements = (teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherAchievements(true);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedFile(null);
    setFeedbackMessage("");
    setFileContent(null);
    setNumPages(null);
    setPageNumber(1);
  };

  const closeTeacherAchievements = () => {
    setShowTeacherAchievements(false);
    setSelectedTeacher(null);
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

  const getFileIcon = (fileType) => {
    if (!fileType) return <FiPaperclip />;

    const type = fileType.toLowerCase();
    if (type === "pdf") return <FiFileText />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(type))
      return <FiImage />;
    if (["doc", "docx"].includes(type)) return <FiFileText />;
    if (["xls", "xlsx", "csv"].includes(type)) return <FiFileText />;

    return <FiFile />;
  };

  const renderFilePreview = () => {
    if (!fileContent) return null;

    const { url, type } = fileContent;

    // Handle image files
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(type)) {
      return (
        <img
          src={`http://45.134.39.117:7474` + url || "/placeholder.svg"}
          alt="Ko'rish"
          className="max-h-96 max-w-full object-contain"
        />
      );
    }

    // Handle PDF files
    if (type === "pdf") {
      return (
        <div className="pdf-container">
          <Document
            file={"http://45.134.39.117:7474" + url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("PDF yuklashda xato:", error)}
          >
            <Page
              pageNumber={pageNumber}
              width={450}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {numPages && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Oldingi
              </button>

              <p className="text-sm">
                {pageNumber} / {numPages}
              </p>

              <button
                onClick={() =>
                  setPageNumber(Math.min(numPages, pageNumber + 1))
                }
                disabled={pageNumber >= numPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Keyingi
              </button>
            </div>
          )}
        </div>
      );
    }

    // Handle Office documents (Word, Excel, PowerPoint, etc.)
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(type)) {
      return (
        <DocViewer
          documents={[{ uri: `http://45.134.39.117:7474${url}` }]}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false,
            },
          }}
          style={{ height: 500 }}
        />
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="text-center py-8">
        <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center">
          {getFileIcon(type)}
          <p className="text-lg font-medium mt-4 mb-2">
            Bu turdagi faylni ko'rib bo'lmaydi
          </p>
          <p className="text-gray-500 mb-4">Fayl turi: {type.toUpperCase()}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
          >
            <FiDownload className="mr-2" />
            Yuklab olish
          </a>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!showTeacherAchievements ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                O'qituvchilar Ro'yxati
              </h1>
              <div className="text-sm text-gray-500">
                Jami {teachers.length} ta o'qituvchi
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer
                    ${
                      teacher.pendingCount > 0
                        ? "border-l-4 border-yellow-500"
                        : ""
                    }`}
                  onClick={() => handleViewTeacherAchievements(teacher)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-full">
                          <FiUser className="text-indigo-600 text-xl" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">
                            {teacher.firstName} {teacher.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {teacher.job?.title || "O'qituvchi"}
                          </p>
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center text-gray-600">
                        <FiBriefcase className="mr-2" />
                        <span>
                          Jami yutuqlar: {teacher.achievements.length}
                        </span>
                      </div>

                      {teacher.pendingCount > 0 && (
                        <div className="flex items-center">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            <FiClock className="mr-1" />
                            {teacher.pendingCount} ta yangi
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mb-8">
              <button
                onClick={closeTeacherAchievements}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
              >
                <FiChevronRight className="transform rotate-180" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {selectedTeacher.firstName} {selectedTeacher.lastName}
                </h1>
                <p className="text-gray-500">
                  {selectedTeacher.job?.title || "O'qituvchi"}
                </p>
              </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {
                  selectedTeacher.achievements.filter(
                    (f) => f.status === "Tekshirilmoqda"
                  ).length
                }{" "}
                ta tekshirish kutilmoqda
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {selectedTeacher.achievements.map((file) => (
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
                          <FiAward className="text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">
                            {file.achievments.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(file.createdAt).toLocaleDateString()}
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
                      <div className="flex items-center text-sm text-gray-600">
                        <FiStar className="mr-2" />
                        <span className="font-medium">Baholash:</span>
                        <span className="ml-1">
                          {file.achievments.rating.ratingTitle} (
                          {file.achievments.rating.rating}/5)
                        </span>
                      </div>
                      {file.fileName && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          {getFileIcon(file.fileName.split(".").pop())}
                          <span className="ml-2">{file.fileName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(file);
                        }}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition"
                      >
                        <FiFile className="mr-2" />
                        Ko'rish
                      </button>

                      {file.status === "Tekshirilmoqda" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(file);
                              setModalType("tasdiqlash");
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                            title="Tasdiqlash"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
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
          </>
        )}
      </div>

      {/* Modal oynasi */}
      {(modalType || fileContent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Tasdiqlash modali */}
            {modalType === "tasdiqlash" && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Yutuqni Tasdiqlash
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedFile.from.firstName} {selectedFile.from.lastName}
                  ning yutugini tasdiqlamoqchimisiz?
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
                  Yutuqni Rad Etish
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

            {/* Faylni ko'rish modali */}
            {modalType === "koʻrish" && selectedFile && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedFile.from.firstName}ning yutugi
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
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-500">
                      Fayl ko'rinishi
                    </h4>
                    {fileContent && (
                      <a
                        href={`http://45.134.39.117:7474` + fileContent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center text-sm"
                      >
                        <FiDownload className="mr-1" />
                        Yuklab olish
                      </a>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-48">
                    {fileContent ? (
                      renderFilePreview()
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

export default AdminTeachersPage;

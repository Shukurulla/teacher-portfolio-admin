"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFileById,
  updateFile,
  fetchFilePreview,
  clearCurrentFile,
} from "../store/slices/fileSlice";
import { toast } from "react-hot-toast";

const FileDetail = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentFile: fileData,
    filePreview,
    loading,
    error,
  } = useSelector((state) => state.files);

  const [resultMessage, setResultMessage] = useState("");

  // Access the nested data property
  const currentFile = fileData?.data || null;

  useEffect(() => {
    dispatch(fetchFileById(fileId));
    dispatch(fetchFilePreview(fileId));

    return () => {
      dispatch(clearCurrentFile());
    };
  }, [dispatch, fileId]);

  useEffect(() => {
    if (currentFile) {
      setResultMessage(currentFile.resultMessage || "");
    }
  }, [currentFile]);

  const handleApprove = () => {
    dispatch(
      updateFile({
        id: fileId,
        data: {
          status: "Tasdiqlandi",
          resultMessage,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Fayl muvaffaqiyatli tasdiqlandi");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error || "Faylni tasdiqlashda xatolik yuz berdi");
      });
  };

  const handleReject = () => {
    if (!resultMessage.trim()) {
      toast.error("Iltimos, rad etish sababini kiriting");
      return;
    }

    dispatch(
      updateFile({
        id: fileId,
        data: {
          status: "Tasdiqlanmadi",
          resultMessage,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Fayl rad etildi");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error || "Faylni rad etishda xatolik yuz berdi");
      });
  };

  const renderFilePreview = () => {
    if (!filePreview || !currentFile) return null;

    const fileUrl = `https://server.portfolio-sport.uz${currentFile.fileUrl}`;
    const fileType = filePreview.type || "";

    // Extract file extension from filename
    const fileExtension =
      currentFile.fileName?.split(".").pop()?.toLowerCase() || "";

    // Rasmlar uchun
    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return (
        <div className="flex justify-center">
          <img
            src={fileUrl || "/placeholder.svg"}
            alt="Fayl ko'rinishi"
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>
      );
    }

    // PDF uchun
    if (fileExtension === "pdf") {
      return (
        <div className="h-[600px]">
          <iframe
            src={fileUrl}
            className="w-full h-full"
            title="PDF Viewer"
          ></iframe>
        </div>
      );
    }

    // Video uchun
    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <div className="flex justify-center">
          <video controls className="max-w-full max-h-[500px]">
            <source src={fileUrl} type={`video/${fileExtension}`} />
            Brauzeringiz video elementini qo'llab-quvvatlamaydi.
          </video>
        </div>
      );
    }

    // Audio uchun
    if (["mp3", "wav", "ogg"].includes(fileExtension)) {
      return (
        <div className="flex justify-center">
          <audio controls>
            <source src={fileUrl} type={`audio/${fileExtension}`} />
            Brauzeringiz audio elementini qo'llab-quvvatlamaydi.
          </audio>
        </div>
      );
    }

    // Boshqa turdagi fayllar uchun
    return (
      <div className="text-center p-6 bg-gray-100 rounded-lg">
        <p className="text-lg mb-4">
          Bu turdagi faylni brauzerda ko'rib bo'lmaydi.
        </p>
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Faylni yuklab olish
        </a>
      </div>
    );
  };

  if (loading && !currentFile) {
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

  if (!currentFile) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Diqqat!</strong>
        <span className="block sm:inline"> Fayl topilmadi.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-blue-500 hover:text-blue-700"
          >
            ← Orqaga
          </button>
          <h1 className="text-2xl font-bold">Fayl ma'lumotlari</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-lg">Fayl ko'rinishi</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                renderFilePreview()
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-lg">Fayl haqida</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    O'qituvchi
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.from?.firstName} {currentFile.from?.lastName}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Yutuq</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.achievments?.title}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bo'lim</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.achievments?.section}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ball</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.achievments?.rating?.rating}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Holat</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        currentFile.status === "Tasdiqlandi"
                          ? "bg-green-100 text-green-800"
                          : currentFile.status === "Tasdiqlanmadi"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {currentFile.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Yuborilgan sana
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(currentFile.createdAt).toLocaleDateString(
                      "uz-UZ"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {currentFile.status === "Tekshirilmoqda" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-lg">Baholash</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="resultMessage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Natija xabari
                    </label>
                    <textarea
                      id="resultMessage"
                      rows={4}
                      className="mt-1 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Natija haqida xabar yozing..."
                      value={resultMessage}
                      onChange={(e) => setResultMessage(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleApprove}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Tasdiqlash
                    </button>
                    <button
                      onClick={handleReject}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Rad etish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentFile.status !== "Tekshirilmoqda" &&
            currentFile.resultMessage && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">Natija xabari</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-900">
                    {currentFile.resultMessage}
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileDetail;

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
  const { admin } = useSelector((state) => state.auth);

  const [resultMessage, setResultMessage] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);

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
      setSelectedRatings((currentFile.files || []).map(() => ""));
    }
  }, [currentFile]);

  const handleApprove = () => {
    const achRatings = currentFile?.achievments?.ratings || [];
    if (
      selectedRatings.length !== currentFile?.files?.length ||
      selectedRatings.some((v) => v === "" || v == null)
    ) {
      toast.error("Har bir hujjat uchun toifani tanlang");
      return;
    }
    const ratings = selectedRatings.map((ri) => {
      const r = achRatings[Number(ri)];
      return { about: r.about, rating: r.rating };
    });
    dispatch(
      updateFile({
        id: fileId,
        data: {
          status: "Tasdiqlandi",
          resultMessage,
          inspector: admin?._id,
          ratings,
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
          inspector: admin?._id,
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

  const renderSingleFile = (file, idx) => {
    const fileUrl = `https://server.portfolio-sport.uz${file.fileUrl}`;
    const fileExtension = file.fileUrl?.split(".").pop()?.toLowerCase() || "";

    let preview;
    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      preview = (
        <img
          src={fileUrl}
          alt={file.fileTitle}
          className="max-w-full max-h-[500px] object-contain"
        />
      );
    } else if (fileExtension === "pdf") {
      preview = (
        <iframe src={fileUrl} className="w-full h-[600px]" title={file.fileTitle} />
      );
    } else if (["mp4", "webm"].includes(fileExtension)) {
      preview = (
        <video controls className="max-w-full max-h-[500px]">
          <source src={fileUrl} type={`video/${fileExtension}`} />
        </video>
      );
    } else if (["mp3", "wav", "ogg"].includes(fileExtension)) {
      preview = (
        <audio controls>
          <source src={fileUrl} type={`audio/${fileExtension}`} />
        </audio>
      );
    } else {
      preview = (
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Faylni yuklab olish
        </a>
      );
    }

    return (
      <div key={file._id || idx} className="mb-6 border-b pb-4 last:border-b-0">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {file.fileTitle}
        </p>
        <div className="flex justify-center">{preview}</div>
      </div>
    );
  };

  const renderFilePreview = () => {
    if (!currentFile?.files?.length) return null;
    return currentFile.files.map(renderSingleFile);
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Jami ball
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.files?.reduce(
                      (sum, f) => sum + (f.rating?.rating || 0),
                      0
                    ) || "-"}
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
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Har bir hujjat uchun toifani tanlang
                    </h3>
                    {currentFile.files?.map((f, idx) => (
                      <div key={f._id || idx}>
                        <label className="block text-xs text-gray-500 mb-1">
                          {f.fileTitle}
                        </label>
                        <select
                          value={selectedRatings[idx] ?? ""}
                          onChange={(e) => {
                            const next = [...selectedRatings];
                            next[idx] = e.target.value;
                            setSelectedRatings(next);
                          }}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Toifani tanlang</option>
                          {currentFile.achievments?.ratings?.map((r, ri) => (
                            <option key={r._id || ri} value={ri}>
                              {r.rating} ball — {r.about}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

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

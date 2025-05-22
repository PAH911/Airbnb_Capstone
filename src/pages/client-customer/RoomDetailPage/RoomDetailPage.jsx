import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomDetail } from "./roomDetailSlice";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CommentSection from "./CommentSection";
import { motion } from "framer-motion";
import { Spin, Button, message } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";

export default function RoomDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    data: room,
    loading,
    error,
  } = useSelector((state) => state.roomDetail);
  const theme = useSelector((state) => state.theme?.theme || "light");

  useEffect(() => {
    if (id) dispatch(fetchRoomDetail(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          theme === "dark"
            ? "bg-[#18181c] text-white"
            : "bg-gradient-to-br from-rose-50 via-white to-pink-100 text-gray-900"
        }`}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spin size="large" />
        </main>
        <Footer />
      </div>
    );
  }
  if (error || !room) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          theme === "dark"
            ? "bg-[#18181c] text-white"
            : "bg-gradient-to-br from-rose-50 via-white to-pink-100 text-gray-900"
        }`}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-xl">
            {error || "Không tìm thấy phòng."}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-[#18181c] text-white"
          : "bg-gradient-to-br from-rose-50 via-white to-pink-100 text-gray-900"
      }`}
    >
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
        {/* Ảnh phòng */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-3">
            {room.hinhAnh && (
              <img
                src={room.hinhAnh}
                alt={room.tenPhong}
                className="col-span-2 h-64 w-full object-cover rounded-2xl shadow-lg"
              />
            )}
            {room.hinhAnhPhu &&
              Array.isArray(room.hinhAnhPhu) &&
              room.hinhAnhPhu
                .slice(0, 3)
                .map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="phu"
                    className="h-28 w-full object-cover rounded-xl shadow"
                  />
                ))}
          </div>
          {/* Thông tin đặt phòng */}
          <div className="flex flex-col gap-4 justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {room.tenPhong}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-2">
                <UserOutlined /> {room.khach} khách • {room.phongNgu} phòng ngủ
                • {room.giuong} giường • {room.phongTam} phòng tắm
              </div>
              <div className="text-lg text-rose-500 font-bold mb-2">
                {room.giaTien?.toLocaleString()}₫ / đêm
              </div>
              <div className="text-gray-500 dark:text-gray-300 mb-2">
                {room.diaChi}
              </div>
              <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-2">
                ★ {room.saoDanhGia || 5} ({room.danhGia || 0} đánh giá)
              </div>
            </div>
            <div className="bg-white/90 dark:bg-[#23232b] rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-lg font-bold text-rose-500 mb-2">
                <CalendarOutlined /> Đặt phòng ngay
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Ngày nhận phòng:</span>
                  <input
                    type="date"
                    className="rounded px-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Ngày trả phòng:</span>
                  <input
                    type="date"
                    className="rounded px-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Số khách:</span>
                  <input
                    type="number"
                    min="1"
                    max={room.khach}
                    defaultValue={1}
                    className="rounded px-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-900 dark:text-white w-20"
                  />
                </div>
                <Button
                  type="primary"
                  className="rounded-xl bg-rose-500 border-none hover:!bg-rose-600 mt-2"
                >
                  Đặt phòng
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Mô tả */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Mô tả
          </h2>
          <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-line">
            {room.moTa}
          </div>
        </motion.div>
        {/* Tiện nghi */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Tiện nghi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300">
            {room &&
              Object.entries(room)
                .filter(([k, v]) => typeof v === "boolean" && v)
                .map(([k]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
                    <span className="capitalize">
                      {k.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                  </div>
                ))}
          </div>
        </motion.div>
        {/* Bình luận */}
        <CommentSection roomId={room.id} />
      </main>
      <Footer />
    </div>
  );
}

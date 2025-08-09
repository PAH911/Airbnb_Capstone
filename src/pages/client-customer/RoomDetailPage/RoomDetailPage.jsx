import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomDetail } from "./roomDetailSlice";
import { clearSearchCriteria } from "../../../store/searchSlice";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CommentSection from "./CommentSection";
import { motion } from "framer-motion";
import { UserOutlined } from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css"; // Tạo file này để custom giao diện cho darkmode
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { message, ConfigProvider, theme as antdTheme } from "antd";

export default function RoomDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchCriteria = useSelector((state) => state.search?.searchCriteria);
  const {
    data: room,
    loading,
    error,
  } = useSelector((state) => state.roomDetail);
  const { theme: currentTheme } = useContext(ThemeContext);

  // State đặt phòng
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);

  // Tổng số ngày và tiền
  const getNights = () => {
    if (startDate && endDate) {
      const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }
    return 0;
  };
  const nights = getNights();
  const totalPrice = nights * (room?.giaTien || 0);

  useEffect(() => {
    if (id) dispatch(fetchRoomDetail(id));
  }, [id, dispatch]);

  // Set ngày từ search criteria nếu có
  useEffect(() => {
    if (searchCriteria && searchCriteria.dateRange) {
      const { from, to } = searchCriteria.dateRange;
      if (from && to) {
        setStartDate(new Date(from));
        setEndDate(new Date(to));
        setGuests(searchCriteria.guests || 1);

        // Xóa search criteria sau khi đã sử dụng để tránh apply lại
        dispatch(clearSearchCriteria());
      }
    }
  }, [searchCriteria, dispatch]);

  // Đếm tổng lượt đánh giá từ comment
  const comments = useSelector((state) => state.comment.list);
  const totalReviews = comments.length;
  const avgRating =
    totalReviews > 0
      ? (
          comments.reduce((sum, c) => sum + (c.saoBinhLuan || 5), 0) /
          totalReviews
        ).toFixed(1)
      : room?.saoDanhGia || 5;

  // --- Loading/error ---
  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          currentTheme === "dark"
            ? "bg-[#18181c] text-white"
            : "bg-gradient-to-br from-rose-50 via-white to-pink-100 text-gray-900"
        }`}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl font-bold">Đang tải...</div>
        </main>
        <Footer />
      </div>
    );
  }
  if (error || !room) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          currentTheme === "dark"
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

  const handleBooking = () => {
    if (!startDate || !endDate || guests < 1) {
      ConfigProvider.config({
        theme: {
          token: {
            colorBgElevated: currentTheme === "dark" ? "#23232b" : "#fff",
            colorText: currentTheme === "dark" ? "#fff" : "#f43f5e",
            borderRadius: 16,
            fontSize: 18,
          },
          algorithm:
            currentTheme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        },
      });
      message.open({
        type: "warning",
        content: (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <span>Vui lòng chọn ngày nhận phòng, trả phòng và số khách!</span>
          </div>
        ),
        duration: 2.2,
        className: "custom-antd-message",
        style: {
          background: currentTheme === "dark" ? "#23232b" : "#fff",
          color: currentTheme === "dark" ? "#fff" : "#f43f5e",
          border:
            currentTheme === "dark"
              ? "1.5px solid #31394e"
              : "1.5px solid #f43f5e",
          boxShadow: "0 4px 32px #f43f5e22",
          fontWeight: 600,
          fontSize: 18,
          padding: 16,
          minWidth: 340,
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "fadeInUp .5s",
        },
      });
      return;
    }
    navigate("/booking", {
      state: {
        room,
        startDate,
        endDate,
        guests,
        totalPrice,
        nights,
      },
    });
  };

  // --- Giao diện chính ---
  return (
    <div
      className={`min-h-screen flex flex-col theme-${currentTheme} ${
        currentTheme === "dark"
          ? "bg-[#18181c] text-white"
          : "bg-gradient-to-br from-rose-50 via-white to-pink-100 text-gray-900"
      }`}
    >
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Ảnh phòng */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4">
            {/* Ảnh chính */}
            {room.hinhAnh && (
              <img
                src={room.hinhAnh}
                alt={room.tenPhong}
                className="w-full h-80 md:h-[420px] rounded-3xl object-cover shadow-2xl"
              />
            )}
            {/* Ảnh phụ */}
            <div className="grid grid-cols-3 gap-3">
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
          </div>
          {/* Thông tin đặt phòng */}
          <div className="flex flex-col gap-5 justify-between sticky top-28 self-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{room.tenPhong}</h1>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-2">
                <UserOutlined /> {room.khach} khách • {room.phongNgu} phòng ngủ
                • {room.giuong} giường • {room.phongTam} phòng tắm
              </div>
              <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-2">
                ★ {avgRating}{" "}
                <span className="text-gray-500 dark:text-gray-300 text-base font-normal">
                  ({totalReviews} đánh giá)
                </span>
              </div>
              <div className="text-lg text-rose-500 font-bold mb-2">
                {room.giaTien?.toLocaleString()}₫ / đêm
              </div>
              <div className="text-gray-500 dark:text-gray-300 mb-2">
                {room.diaChi}
              </div>
            </div>
            {/* Đặt phòng */}
            <div className="bg-white/90 dark:bg-[#23232b] rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800 flex flex-col gap-5">
              <div className="font-semibold mb-2 text-xl text-rose-500 dark:text-rose-300">
                Đặt phòng
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold w-28 dark:text-gray-200">
                    Nhận phòng:
                  </span>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày đến"
                    className="w-full !rounded-lg !border-gray-200 !dark:border-gray-700 !bg-white !dark:bg-[#18181c] !text-gray-900 !dark:text-white px-3 py-1.5 focus:!border-rose-400 !placeholder-gray-400 !dark:placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold w-28 dark:text-gray-200">
                    Trả phòng:
                  </span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày đi"
                    className="w-full !rounded-lg !border-gray-200 !dark:border-gray-700 !bg-white !dark:bg-[#18181c] !text-gray-900 !dark:text-white px-3 py-1.5 focus:!border-rose-400 !placeholder-gray-400 !dark:placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold w-28 dark:text-gray-200">
                    Số khách:
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={room.khach}
                    value={guests}
                    onChange={(e) =>
                      setGuests(
                        Math.max(
                          1,
                          Math.min(room.khach, Number(e.target.value))
                        )
                      )
                    }
                    className={`w-24 !rounded-xl px-3 py-1.5 transition-all
${
  currentTheme === "dark"
    ? "bg-[#18181c] text-white border-gray-700 placeholder-gray-400"
    : "bg-white text-gray-900 border-gray-200 placeholder-gray-400"
}
`}
                    style={{
                      WebkitTextFillColor:
                        currentTheme === "dark" ? "#fff" : undefined,
                      backgroundColor:
                        currentTheme === "dark" ? "#18181c" : undefined,
                      colorScheme: currentTheme === "dark" ? "dark" : "light",
                    }}
                  />
                </div>
                {/* Tổng tiền */}
                <div className="flex items-center justify-between font-bold mt-1 text-base">
                  <span className="dark:text-gray-200">Tổng tiền:</span>
                  <span className="text-rose-500 text-lg">
                    {totalPrice ? totalPrice.toLocaleString() + "₫" : "-"}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">
                    ({nights} đêm)
                  </span>
                </div>
                <button
                  className="rounded-xl py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-lg shadow mt-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:focus:ring-rose-300"
                  onClick={handleBooking}
                >
                  Đặt phòng
                </button>
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
          <h2 className="text-xl font-bold mb-2">Mô tả</h2>
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
          <h2 className="text-xl font-bold mb-2">Tiện nghi</h2>
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
      {/* Thêm animation cho message */}
      <style>
        {`
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp .5s;
}
.custom-antd-message {
  border-radius: 16px !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  min-width: 340px;
  padding: 16px !important;
  display: flex;
  align-items: center;
  gap: 10px;
}
`}
      </style>
    </div>
  );
}

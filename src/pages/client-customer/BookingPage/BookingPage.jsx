import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { createBooking, resetBooking } from "./bookingSlice";
import { Button, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((s) => s.booking);
  const user = useSelector((s) => s.auth.user);

  if (!state) {
    navigate("/");
    return null;
  }
  const { room, startDate, endDate, guests, totalPrice, nights } = state;

  const sacombankQr = `https://img.vietqr.io/image/970403-060283876139-compact2.png?amount=${totalPrice}`;

  const qrContent = `BOOKING_${room.id}_${dayjs().format("YYMMDDHHmmss")}`;

  const handleBack = () => navigate(`/room/${room.id}`);

  const handleBooking = async () => {
    if (!user) {
      message.warning("Bạn cần đăng nhập để đặt phòng");
      return;
    }
    const payload = {
      maPhong: room.id,
      ngayDen: dayjs(startDate).format("YYYY-MM-DD"),
      ngayDi: dayjs(endDate).format("YYYY-MM-DD"),
      soLuongKhach: guests,
      maNguoiDung: user.id,
    };
    const result = await dispatch(createBooking(payload));
    if (result.meta.requestStatus === "fulfilled") {
      message.success("Đặt phòng thành công!");
      setTimeout(() => {
        dispatch(resetBooking());
        navigate("/profile");
      }, 1500);
    } else {
      message.error(result.payload || "Đặt phòng thất bại!");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 via-white to-pink-100 dark:bg-gradient-to-br dark:from-[#18181c] dark:via-[#23232b] dark:to-[#18181c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-5xl rounded-3xl bg-white dark:bg-[#23232b] shadow-2xl dark:shadow-lg dark:shadow-black/40 px-12 py-10 flex flex-col md:flex-row gap-12 border border-gray-100 dark:border-[#33334a]"
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
      >
        {/* Ảnh và info phòng */}
        <motion.div
          className="md:w-1/2 w-full flex flex-col items-center justify-center gap-4"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={room.hinhAnh}
            alt={room.tenPhong}
            className="w-full h-64 rounded-xl object-cover shadow mb-3 dark:shadow dark:shadow-black/40 border border-gray-200 dark:border-[#33334a]"
          />
          <div className="font-bold text-lg text-center text-gray-900 dark:text-gray-100">
            {room.tenPhong}
          </div>
          <div className="text-gray-500 dark:text-gray-300 text-sm mb-1 text-center">
            {room.diaChi}
          </div>
          <div className="text-yellow-500 font-bold text-base mb-2">
            ★ {room.saoDanhGia || "5"}
          </div>
          <Button
            onClick={handleBack}
            className="rounded-full px-6 py-2 border-none shadow font-semibold text-base bg-white/80 hover:bg-rose-50 dark:bg-[#23232b] dark:hover:bg-[#18181c] text-rose-500 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-400 dark:text-rose-300 dark:hover:text-white transition-all duration-200 flex items-center gap-2"
            icon={<LeftOutlined />}
            size="large"
          >
            Quay lại phòng
          </Button>
        </motion.div>
        {/* Thông tin đặt phòng và thanh toán */}
        <motion.div
          className="md:w-1/2 w-full flex flex-col gap-6 justify-center"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <div className="font-bold text-rose-500 text-lg mb-1 dark:text-pink-400">
              Thông tin đặt phòng
            </div>
            <div className="text-gray-800 dark:text-gray-100 text-base mb-1">
              Nhận phòng:{" "}
              <span className="font-medium dark:text-pink-200">
                {dayjs(startDate).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="text-gray-800 dark:text-gray-100 text-base mb-1">
              Trả phòng:{" "}
              <span className="font-medium dark:text-pink-200">
                {dayjs(endDate).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="text-gray-800 dark:text-gray-100 text-base mb-1">
              Số khách:{" "}
              <span className="font-medium dark:text-pink-200">{guests}</span>
            </div>
            <div className="text-gray-800 dark:text-gray-100 text-base mb-1">
              Số đêm:{" "}
              <span className="font-medium dark:text-pink-200">{nights}</span>
            </div>
            <div className="font-bold text-xl text-rose-600 mt-2 dark:text-pink-400">
              Tổng tiền: {totalPrice?.toLocaleString()}₫
            </div>
          </div>
          <div>
            <div className="font-semibold text-base mb-2 dark:text-gray-200">
              Thanh toán qua QR Code:
            </div>
            <div className="flex items-center gap-6">
              <img
                src={sacombankQr}
                alt="QR thanh toán Sacombank"
                className="w-40 h-40 rounded-xl border-2 border-rose-300 dark:border-pink-400 shadow-lg dark:shadow dark:shadow-black/40 bg-white dark:bg-[#23232b]"
              />
              <div className="text-xs text-gray-500 dark:text-gray-300">
                <span>
                  Quét mã để thanh toán bằng <b>Sacombank/MoMo/VietQR</b>.<br />
                  Nội dung chuyển khoản:{" "}
                  <b className="dark:text-pink-200">{qrContent}</b>
                </span>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            loading={loading}
            className="rounded-xl py-3 text-lg font-bold mt-4 shadow bg-gradient-to-r from-rose-500 to-pink-500 border-none hover:from-pink-600 hover:to-rose-500 hover:scale-105 transition-all duration-200 dark:bg-gradient-to-r dark:from-pink-600 dark:to-rose-500 dark:text-white"
            onClick={handleBooking}
            size="large"
            block
          >
            Xác nhận đặt phòng
          </Button>
          {error && (
            <div className="text-red-500 text-sm mt-2 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <motion.div
              className="text-green-600 font-bold mt-2 dark:text-green-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Đặt phòng thành công!
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

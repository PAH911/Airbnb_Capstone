// src/pages/client-customer/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserById,
  updateUser,
  getCurrentUser,
} from "../../../services/userService";
import { getBookingsByUser } from "../../../services/bookingService";
import { getRoomById } from "../../../services/roomService";
import { setUser } from "./userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";

const genderOptions = [
  { label: "Nam", value: true },
  { label: "Nữ", value: false },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.user);
  const [user, setUserState] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [birthday, setBirthday] = useState(null);

  useEffect(() => {
    async function fetchUserAndBookings() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const id = JSON.parse(atob(token.split(".")[1])).id;
        const userRes = await getCurrentUser(token);
        const userInfo = userRes.data.content;
        dispatch(setUser(userInfo));
        setUserState(userInfo);
        setForm(userInfo);
        setBirthday(userInfo?.birthday ? new Date(userInfo.birthday) : null);

        const bookingRes = await getBookingsByUser(userInfo.id);
        setBookings(bookingRes.data.content);
        const roomPromises = bookingRes.data.content.map((b) =>
          getRoomById(b.maPhong)
        );
        const roomResults = await Promise.all(roomPromises);
        setRooms(roomResults.map((r) => r.data.content));
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu người dùng:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndBookings();
  }, []);

  const handleEdit = () => setShowModal(true);
  const handleCancel = () => {
    setShowModal(false);
    setForm({ ...user });
    setBirthday(user?.birthday ? new Date(user.birthday) : null);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const id = user.id;
      const payload = {
        ...form,
        birthday: birthday ? format(birthday, "yyyy-MM-dd") : undefined,
      };
      await updateUser(id, payload);
      setUserState({ ...user, ...payload });
      dispatch(setUser({ ...user, ...payload }));
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto py-12 px-4 min-h-screen"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin cá nhân */}
        <motion.div
          className="rounded-2xl shadow-xl p-8 flex flex-col items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4" />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-4xl font-bold text-white mb-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  user?.name?.[0] || <UserOutlined />
                )}
              </div>
            </motion.div>
          )}
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {user?.name}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 flex items-center justify-center gap-1">
              <MailOutlined className="mr-1" /> {user?.email}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 flex items-center justify-center gap-1">
              <PhoneOutlined className="mr-1" /> {user?.phone}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 flex items-center justify-center gap-1">
              <CalendarOutlined className="mr-1" />
              {user?.birthday
                ? format(new Date(user.birthday), "dd/MM/yyyy")
                : ""}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 flex items-center justify-center gap-1">
              {user?.gender === true ? (
                <ManOutlined className="mr-1" />
              ) : (
                <WomanOutlined className="mr-1" />
              )}{" "}
              {user?.gender === true ? "Nam" : "Nữ"}
            </div>
            <div className="text-gray-400 text-xs mb-2">
              Bắt đầu tham gia{" "}
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : ""}
            </div>
            <Button
              variant="default"
              className="rounded-full mt-2 w-full bg-gradient-to-r from-rose-500 to-pink-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
              onClick={handleEdit}
              disabled={loading}
            >
              <EditOutlined className="mr-1" /> Chỉnh sửa hồ sơ
            </Button>
          </div>
        </motion.div>

        {/* Modal chỉnh sửa */}
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xl font-bold mb-4 text-center">
                Chỉnh sửa thông tin cá nhân
              </div>
              <div className="space-y-4">
                <Input
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Họ tên"
                />
                <Input value={form.email || ""} disabled placeholder="Email" />
                <Input
                  value={form.phone || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="Số điện thoại"
                />
                <Calendar
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  className="w-full"
                />
                <div className="flex gap-4">
                  {genderOptions.map((opt) => (
                    <Button
                      key={opt.value.toString()}
                      variant={
                        form.gender === opt.value ? "default" : "outline"
                      }
                      className={
                        form.gender === opt.value
                          ? "bg-rose-500 text-white"
                          : ""
                      }
                      onClick={() =>
                        setForm((f) => ({ ...f, gender: opt.value }))
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-400 text-white"
                    onClick={handleSave}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Phòng đã thuê */}
        <div className="md:col-span-2">
          <div className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Phòng đã thuê
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array(2)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
                  />
                ))
            ) : bookings.length === 0 ? (
              <div className="text-gray-500">Bạn chưa đặt phòng nào.</div>
            ) : (
              bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 mb-4 overflow-hidden hover:scale-[1.03] transition-transform">
                    <img
                      src={rooms[i]?.hinhAnh}
                      alt={rooms[i]?.tenPhong}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                        {rooms[i]?.tenPhong}
                      </div>
                      <div className="text-gray-500 dark:text-gray-300 text-sm mb-1 line-clamp-2">
                        {rooms[i]?.moTa}
                      </div>
                      <div className="text-rose-500 font-bold">
                        {rooms[i]?.giaTien?.toLocaleString()}₫ / tháng
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

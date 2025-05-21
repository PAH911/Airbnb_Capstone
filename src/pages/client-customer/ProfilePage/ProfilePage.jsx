import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Modal,
  Input,
  DatePicker,
  Skeleton,
  Radio,
  message,
} from "antd";
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";

import { getCurrentUser, updateUser } from "@/services/userService";
import { getBookingsByUser } from "@/services/bookingService";
import { getRoomById } from "@/services/roomService";
import { setUser } from "./userSlice";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.user);
  const [user, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [birthday, setBirthday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await getCurrentUser(token);
        const userInfo = res.data.content;
        dispatch(setUser(userInfo));
        setUserData(userInfo);
        setForm(userInfo);
        setBirthday(userInfo?.birthday ? dayjs(userInfo.birthday) : null);

        const bookingRes = await getBookingsByUser(userInfo.id);
        setBookings(bookingRes.data.content);
        const roomRes = await Promise.all(
          bookingRes.data.content.map((b) => getRoomById(b.maPhong))
        );
        setRooms(roomRes.map((r) => r.data.content));
      } catch (err) {
        message.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({ ...user });
    setBirthday(user?.birthday ? dayjs(user.birthday) : null);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        birthday: birthday ? birthday.format("YYYY-MM-DD") : undefined,
      };
      await updateUser(user.id, payload);
      dispatch(setUser({ ...user, ...payload }));
      setUserData({ ...user, ...payload });
      message.success("Cập nhật thành công");
      setEditMode(false);
    } catch (err) {
      message.error("Lỗi cập nhật");
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid md:grid-cols-3 gap-8">
        <Card
          className="shadow-lg dark:bg-gray-900 border dark:border-gray-800"
          bodyStyle={{ padding: 24 }}
        >
          {loading ? (
            <Skeleton avatar paragraph={{ rows: 4 }} active />
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <Avatar
                  size={96}
                  src={user?.avatar}
                  className="mb-3"
                  style={{ backgroundColor: "#f56a00" }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Title level={4}>{user?.name || "Không có tên"}</Title>
                <Text type="secondary" className="block mt-1">
                  <MailOutlined /> {user?.email}
                </Text>
                <Text type="secondary" className="block mt-1">
                  <PhoneOutlined /> {user?.phone || "Chưa cập nhật"}
                </Text>
                <Text type="secondary" className="block mt-1">
                  {user?.gender === true ? <ManOutlined /> : <WomanOutlined />}{" "}
                  {user?.gender === true ? "Nam" : "Nữ"}
                </Text>
                <Text type="secondary" className="block mt-1">
                  🎂{" "}
                  {user?.birthday
                    ? dayjs(user.birthday).format("DD/MM/YYYY")
                    : "Chưa có"}
                </Text>
                <Text type="secondary" className="text-xs mt-2">
                  Bắt đầu tham gia năm{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : ""}
                </Text>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  onClick={handleEdit}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* DANH SÁCH PHÒNG */}
        <div className="md:col-span-2">
          <Title level={4}>Phòng đã thuê</Title>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : bookings.length === 0 ? (
            <Text type="secondary">Bạn chưa đặt phòng nào.</Text>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {bookings.map((booking, i) => (
                <Card
                  key={booking.id}
                  hoverable
                  cover={
                    <img
                      alt={rooms[i]?.tenPhong}
                      src={rooms[i]?.hinhAnh}
                      className="h-48 object-cover"
                    />
                  }
                  className="rounded-lg overflow-hidden shadow"
                >
                  <Title level={5}>{rooms[i]?.tenPhong}</Title>
                  <Text className="block text-sm">{rooms[i]?.moTa}</Text>
                  <Text strong className="block mt-2 text-pink-600">
                    {rooms[i]?.giaTien?.toLocaleString()}₫ / tháng
                  </Text>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL CHỈNH SỬA */}
      <Modal
        open={editMode}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        title="Chỉnh sửa thông tin cá nhân"
      >
        <div className="space-y-4">
          <Input
            placeholder="Họ tên"
            value={form.name || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input placeholder="Email" value={form.email || ""} disabled />
          <Input
            placeholder="Số điện thoại"
            value={form.phone || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <DatePicker
            value={birthday}
            onChange={(value) => setBirthday(value)}
            format="DD/MM/YYYY"
            className="w-full"
          />
          <Radio.Group
            value={form.gender}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </motion.div>
  );
}

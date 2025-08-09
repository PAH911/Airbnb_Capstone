import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Form,
  Input,
  Modal,
  DatePicker,
  Radio,
  Avatar,
  message,
  Card,
  Row,
  Col,
  Upload,
} from "antd";
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getBookingsByUser } from "@/services/bookingService";
import { getRoomById } from "@/services/roomService";
import {
  setUser,
  updateUserInfo,
  uploadAvatarThunk,
  fetchUser,
} from "./userSlice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";

const genderOptions = [
  { label: "Nam", value: true, icon: <ManOutlined /> },
  { label: "Nữ", value: false, icon: <WomanOutlined /> },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [editModal, setEditModal] = useState(false);
  const [form] = Form.useForm();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const userRedux =
    useSelector((state) => state.auth.user) ||
    useSelector((state) => state.user.user);
  const [localHydrated, setLocalHydrated] = useState(false);

  // 1. HYDRATE user từ localStorage vào Redux nếu bị null
  useEffect(() => {
    if (!userRedux) {
      const userStr = localStorage.getItem("userInfo");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.id) {
            dispatch(setUser(userObj));
          }
        } catch {
          localStorage.removeItem("userInfo");
        }
      }
    }
    setLocalHydrated(true); // Đánh dấu đã hydrate
  }, [userRedux, dispatch]);

  // 2. FETCH user mới nhất từ API sau khi hydrate localStorage xong
  useEffect(() => {
    if (localHydrated && userRedux && userRedux.id) {
      dispatch(fetchUser(userRedux.id))
        .unwrap()
        .then((userRes) => {
          if (userRes && userRes.id) {
            localStorage.setItem("userInfo", JSON.stringify(userRes));
            dispatch(setUser(userRes));
          }
        })
        .catch(() => {
          localStorage.removeItem("userInfo");
        });
    }
  }, [localHydrated, userRedux?.id, dispatch]);

  // 3. FETCH BOOKINGS/ROOMS khi user đã sẵn sàng
  useEffect(() => {
    if (!user || !user.id) {
      setBookings([]);
      setRooms([]);
      setLoading(false);
      return;
    }
    async function fetchProfile() {
      setLoading(true);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });
      try {
        const bookingRes = await getBookingsByUser(user.id);
        setBookings(bookingRes.data.content);
        const roomRes = await Promise.all(
          bookingRes.data.content.map((b) => getRoomById(b.maPhong))
        );
        setRooms(roomRes.map((r) => r.data.content));
      } catch (err) {
        message.error(
          "Không thể tải dữ liệu phòng đã thuê (user id không hợp lệ hoặc lỗi server)"
        );
        setBookings([]);
        setRooms([]);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user && user.id, form]);

  // Xử lý upload avatar
  const handleAvatarChange = async (info) => {
    // Validate file
    const file = info.file;
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('Vui lòng chọn file hình ảnh!');
      return;
    }
    if (!isLt2M) {
      message.error('Kích thước hình ảnh phải nhỏ hơn 2MB!');
      return;
    }

    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("formFile", file);
    
    try {
      console.log("Starting avatar upload for user:", user.id);
      const userUpdated = await dispatch(
        uploadAvatarThunk({ formData, userId: user.id })
      ).unwrap();
      
      console.log("Avatar upload successful:", userUpdated);
      message.success("Cập nhật avatar thành công!");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      message.error(err || "Lỗi cập nhật avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  // Xử lý update user info
  const handleSave = async (values) => {
    try {
      const data = {
        ...values,
        birthday: values.birthday
          ? dayjs(values.birthday).format("YYYY-MM-DD")
          : undefined,
        role: user.role || "USER",
      };
      await dispatch(updateUserInfo({ id: user.id, data })).unwrap();
      // Fetch user mới nhất từ API để đồng bộ mọi thông tin
      const userRes = await dispatch(fetchUser(user.id)).unwrap();
      dispatch(setUser(userRes));
      localStorage.setItem("userInfo", JSON.stringify(userRes));
      message.success("Cập nhật thông tin thành công!");
      setEditModal(false);
    } catch (err) {
      message.error(err?.message || err || "Lỗi cập nhật thông tin");
    }
  };

  // Loading khi chưa có user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-500 dark:text-gray-300">
        Đang tải thông tin người dùng...
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
      <div className="flex flex-row items-start py-12 px-2 flex-1 gap-12 max-w-7xl mx-auto w-full">
        {/* Card Thông tin user */}
        <Card
          className="w-full max-w-xs rounded-3xl shadow-2xl border-none dark:bg-[#23232b] bg-white p-6 flex flex-col items-center gap-4"
          bordered={false}
          style={{ minWidth: 320 }}
        >
          <div className="flex flex-col items-center gap-4">
            <Avatar
              size={100}
              src={user?.avatar}
              className="bg-gradient-to-tr from-rose-500 to-pink-400 text-4xl border-4 border-white dark:border-[#23232b] shadow-lg"
              icon={
                !user?.avatar && <span>{user?.name?.[0]?.toUpperCase()}</span>
              }
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              customRequest={({ file }) => handleAvatarChange({ file })}
              disabled={avatarLoading}
            >
              <Button
                icon={<UploadOutlined />}
                loading={avatarLoading}
                size="small"
                className="bg-gradient-to-r from-rose-500 to-pink-400 text-white border-none shadow hover:from-pink-500 hover:to-rose-400 dark:bg-[#23232b] dark:text-pink-200 dark:hover:bg-[#18181c]"
              >
                Đổi avatar
              </Button>
            </Upload>
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              {user?.name || "Chưa có tên"}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm flex items-center gap-1">
              <MailOutlined /> {user?.email}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm flex items-center gap-1">
              <PhoneOutlined /> {user?.phone || "Chưa cập nhật"}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm flex items-center gap-1">
              {user?.gender === true ? <ManOutlined /> : <WomanOutlined />}
              {user?.gender === true ? "Nam" : "Nữ"}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm flex items-center gap-1">
              🎂{" "}
              {user?.birthday
                ? dayjs(user.birthday).format("DD/MM/YYYY")
                : "Chưa có"}
            </div>
            <Button
              type="primary"
              shape="round"
              icon={<EditOutlined />}
              onClick={() => setEditModal(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-400 text-white border-none shadow hover:from-pink-500 hover:to-rose-400 dark:bg-[#23232b] dark:text-pink-200 dark:hover:bg-[#18181c] mt-2"
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </Card>

        {/* Danh sách phòng đã thuê */}
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Phòng đã thuê
          </h2>
          <Row gutter={[32, 32]}>
            {loading ? (
              <Col span={24}>
                <div>Đang tải...</div>
              </Col>
            ) : bookings.length === 0 ? (
              <Col span={24}>
                <div className="text-gray-500 dark:text-gray-300">
                  Bạn chưa đặt phòng nào.
                </div>
              </Col>
            ) : (
              bookings.map((b, i) => {
                const room = rooms[i] || {};
                const nights = dayjs(b.ngayDi).diff(dayjs(b.ngayDen), "day");
                const total = nights * (room.giaTien || 0);
                return (
                  <Col md={12} xs={24} key={b.id}>
                    <Card
                      hoverable
                      className="rounded-2xl shadow-lg border-none bg-white dark:bg-[#23232b] transition-transform duration-200 hover:scale-[1.025]"
                      cover={
                        <img
                          alt={room.tenPhong}
                          src={room.hinhAnh}
                          className="h-44 w-full object-cover rounded-xl shadow mb-2 transition-transform duration-200 hover:scale-105"
                        />
                      }
                    >
                      <Card.Meta
                        title={
                          <span className="font-semibold text-lg text-gray-900 dark:text-white">
                            {room.tenPhong}
                            <span className="ml-2 text-gray-400 text-xs font-normal">
                              (#{b.id})
                            </span>
                          </span>
                        }
                        description={
                          <div className="flex flex-col gap-1">
                            <div className="truncate text-gray-600 dark:text-gray-300">
                              {room.moTa}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                              <strong>Ngày nhận:</strong>{" "}
                              {dayjs(b.ngayDen).format("DD/MM/YYYY")}
                              <br />
                              <strong>Ngày trả:</strong>{" "}
                              {dayjs(b.ngayDi).format("DD/MM/YYYY")}
                              <br />
                              <strong>Số khách:</strong> {b.soLuongKhach}
                              <br />
                              <strong>Mã phòng:</strong> {b.maPhong}
                            </div>
                            <div className="text-rose-500 dark:text-pink-400 font-bold mt-1">
                              {room.giaTien?.toLocaleString()}₫ / đêm
                            </div>
                            <div className="text-pink-500 dark:text-pink-300 font-bold">
                              Tổng tiền: {total.toLocaleString()}₫ ({nights}{" "}
                              đêm)
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title={
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa thông tin cá nhân
          </span>
        }
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        centered
        className={theme === "dark" ? "dark-modal" : ""}
        bodyStyle={{
          background: theme === "dark" ? "#23232b" : "#fff",
          borderRadius: 20,
          boxShadow:
            theme === "dark" ? "0 8px 32px #0008" : "0 8px 32px #f43f5e22",
          padding: 32,
        }}
        style={{ borderRadius: 20, overflow: "hidden", maxWidth: 480 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            gender: user?.gender,
            birthday: user?.birthday ? dayjs(user.birthday) : null,
          }}
        >
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                Họ tên
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input className="rounded-xl px-3 py-2 bg-white dark:bg-[#18181c] dark:text-white border border-gray-200 dark:border-gray-700 focus:border-rose-400 dark:focus:border-pink-400 transition-all duration-150" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                Email
              </span>
            }
            name="email"
          >
            <Input
              disabled
              className="rounded-xl px-3 py-2 bg-white dark:bg-[#18181c] dark:text-white border border-gray-200 dark:border-gray-700"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                Số điện thoại
              </span>
            }
            name="phone"
          >
            <Input className="rounded-xl px-3 py-2 bg-white dark:bg-[#18181c] dark:text-white border border-gray-200 dark:border-gray-700 focus:border-rose-400 dark:focus:border-pink-400 transition-all duration-150" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                Giới tính
              </span>
            }
            name="gender"
          >
            <Radio.Group
              options={genderOptions}
              optionType="button"
              buttonStyle="solid"
              className="dark:bg-[#18181c]  [&_.ant-radio-button-wrapper]:rounded-xl [&_.ant-radio-button-wrapper]:!border-gray-200 [&_.ant-radio-button-wrapper]:dark:!border-gray-700 [&_.ant-radio-button-wrapper-checked]:!bg-gradient-to-r [&_.ant-radio-button-wrapper-checked]:from-rose-500 [&_.ant-radio-button-wrapper-checked]:to-pink-400 [&_.ant-radio-button-wrapper-checked]:!text-white"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                Ngày sinh
              </span>
            }
            name="birthday"
          >
            <DatePicker
              format="DD/MM/YYYY"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
              className="rounded-xl px-3 py-2 bg-white dark:bg-[#18181c] dark:text-white border border-gray-200 dark:border-gray-700 w-full datepicker-darkmode-fix"
              popupClassName={theme === "dark" ? "antd-datepicker-dark" : ""}
            />
          </Form.Item>
          <div className="flex gap-3 justify-end mt-8">
            <Button
              onClick={() => setEditModal(false)}
              className="rounded-xl px-6 py-2 font-semibold bg-gray-200 dark:bg-[#23232b] text-gray-700 dark:text-gray-200 border-none shadow-sm hover:bg-gray-300 dark:hover:bg-[#18181c] transition-colors duration-150"
              style={{ minWidth: 80 }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-xl px-6 py-2 font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white border-none shadow hover:from-pink-600 hover:to-rose-500 dark:bg-gradient-to-r dark:from-pink-600 dark:to-rose-500 dark:text-white dark:hover:from-pink-500 dark:hover:to-rose-400 transition-colors duration-150"
              style={{ minWidth: 80 }}
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
      {/* Custom darkmode cho antd datepicker */}
      <style>{`
        .antd-datepicker-dark .ant-picker-panel {
          background: #23232b !important;
          color: #fff !important;
        }
        .antd-datepicker-dark .ant-picker-header {
          background: #23232b !important;
          color: #fff !important;
        }
        .antd-datepicker-dark .ant-picker-cell {
          color: #e5e7eb !important;
        }
        .antd-datepicker-dark .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
        .antd-datepicker-dark .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
        .antd-datepicker-dark .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
          background: linear-gradient(90deg, #f43f5e, #ec4899) !important;
          color: #fff !important;
        }
        .antd-datepicker-dark .ant-picker-cell-today .ant-picker-cell-inner {
          border-radius: 0.5rem !important;
          background: #374151 !important;
          color: #fff !important;
        }
        .antd-datepicker-dark .ant-picker-cell:hover .ant-picker-cell-inner {
          background: #f43f5e !important;
          color: #fff !important;
        }
        .antd-datepicker-dark .ant-picker-footer {
          background: #23232b !important;
        }
        .antd-datepicker-dark .ant-picker-input input {
          background: #18181c !important;
          color: #fff !important;
        }
      `}</style>
      <Footer />
    </div>
  );
}

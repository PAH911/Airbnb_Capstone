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
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("formFile", info.file);
    try {
      const userUpdated = await dispatch(
        uploadAvatarThunk({ formData, userId: user.id })
      ).unwrap();
      // Không cần fetchUser, đã đồng bộ Redux và localStorage rồi
      message.success("Cập nhật avatar thành công!");
      setEditModal(false);
    } catch (err) {
      message.error(err?.message || err || "Lỗi cập nhật avatar");
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
      <div className="flex flex-row items-start py-12 px-2 flex-1 gap-12 max-w-7xl mx-auto">
        {/* Card Thông tin user */}
        <Card className="w-full max-w-xl rounded-3xl shadow-2xl" bordered>
          <div className="flex flex-col items-center gap-4">
            <Avatar
              size={96}
              src={user?.avatar}
              className="bg-gradient-to-tr from-rose-500 to-pink-400 text-4xl"
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
              >
                Đổi avatar
              </Button>
            </Upload>
            <div className="text-xl font-semibold">
              {user?.name || "Chưa có tên"}
            </div>
            <div className="text-gray-500 text-sm">
              <MailOutlined /> {user?.email}
            </div>
            <div className="text-gray-500 text-sm">
              <PhoneOutlined /> {user?.phone || "Chưa cập nhật"}
            </div>
            <div className="text-gray-500 text-sm">
              {user?.gender === true ? <ManOutlined /> : <WomanOutlined />}
              {user?.gender === true ? "Nam" : "Nữ"}
            </div>
            <div className="text-gray-500 text-sm">
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
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </Card>

        {/* Danh sách phòng đã thuê */}
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Phòng đã thuê</h2>
          <Row gutter={[24, 24]}>
            {loading ? (
              <Col span={24}>
                <div>Đang tải...</div>
              </Col>
            ) : bookings.length === 0 ? (
              <Col span={24}>
                <div className="text-gray-500">Bạn chưa đặt phòng nào.</div>
              </Col>
            ) : (
              bookings.map((b, i) => (
                <Col md={12} xs={24} key={b.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={rooms[i]?.tenPhong}
                        src={rooms[i]?.hinhAnh}
                        className="h-44 w-full object-cover rounded-xl"
                      />
                    }
                  >
                    <Card.Meta
                      title={rooms[i]?.tenPhong}
                      description={
                        <>
                          <div className="truncate">{rooms[i]?.moTa}</div>
                          <div className="text-rose-500 font-bold mt-1">
                            {rooms[i]?.giaTien?.toLocaleString()}₫ / tháng
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        centered
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
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender">
            <Radio.Group
              options={genderOptions}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthday">
            <DatePicker
              format="DD/MM/YYYY"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setEditModal(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
}

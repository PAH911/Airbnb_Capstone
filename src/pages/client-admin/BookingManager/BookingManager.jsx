import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  Card,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  fetchBookings,
  deleteBooking,
  updateBooking,
  clearError,
} from "./adminBookingSlice";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const BookingManager = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error, totalBookings } = useSelector(
    (state) => state.adminBooking
  );

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (bookingId) => {
    try {
      await dispatch(deleteBooking(bookingId)).unwrap();
      message.success("Xóa đặt phòng thành công!");
    } catch (error) {
      message.error("Xóa đặt phòng thất bại!");
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    form.setFieldsValue({
      ...booking,
      ngayDen: dayjs(booking.ngayDen),
      ngayDi: dayjs(booking.ngayDi),
    });
    setEditModalVisible(true);
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updateData = {
        ...values,
        ngayDen: values.ngayDen.format("YYYY-MM-DD"),
        ngayDi: values.ngayDi.format("YYYY-MM-DD"),
      };

      await dispatch(
        updateBooking({
          bookingId: selectedBooking.id,
          bookingData: updateData,
        })
      ).unwrap();

      message.success("Cập nhật đặt phòng thành công!");
      setEditModalVisible(false);
      form.resetFields();
      setSelectedBooking(null);
    } catch (error) {
      message.error("Cập nhật đặt phòng thất bại!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Đang chờ";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Khách hàng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      render: (maNguoiDung, record) => (
        <div>
          <div className="font-medium">ID: {maNguoiDung}</div>
          <div className="text-sm text-gray-500">
            SL khách: {record.soLuongKhach}
          </div>
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "maPhong",
      key: "maPhong",
      render: (maPhong) => (
        <Tag icon={<HomeOutlined />} color="blue">
          Phòng {maPhong}
        </Tag>
      ),
    },
    {
      title: "Ngày đến - Ngày đi",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>Đến: {dayjs(record.ngayDen).format("DD/MM/YYYY")}</div>
          <div>Đi: {dayjs(record.ngayDi).format("DD/MM/YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đặt phòng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Thống kê nhanh
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý đặt phòng</h1>
        
        {/* Thống kê */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đặt phòng"
                value={totalBookings}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã xác nhận"
                value={confirmedBookings}
                valueStyle={{ color: "#3f8600" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang chờ"
                value={pendingBookings}
                valueStyle={{ color: "#cf1322" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={completedBookings}
                valueStyle={{ color: "#1890ff" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        loading={loading}
        pagination={{
          total: totalBookings,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} đặt phòng`,
        }}
      />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa đặt phòng"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setSelectedBooking(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="maPhong"
            label="Mã phòng"
            rules={[{ required: true, message: "Vui lòng nhập mã phòng!" }]}
          >
            <Input placeholder="Nhập mã phòng" />
          </Form.Item>

          <Form.Item
            name="ngayDen"
            label="Ngày đến"
            rules={[{ required: true, message: "Vui lòng chọn ngày đến!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="ngayDi"
            label="Ngày đi"
            rules={[{ required: true, message: "Vui lòng chọn ngày đi!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="soLuongKhach"
            label="Số lượng khách"
            rules={[{ required: true, message: "Vui lòng nhập số lượng khách!" }]}
          >
            <Input type="number" placeholder="Nhập số lượng khách" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="pending">Đang chờ</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  form.resetFields();
                  setSelectedBooking(null);
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết đặt phòng"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedBooking(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalVisible(false);
              setSelectedBooking(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>ID đặt phòng:</strong> {selectedBooking.id}
              </div>
              <div>
                <strong>Mã người dùng:</strong> {selectedBooking.maNguoiDung}
              </div>
              <div>
                <strong>Mã phòng:</strong> {selectedBooking.maPhong}
              </div>
              <div>
                <strong>Số lượng khách:</strong> {selectedBooking.soLuongKhach}
              </div>
              <div>
                <strong>Ngày đến:</strong>{" "}
                {dayjs(selectedBooking.ngayDen).format("DD/MM/YYYY")}
              </div>
              <div>
                <strong>Ngày đi:</strong>{" "}
                {dayjs(selectedBooking.ngayDi).format("DD/MM/YYYY")}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <Tag color={getStatusColor(selectedBooking.status)}>
                  {getStatusText(selectedBooking.status)}
                </Tag>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManager;

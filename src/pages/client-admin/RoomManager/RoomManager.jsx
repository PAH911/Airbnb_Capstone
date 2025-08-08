import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms, searchRooms, deleteRoom } from "./adminRoomSlice";
import { Table, Button, Popconfirm, Input, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import RoomAddModal from "./RoomAddModal";
import RoomEditModal from "./RoomEditModal";
import { toast } from "react-toastify";

const { Search } = Input;

export default function RoomManager() {
  const dispatch = useDispatch();
  const {
    rooms,
    loading,
    error,
    addLoading,
    updateLoading,
    deleteLoading,
    searchLoading,
    pagination,
  } = useSelector((state) => state.adminRoom);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Debug admin token
    console.log("=== RoomManager Debug ===");
    console.log("Admin Token:", localStorage.getItem("accessToken"));
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Admin User:", user);

    // Load initial data
    handleSearch("", 1, 10);
  }, [dispatch]);

  const handleSearch = (keyword = "", pageIndex = 1, pageSize = 10) => {
    dispatch(searchRooms({ pageIndex, pageSize, keyword }));
    setCurrentPage(pageIndex);
  };

  const handleAddSuccess = () => {
    setOpenAddModal(false);
    handleSearch(searchText, currentPage);
    toast.success("Thêm phòng thành công!");
  };

  const handleAddFailed = (msg) => {
    toast.error(`Thêm phòng thất bại: ${msg || "Lỗi không xác định"}`);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setOpenEditModal(true);
  };

  const handleEditSuccess = () => {
    setOpenEditModal(false);
    setEditingRoom(null);
    handleSearch(searchText, currentPage);
    toast.success("Cập nhật phòng thành công!");
  };

  const handleEditFailed = (msg) => {
    toast.error(`Cập nhật thất bại: ${msg || "Lỗi không xác định"}`);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteRoom(id)).unwrap();
      toast.success("Xóa phòng thành công!");
      handleSearch(searchText, currentPage);
    } catch (error) {
      toast.error(error || "Xóa thất bại");
    }
  };

  const onSearchChange = (value) => {
    setSearchText(value);
    handleSearch(value, 1, 10);
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "Tên phòng",
      dataIndex: "tenPhong",
      key: "tenPhong",
      width: 200,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Vị trí",
      dataIndex: "maViTri",
      key: "maViTri",
      width: 80,
      align: "center",
    },
    {
      title: "Khách",
      dataIndex: "khach",
      key: "khach",
      width: 70,
      align: "center",
    },
    {
      title: "Phòng ngủ",
      dataIndex: "phongNgu",
      key: "phongNgu",
      width: 80,
      align: "center",
    },
    {
      title: "Giường",
      dataIndex: "giuong",
      key: "giuong",
      width: 70,
      align: "center",
    },
    {
      title: "Phòng tắm",
      dataIndex: "phongTam",
      key: "phongTam",
      width: 80,
      align: "center",
    },
    {
      title: "Giá/đêm",
      dataIndex: "giaTien",
      key: "giaTien",
      width: 120,
      render: (price) => (
        <span className="text-green-600 font-semibold">
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: "Tiện ích",
      key: "amenities",
      width: 200,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.mayGiat && (
            <Tag color="blue" size="small">
              Máy giặt
            </Tag>
          )}
          {record.banLa && (
            <Tag color="green" size="small">
              Bàn là
            </Tag>
          )}
          {record.tivi && (
            <Tag color="purple" size="small">
              Tivi
            </Tag>
          )}
          {record.dieuHoa && (
            <Tag color="cyan" size="small">
              Điều hòa
            </Tag>
          )}
          {record.wifi && (
            <Tag color="orange" size="small">
              Wifi
            </Tag>
          )}
          {record.bep && (
            <Tag color="red" size="small">
              Bếp
            </Tag>
          )}
          {record.doXe && (
            <Tag color="magenta" size="small">
              Đỗ xe
            </Tag>
          )}
          {record.hoBoi && (
            <Tag color="geekblue" size="small">
              Hồ bơi
            </Tag>
          )}
          {record.banUi && (
            <Tag color="lime" size="small">
              Bàn ủi
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 100,
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="Ảnh phòng"
            className="w-16 h-12 rounded-md object-cover"
          />
        ) : (
          <div className="w-16 h-12 rounded-md bg-gray-600 flex items-center justify-center text-yellow-400 font-bold text-xs">
            NULL
          </div>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#ffb92c", fontSize: 16 }} />}
            onClick={() => handleEdit(record)}
            title="Cập nhật"
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa phòng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ loading: deleteLoading }}
          >
            <Button
              type="text"
              icon={
                <DeleteOutlined style={{ color: "#ff4949", fontSize: 16 }} />
              }
              title="Xóa"
              size="small"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#ffb92c",
            margin: 0,
          }}
        >
          Danh sách phòng thuê
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: "#ffb92c",
            borderColor: "#ffb92c",
            color: "#222",
            fontWeight: 600,
          }}
          onClick={() => setOpenAddModal(true)}
          loading={addLoading}
        >
          Thêm phòng mới
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <Search
        placeholder="Tìm kiếm theo tên phòng..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={onSearchChange}
        onChange={(e) => !e.target.value && onSearchChange("")}
        style={{ marginBottom: 16, maxWidth: 400 }}
        loading={searchLoading}
      />

      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        loading={loading || searchLoading}
        pagination={{
          current: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: pagination.totalRow,
          showSizeChanger: true,
          pageSizeOptions: ["8", "16", "32", "50"],
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} phòng`,
          style: { color: "#fff" },
          onChange: (page, size) => {
            handleSearch(searchText, page, size);
          },
        }}
        bordered
        size="small"
        scroll={{ x: 1400 }}
        className="custom-ant-table"
      />

      <RoomAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
        onFailed={handleAddFailed}
      />

      <RoomEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={handleEditSuccess}
        onFailed={handleEditFailed}
        room={editingRoom}
      />
    </div>
  );
}

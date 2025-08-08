import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList, deleteUser } from "./adminUserSlice";
import { Table, Tag, Button, Popconfirm, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";

const { Search } = Input;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

export default function UserManager() {
  const dispatch = useDispatch();
  const {
    users = [],
    loading,
    error,
    deleteLoading,
  } = useSelector((state) => state.userList);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  // Lọc danh sách user theo searchText (tên hoặc email)
  const filteredUsers =
    users?.filter((user) => {
      if (!searchText.trim()) return true;
      const search = searchText.trim().toLowerCase();
      return (
        user?.name?.toLowerCase().includes(search) ||
        user?.email?.toLowerCase().includes(search)
      );
    }) || [];

  const handleAddSuccess = () => {
    setOpenAddModal(false);
    dispatch(fetchUserList());
    toast.success("Thêm người dùng thành công!");
  };
  const handleAddFailed = (msg) => {
    toast.error(`Thêm người dùng thất bại: ${msg || "Lỗi không xác định"}`);
  };
  const handleEdit = (user) => {
    setEditingUser(user);
    setOpenEditModal(true);
  };
  const handleEditSuccess = () => {
    setOpenEditModal(false);
    setEditingUser(null);
    dispatch(fetchUserList());
    toast.success("Cập nhật người dùng thành công!");
  };
  const handleEditFailed = (msg) => {
    toast.error(`Cập nhật thất bại: ${msg || "Lỗi không xác định"}`);
  };
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Xoá người dùng thành công!");
    } catch (error) {
      toast.error(error || "Xoá thất bại");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday) => formatDate(birthday),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender === true ? "Nam" : gender === false ? "Nữ" : "--",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colors = {
          ADMIN: "#ff4d4f", // đỏ tươi cho admin
          USER: "#52c41a", // xanh lá cho user
        };
        return (
          <Tag
            color={colors[role] || "gray"}
            style={{
              fontWeight: 600,
              color: "#fff",
              borderRadius: 4,
              padding: "0 8px",
            }}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#ffb92c", fontSize: 18 }} />}
            onClick={() => handleEdit(record)}
            title="Cập nhật"
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá user này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ loading: deleteLoading }}
          >
            <Button
              type="text"
              icon={
                <DeleteOutlined style={{ color: "#ff4949", fontSize: 18 }} />
              }
              title="Xoá"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
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
          Danh sách người dùng
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
        >
          Thêm người dùng
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <Search
        placeholder="Tìm theo tên hoặc email..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 360 }}
      />

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["8", "16", "32", "50"],
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} người dùng`,
        }}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
        className="custom-ant-table"
      />

      <UserAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
        onFailed={handleAddFailed}
      />
      <UserEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={handleEditSuccess}
        onFailed={handleEditFailed}
        user={editingUser}
      />
    </div>
  );
}

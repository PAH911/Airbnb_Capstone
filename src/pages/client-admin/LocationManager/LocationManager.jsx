import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "./locationSlice";
import { Table, Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LocationAddModal from "./LocationAddModal";
import { toast } from "react-toastify";

export default function LocationManager() {
  const dispatch = useDispatch();
  const { locations, loading, error, addLoading, addError } = useSelector(
    (state) => state.location
  );
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Debug: kiểm tra token và user info
    console.log("=== LocationManager Debug ===");
    console.log("Admin Token:", localStorage.getItem("accessToken"));
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Admin User:", user);
    console.log("User Role:", user.role);
    console.log("User ID:", user.id);
    console.log("User Email:", user.email);
    
    // Kiểm tra token hết hạn
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < currentTime;
        console.log("Token expiry:", new Date(payload.exp * 1000));
        console.log("Current time:", new Date(currentTime * 1000));
        console.log("Token expired:", isExpired);
        
        if (isExpired) {
          toast.error("Token đã hết hạn! Vui lòng đăng nhập lại.");
          return;
        }
      } catch (e) {
        console.error("Cannot decode token:", e);
      }
    }
    
    // Kiểm tra user có phải admin không
    if (!token) {
      console.error("❌ Không có admin token! Vui lòng đăng nhập admin.");
      toast.error("Vui lòng đăng nhập admin để sử dụng chức năng này");
      return;
    }
    
    // Kiểm tra role
    if (!user.role) {
      console.error("❌ User không có role:", user);
      toast.error("Tài khoản không có quyền truy cập");
      return;
    }
    
    if (user.role.toLowerCase() !== "admin") {
      console.error("❌ User không phải admin. Role hiện tại:", user.role);
      toast.error(`Tài khoản không có quyền admin. Role: ${user.role}`);
      return;
    }
    
    console.log("✅ Admin user verified, fetching locations...");
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleAddSuccess = () => {
    setOpenModal(false);
    dispatch(fetchLocations());
    toast.success("Thêm vị trí thành công!");
  };

  const handleAddFailed = (msg) => {
    toast.error(`Thêm vị trí thất bại: ${msg || "Lỗi không xác định"}`);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên vị trí", dataIndex: "tenViTri", key: "tenViTri" },
    { title: "Tỉnh thành", dataIndex: "tinhThanh", key: "tinhThanh" },
    { title: "Quốc gia", dataIndex: "quocGia", key: "quocGia" },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="Ảnh vị trí"
            className="w-16 h-12 rounded-md object-cover"
          />
        ) : (
          <div className="w-16 h-12 rounded-md bg-gray-600 flex items-center justify-center text-yellow-400 font-bold">
            NULL
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
          Danh sách vị trí
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
          onClick={() => setOpenModal(true)}
          loading={addLoading}
        >
          Thêm vị trí mới
        </Button>
      </div>

      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

      <Table
        columns={columns}
        dataSource={locations}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["8", "16", "32", "50"],
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} địa điểm`,
          style: { color: "#fff" },
        }}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
        className="custom-ant-table"
      />

      <LocationAddModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleAddSuccess}
        onFailed={handleAddFailed}
      />
    </div>
  );
}

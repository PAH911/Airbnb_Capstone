import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Select,
  Table,
  Space,
  Popconfirm,
  message,
  Rate,
} from "antd";
import {
  fetchComments,
  deleteComment,
  setSearchKeyword,
  setSortBy,
  setFilterByRoom,
  clearError,
} from "./adminCommentSlice";
import { fetchRooms } from "../RoomManager/adminRoomSlice";
import { fetchUserList } from "../UserManager/adminUserSlice";
import CommentAddModal from "./CommentAddModal";
import CommentEditModal from "./CommentEditModal";
import "./comment-dark-theme.css";

const { Search } = Input;
const { Option } = Select;

export default function CommentManager() {
  const dispatch = useDispatch();
  const {
    comments,
    loading,
    error,
    deleteLoading,
    searchKeyword,
    sortBy,
    filterByRoom,
  } = useSelector((state) => state.adminComment);
  const { rooms } = useSelector((state) => state.adminRoom);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    dispatch(fetchComments());
    dispatch(fetchRooms()); // Load danh sách phòng để filter
    dispatch(fetchUserList()); // Load danh sách user để hiển thị tên
  }, [dispatch]);

  useEffect(() => {
    console.log(
      "Current state - sortBy:",
      sortBy,
      "filterByRoom:",
      filterByRoom,
      "searchKeyword:",
      searchKeyword
    );
    console.log("Comments length:", comments.length);
  }, [sortBy, filterByRoom, searchKeyword, comments]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Sort comments first, then filter
  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.ngayBinhLuan);
    const dateB = new Date(b.ngayBinhLuan);
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Filter sorted comments
  const filteredComments = sortedComments.filter((comment) => {
    // Filter theo search keyword
    const matchesSearch =
      !searchKeyword ||
      comment.noiDung?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      comment.tenNguoiBinhLuan
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase());

    // Filter theo phòng
    const matchesRoom =
      !filterByRoom || comment.maPhong === parseInt(filterByRoom);

    return matchesSearch && matchesRoom;
  });

  const handleSearch = (value) => {
    dispatch(setSearchKeyword(value));
  };

  const handleSortChange = (value) => {
    console.log("Sort change:", value);
    dispatch(setSortBy(value));
  };

  const handleRoomFilterChange = (value) => {
    console.log("Room filter change:", value);
    dispatch(setFilterByRoom(value));
  };

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteComment(id)).unwrap();
      message.success("Xóa bình luận thành công!");
    } catch (error) {
      message.error(error || "Xóa bình luận thất bại!");
    }
  };

  const handleAddSuccess = () => {
    message.success("Thêm bình luận thành công!");
    // Không cần dispatch(fetchComments()) vì slice đã tự động cập nhật state
  };

  const handleEditSuccess = () => {
    message.success("Cập nhật bình luận thành công!");
    // Không cần dispatch(fetchComments()) vì slice đã tự động cập nhật state
  };

  const handleModalFailed = (error) => {
    message.error(error);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Người bình luận",
      dataIndex: "tenNguoiBinhLuan",
      key: "tenNguoiBinhLuan",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-500" />
          <div>
            <div className="font-medium text-white">{text}</div>
            <div className="text-sm text-gray-400">
              ID: {record.maNguoiBinhLuan}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "maPhong",
      key: "maPhong",
      render: (maPhong) => {
        const room = rooms.find((r) => r.id === maPhong);
        return (
          <div className="flex items-center gap-2">
            <HomeOutlined className="text-green-500" />
            <div>
              <div className="font-medium text-white">
                {room?.tenPhong || `Phòng ${maPhong}`}
              </div>
              <div className="text-sm text-gray-400">ID: {maPhong}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Nội dung",
      dataIndex: "noiDung",
      key: "noiDung",
      render: (text) => (
        <div className="max-w-xs">
          <div className="text-white line-clamp-3">{text}</div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "saoBinhLuan",
      key: "saoBinhLuan",
      width: 120,
      render: (rating) => (
        <Rate disabled defaultValue={rating} style={{ fontSize: 16 }} />
      ),
      sorter: (a, b) => a.saoBinhLuan - b.saoBinhLuan,
    },
    {
      title: "Ngày bình luận",
      dataIndex: "ngayBinhLuan",
      key: "ngayBinhLuan",
      width: 150,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-yellow-500" />
          <div>
            <div className="text-white">
              {new Date(date).toLocaleDateString("vi-VN")}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(date).toLocaleTimeString("vi-VN")}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.ngayBinhLuan) - new Date(b.ngayBinhLuan),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bình luận"
            description="Bạn có chắc chắn muốn xóa bình luận này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleteLoading}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <MessageOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Quản lý bình luận
              </h1>
              <p className="text-gray-400">
                Quản lý tất cả bình luận từ khách hàng
              </p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg"
          >
            Thêm bình luận
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-600">
          <div>
            <label className="block text-sm font-semibold text-yellow-400 mb-2">
              <SearchOutlined className="mr-1" /> Tìm kiếm
            </label>
            <Search
              placeholder="Tìm theo nội dung hoặc tên người bình luận..."
              allowClear
              onSearch={handleSearch}
              className="custom-search"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-yellow-400 mb-2">
              <CalendarOutlined className="mr-1" /> Sắp xếp theo ngày
            </label>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full custom-select"
              dropdownClassName="custom-dropdown"
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="oldest">Cũ nhất</Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-yellow-400 mb-2">
              <HomeOutlined className="mr-1" /> Lọc theo phòng
            </label>
            <Select
              value={filterByRoom}
              onChange={handleRoomFilterChange}
              placeholder="Chọn phòng"
              allowClear
              className="w-full custom-select"
              dropdownClassName="custom-dropdown"
            >
              {rooms.map((room) => (
                <Option key={room.id} value={room.id.toString()}>
                  {room.tenPhong} (ID: {room.id})
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white">
            <div className="text-2xl font-bold">{comments.length}</div>
            <div className="text-blue-100">Tổng bình luận</div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl text-white">
            <div className="text-2xl font-bold">{filteredComments.length}</div>
            <div className="text-green-100">Đang hiển thị</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 rounded-xl text-white">
            <div className="text-2xl font-bold">
              {filteredComments.length > 0
                ? (
                    filteredComments.reduce(
                      (sum, c) => sum + c.saoBinhLuan,
                      0
                    ) / filteredComments.length
                  ).toFixed(1)
                : "0"}
            </div>
            <div className="text-yellow-100">Đánh giá TB</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white">
            <div className="text-2xl font-bold">
              {[...new Set(filteredComments.map((c) => c.maPhong))].length}
            </div>
            <div className="text-purple-100">Phòng có BL</div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredComments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bình luận`,
          }}
          className="custom-table"
          scroll={{ x: 1000 }}
        />
      </div>

      {/* Modals */}
      <CommentAddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        onFailed={handleModalFailed}
      />

      <CommentEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        onFailed={handleModalFailed}
        comment={selectedComment}
      />
    </div>
  );
}

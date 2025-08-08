import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  EditOutlined,
  UserOutlined,
  HomeOutlined,
  StarOutlined,
  CloseOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Rate, message } from "antd";
import { updateComment } from "./adminCommentSlice";
import { fetchRooms } from "../RoomManager/adminRoomSlice";
import { fetchUserList } from "../UserManager/adminUserSlice";
import "./comment-dark-theme.css";

const { TextArea } = Input;
const { Option } = Select;

export default function CommentEditModal({
  open,
  onClose,
  onSuccess,
  onFailed,
  comment,
}) {
  const dispatch = useDispatch();
  const { updateLoading } = useSelector((state) => state.adminComment);
  const { rooms } = useSelector((state) => state.adminRoom);
  const { users } = useSelector((state) => state.userList);

  const [formData, setFormData] = useState({
    maNguoiBinhLuan: "",
    maPhong: "",
    noiDung: "",
    saoBinhLuan: 5,
    ngayBinhLuan: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && comment) {
      dispatch(fetchRooms());
      dispatch(fetchUserList());

      // Load dữ liệu comment vào form
      setFormData({
        maNguoiBinhLuan: comment.maNguoiBinhLuan?.toString() || "",
        maPhong: comment.maPhong?.toString() || "",
        noiDung: comment.noiDung || "",
        saoBinhLuan: comment.saoBinhLuan || 5,
        ngayBinhLuan: comment.ngayBinhLuan || "",
      });
      setErrors({});
    }
  }, [open, comment, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.maNguoiBinhLuan) {
      newErrors.maNguoiBinhLuan = "Vui lòng chọn người bình luận";
    }

    if (!formData.maPhong) {
      newErrors.maPhong = "Vui lòng chọn phòng";
    }

    if (!formData.noiDung.trim()) {
      newErrors.noiDung = "Vui lòng nhập nội dung bình luận";
    } else if (formData.noiDung.trim().length < 10) {
      newErrors.noiDung = "Nội dung bình luận phải có ít nhất 10 ký tự";
    } else if (formData.noiDung.trim().length > 500) {
      newErrors.noiDung = "Nội dung bình luận không được vượt quá 500 ký tự";
    }

    if (formData.saoBinhLuan < 1 || formData.saoBinhLuan > 5) {
      newErrors.saoBinhLuan = "Đánh giá phải từ 1 đến 5 sao";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const commentData = {
        ...formData,
        maNguoiBinhLuan: parseInt(formData.maNguoiBinhLuan),
        maPhong: parseInt(formData.maPhong),
        saoBinhLuan: parseInt(formData.saoBinhLuan),
      };

      await dispatch(
        updateComment({
          id: comment.id,
          commentData,
        })
      ).unwrap();

      onSuccess();
      onClose();
    } catch (error) {
      onFailed(error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error khi user bắt đầu nhập
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (!comment) return null;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-left align-middle shadow-2xl transition-all border border-gray-600">
                <style jsx>{`
                  .custom-select .ant-select-selector {
                    background: #374151 !important;
                    border-color: #4b5563 !important;
                    color: white !important;
                  }

                  .custom-select .ant-select-selection-placeholder {
                    color: #9ca3af !important;
                  }

                  .custom-select .ant-select-arrow {
                    color: white !important;
                  }

                  .custom-select .ant-select-selection-item {
                    color: white !important;
                  }

                  .custom-dropdown {
                    background: #374151 !important;
                  }

                  .custom-dropdown .ant-select-item {
                    color: white !important;
                  }

                  .custom-dropdown .ant-select-item-option-selected {
                    background: #3b82f6 !important;
                  }

                  .custom-dropdown .ant-select-item-option-active {
                    background: #4b5563 !important;
                  }

                  .custom-textarea .ant-input {
                    background: #374151 !important;
                    border-color: #4b5563 !important;
                    color: white !important;
                  }

                  .custom-textarea .ant-input::placeholder {
                    color: #9ca3af !important;
                  }
                `}</style>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
                      <EditOutlined className="text-white text-xl" />
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-white">
                        Chỉnh sửa bình luận
                      </Dialog.Title>
                      <p className="text-gray-400">
                        Cập nhật thông tin bình luận ID: {comment.id}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl"
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Người bình luận */}
                    <div>
                      <label className="block text-sm font-semibold text-yellow-400 mb-2">
                        <UserOutlined className="mr-2" />
                        Người bình luận *
                      </label>
                      <Select
                        value={formData.maNguoiBinhLuan}
                        onChange={(value) =>
                          handleInputChange("maNguoiBinhLuan", value)
                        }
                        placeholder="Chọn người bình luận"
                        className="w-full custom-select"
                        dropdownClassName="custom-dropdown"
                        size="large"
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {users.map((user) => (
                          <Option key={user.id} value={user.id.toString()}>
                            {user.name} - {user.email}
                          </Option>
                        ))}
                      </Select>
                      {errors.maNguoiBinhLuan && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.maNguoiBinhLuan}
                        </p>
                      )}
                    </div>

                    {/* Phòng */}
                    <div>
                      <label className="block text-sm font-semibold text-yellow-400 mb-2">
                        <HomeOutlined className="mr-2" />
                        Phòng *
                      </label>
                      <Select
                        value={formData.maPhong}
                        onChange={(value) =>
                          handleInputChange("maPhong", value)
                        }
                        placeholder="Chọn phòng"
                        className="w-full custom-select"
                        dropdownClassName="custom-dropdown"
                        size="large"
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {rooms.map((room) => (
                          <Option key={room.id} value={room.id.toString()}>
                            {room.tenPhong} (ID: {room.id})
                          </Option>
                        ))}
                      </Select>
                      {errors.maPhong && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.maPhong}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nội dung bình luận */}
                  <div>
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">
                      <FileTextOutlined className="mr-2" />
                      Nội dung bình luận *
                    </label>
                    <TextArea
                      value={formData.noiDung}
                      onChange={(e) =>
                        handleInputChange("noiDung", e.target.value)
                      }
                      placeholder="Nhập nội dung bình luận..."
                      rows={4}
                      maxLength={500}
                      showCount
                      className="w-full custom-textarea"
                    />
                    {errors.noiDung && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.noiDung}
                      </p>
                    )}
                  </div>

                  {/* Đánh giá */}
                  <div>
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">
                      <StarOutlined className="mr-2" />
                      Đánh giá *
                    </label>
                    <div className="flex items-center gap-4">
                      <Rate
                        value={formData.saoBinhLuan}
                        onChange={(value) =>
                          handleInputChange("saoBinhLuan", value)
                        }
                        style={{ fontSize: 24 }}
                      />
                      <span className="text-white font-semibold">
                        {formData.saoBinhLuan} sao
                      </span>
                    </div>
                    {errors.saoBinhLuan && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.saoBinhLuan}
                      </p>
                    )}
                  </div>

                  {/* Thông tin bổ sung */}
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-600">
                    <h4 className="text-yellow-400 font-semibold mb-2">
                      Thông tin bổ sung
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">ID bình luận:</span>
                        <span className="ml-2 font-medium">{comment.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Ngày tạo:</span>
                        <span className="ml-2 font-medium">
                          {new Date(comment.ngayBinhLuan).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          Tên người bình luận:
                        </span>
                        <span className="ml-2 font-medium">
                          {comment.tenNguoiBinhLuan}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-600">
                    <Button
                      type="default"
                      size="large"
                      onClick={onClose}
                      className="px-6 py-2 bg-gray-600 border-gray-600 text-white hover:bg-gray-500 hover:border-gray-500 rounded-xl"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={updateLoading}
                      className="px-8 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 rounded-xl shadow-lg"
                    >
                      {updateLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

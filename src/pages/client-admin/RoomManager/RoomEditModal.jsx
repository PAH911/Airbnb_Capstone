import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateRoom, uploadRoomImage } from "./adminRoomSlice";
import { fetchLocations } from "../LocationManager/locationSlice";
import {
  HomeOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  FileTextOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  EditOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import {
  FaUsers,
  FaBed,
  FaShower,
  FaSwimmingPool,
  FaWifi,
  FaCar,
  FaTv,
  FaSnowflake,
  FaUtensils,
} from "react-icons/fa";
import { MdLocalLaundryService, MdIron } from "react-icons/md";

export default function RoomEditModal({
  open,
  onClose,
  onSuccess,
  onFailed,
  room,
}) {
  const dispatch = useDispatch();
  const { updateLoading } = useSelector((state) => state.adminRoom);
  const { locations } = useSelector((state) => state.location);

  const [formData, setFormData] = useState({
    tenPhong: "",
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: "",
    giaTien: 100000,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: "",
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (open && room) {
      setFormData({
        tenPhong: room.tenPhong || "",
        khach: room.khach || 1,
        phongNgu: room.phongNgu || 1,
        giuong: room.giuong || 1,
        phongTam: room.phongTam || 1,
        moTa: room.moTa || "",
        giaTien: room.giaTien || 100000,
        mayGiat: room.mayGiat || false,
        banLa: room.banLa || false,
        tivi: room.tivi || false,
        dieuHoa: room.dieuHoa || false,
        wifi: room.wifi || false,
        bep: room.bep || false,
        doXe: room.doXe || false,
        hoBoi: room.hoBoi || false,
        banUi: room.banUi || false,
        maViTri: room.maViTri || "",
      });
      setImagePreview(room.hinhAnh || null);

      // Load locations when modal opens
      dispatch(fetchLocations());
    }
  }, [open, room, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" || name === "maViTri"
          ? Number(value)
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenPhong.trim()) {
      newErrors.tenPhong = "Tên phòng không được để trống";
    }

    if (!formData.moTa.trim()) {
      newErrors.moTa = "Mô tả không được để trống";
    }

    if (!formData.maViTri) {
      newErrors.maViTri = "Vui lòng chọn vị trí";
    }

    if (formData.khach < 1) {
      newErrors.khach = "Số khách phải ít nhất là 1";
    }

    if (formData.phongNgu < 1) {
      newErrors.phongNgu = "Số phòng ngủ phải ít nhất là 1";
    }

    if (formData.giuong < 1) {
      newErrors.giuong = "Số giường phải ít nhất là 1";
    }

    if (formData.phongTam < 1) {
      newErrors.phongTam = "Số phòng tắm phải ít nhất là 1";
    }

    if (formData.giaTien < 1000) {
      newErrors.giaTien = "Giá tiền phải ít nhất 1,000 VND";
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
      console.log("=== Form Data Debug ===", formData);
      // Update room info first
      const updateResult = await dispatch(
        updateRoom({
          id: room.id,
          room: formData,
          imageFile: imageFile,
        })
      );

      if (updateRoom.fulfilled.match(updateResult)) {
        onSuccess && onSuccess();
        handleClose();
      } else {
        console.error("=== Update Room Failed ===", updateResult.payload);
        // Kiểm tra nếu lỗi liên quan đến upload ảnh
        if (
          (updateResult.payload && updateResult.payload.includes("upload")) ||
          (updateResult.payload && updateResult.payload.includes("image")) ||
          (updateResult.payload && updateResult.payload.includes("hình"))
        ) {
          onFailed &&
            onFailed(
              `Cập nhật phòng thành công nhưng upload hình ảnh thất bại: ${updateResult.payload}`
            );
        } else {
          onFailed &&
            onFailed(updateResult.payload || "Cập nhật phòng thất bại");
        }
      }
    } catch (error) {
      console.error("=== Update Room Error ===", error);
      onFailed && onFailed(error.message || "Lỗi không xác định");
    }
  };

  const handleClose = () => {
    setFormData({
      tenPhong: "",
      khach: 1,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      moTa: "",
      giaTien: 100000,
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
      maViTri: "",
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    onClose && onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  if (!room) return null;

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-left align-middle shadow-2xl transition-all border border-gray-700">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-white mb-8 text-center flex items-center justify-center gap-2"
                >
                  <EditOutlined className="text-yellow-400" /> Cập nhật phòng:{" "}
                  {room.tenPhong}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Tên phòng và Vị trí */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tên phòng */}
                    <div>
                      <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                        <FileTextOutlined /> Tên phòng *
                      </label>
                      <input
                        type="text"
                        name="tenPhong"
                        value={formData.tenPhong}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Nhập tên phòng"
                      />
                      {errors.tenPhong && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <ExclamationCircleOutlined /> {errors.tenPhong}
                        </p>
                      )}
                    </div>

                    {/* Vị trí */}
                    <div>
                      <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                        <EnvironmentOutlined /> Vị trí *
                      </label>
                      <select
                        name="maViTri"
                        value={formData.maViTri}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fbbf24' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: "right 0.5rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1.5em 1.5em",
                        }}
                      >
                        <option value="">Chọn vị trí</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.tenViTri} - {location.tinhThanh},{" "}
                            {location.quocGia}
                          </option>
                        ))}
                      </select>
                      {errors.maViTri && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <ExclamationCircleOutlined /> {errors.maViTri}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Thông tin cơ bản */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                        <FaUsers className="text-blue-400" /> Số khách
                      </label>
                      <input
                        type="number"
                        name="khach"
                        value={formData.khach}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center"
                      />
                      {errors.khach && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <ExclamationCircleOutlined /> {errors.khach}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                        <FaBed className="text-purple-400" /> Phòng ngủ
                      </label>
                      <input
                        type="number"
                        name="phongNgu"
                        value={formData.phongNgu}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center"
                      />
                      {errors.phongNgu && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <ExclamationCircleOutlined /> {errors.phongNgu}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                        <FaBed className="text-green-400" /> Giường
                      </label>
                      <input
                        type="number"
                        name="giuong"
                        value={formData.giuong}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center"
                      />
                      {errors.giuong && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <ExclamationCircleOutlined /> {errors.giuong}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                        <FaShower className="text-cyan-400" /> Phòng tắm
                      </label>
                      <input
                        type="number"
                        name="phongTam"
                        value={formData.phongTam}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center"
                      />
                      {errors.phongTam && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <ExclamationCircleOutlined /> {errors.phongTam}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Giá tiền */}
                  <div>
                    <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                      <DollarOutlined className="text-green-500" /> Giá tiền
                      (VND/đêm) *
                    </label>
                    <input
                      type="number"
                      name="giaTien"
                      value={formData.giaTien}
                      onChange={handleInputChange}
                      min="1000"
                      step="1000"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    />
                    <p className="text-gray-400 text-sm mt-2 bg-gray-800/50 px-3 py-2 rounded-lg flex items-center gap-2">
                      <DollarOutlined className="text-yellow-400" />{" "}
                      {formatCurrency(formData.giaTien)} VND
                    </p>
                    {errors.giaTien && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined /> {errors.giaTien}
                      </p>
                    )}
                  </div>

                  {/* Row 4: Mô tả */}
                  <div>
                    <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                      <FileTextOutlined /> Mô tả *
                    </label>
                    <textarea
                      name="moTa"
                      value={formData.moTa}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                      placeholder="Mô tả chi tiết về phòng..."
                    />
                    {errors.moTa && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined /> {errors.moTa}
                      </p>
                    )}
                  </div>

                  {/* Row 5: Hình ảnh */}
                  <div>
                    <label className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                      <CameraOutlined /> Hình ảnh phòng
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                      />
                      {imagePreview && (
                        <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-600">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-40 h-32 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 6: Tiện ích */}
                  <div>
                    <label className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                      <HomeOutlined /> Tiện ích
                    </label>
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-600">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            key: "mayGiat",
                            label: "Máy giặt",
                            icon: (
                              <MdLocalLaundryService className="text-blue-400" />
                            ),
                            color: "hover:bg-blue-900/30",
                          },
                          {
                            key: "banLa",
                            label: "Bàn là",
                            icon: <MdIron className="text-gray-400" />,
                            color: "hover:bg-gray-700/30",
                          },
                          {
                            key: "tivi",
                            label: "Tivi",
                            icon: <FaTv className="text-purple-400" />,
                            color: "hover:bg-purple-900/30",
                          },
                          {
                            key: "dieuHoa",
                            label: "Điều hòa",
                            icon: <FaSnowflake className="text-cyan-400" />,
                            color: "hover:bg-cyan-900/30",
                          },
                          {
                            key: "wifi",
                            label: "Wifi",
                            icon: <FaWifi className="text-orange-400" />,
                            color: "hover:bg-orange-900/30",
                          },
                          {
                            key: "bep",
                            label: "Bếp",
                            icon: <FaUtensils className="text-red-400" />,
                            color: "hover:bg-red-900/30",
                          },
                          {
                            key: "doXe",
                            label: "Đỗ xe",
                            icon: <FaCar className="text-green-400" />,
                            color: "hover:bg-green-900/30",
                          },
                          {
                            key: "hoBoi",
                            label: "Hồ bơi",
                            icon: <FaSwimmingPool className="text-blue-500" />,
                            color: "hover:bg-blue-900/30",
                          },
                          {
                            key: "banUi",
                            label: "Bàn ủi",
                            icon: <ToolOutlined className="text-yellow-400" />,
                            color: "hover:bg-yellow-900/30",
                          },
                        ].map((amenity) => (
                          <label
                            key={amenity.key}
                            className={`flex items-center space-x-3 text-white bg-gray-700/50 p-4 rounded-xl ${amenity.color} transition-all duration-200 cursor-pointer group border border-gray-600/50 hover:border-gray-500`}
                          >
                            <input
                              type="checkbox"
                              name={amenity.key}
                              checked={formData[amenity.key]}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded-lg focus:ring-yellow-500 focus:ring-2"
                            />
                            <span className="text-xl">{amenity.icon}</span>
                            <span className="text-sm font-medium group-hover:text-yellow-400 transition-colors duration-200">
                              {amenity.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-3 text-sm font-semibold text-gray-300 bg-gray-600/50 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 border border-gray-500 flex items-center gap-2"
                      disabled={updateLoading || uploadingImage}
                    >
                      <CloseOutlined /> Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading || uploadingImage}
                      className="px-6 py-3 text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center gap-2"
                    >
                      {updateLoading ? (
                        <>
                          <span className="animate-spin">⏳</span> Đang cập
                          nhật...
                        </>
                      ) : uploadingImage ? (
                        <>
                          <CameraOutlined /> Đang tải ảnh...
                        </>
                      ) : (
                        <>
                          <CheckCircleOutlined /> Cập nhật
                        </>
                      )}
                    </button>
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

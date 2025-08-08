import React, { useState, useEffect } from "react";
import { Modal, Slider, Select, InputNumber, Button, Rate } from "antd";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import "./room-filter.css";

const { Option } = Select;

const RoomFilter = ({
  visible,
  onClose,
  onApplyFilter,
  locations,
  rooms,
  currentFilters,
}) => {
  const theme = useSelector((state) => state.theme?.theme || "light");

  const [filters, setFilters] = useState({
    priceRange: [0, 10000000],
    location: null,
    rating: 0,
    guests: 1,
  });

  // Tính toán giá min/max từ danh sách phòng
  const priceStats = React.useMemo(() => {
    if (!rooms || rooms.length === 0) return { min: 0, max: 10000000 };

    const prices = rooms
      .map((room) => room.giaTien || 0)
      .filter((price) => price > 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [rooms]);

  useEffect(() => {
    if (currentFilters) {
      setFilters({
        priceRange: currentFilters.priceRange || [
          priceStats.min,
          priceStats.max,
        ],
        location: currentFilters.location || null,
        rating: currentFilters.rating || 0,
        guests: currentFilters.guests || 1,
      });
    } else {
      setFilters({
        priceRange: [priceStats.min, priceStats.max],
        location: null,
        rating: 0,
        guests: 1,
      });
    }
  }, [currentFilters, priceStats, visible]);

  const handlePriceChange = (value) => {
    setFilters((prev) => ({ ...prev, priceRange: value }));
  };

  const handleMinPriceChange = (value) => {
    const newMin = Math.max(
      priceStats.min,
      Math.min(value || 0, filters.priceRange[1])
    );
    setFilters((prev) => ({
      ...prev,
      priceRange: [newMin, prev.priceRange[1]],
    }));
  };

  const handleMaxPriceChange = (value) => {
    const newMax = Math.min(
      priceStats.max,
      Math.max(value || 0, filters.priceRange[0])
    );
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], newMax],
    }));
  };

  const handleLocationChange = (value) => {
    setFilters((prev) => ({ ...prev, location: value }));
  };

  const handleRatingChange = (value) => {
    setFilters((prev) => ({ ...prev, rating: value }));
  };

  const handleGuestsChange = (value) => {
    setFilters((prev) => ({ ...prev, guests: value || 1 }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [priceStats.min, priceStats.max],
      location: null,
      rating: 0,
      guests: 1,
    };
    setFilters(resetFilters);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          <span>Bộ lọc tìm kiếm</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="room-filter-modal"
      destroyOnClose
      maskClosable={false}
      centered
      styles={{
        content: {
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
        body: {
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
          padding: "24px",
        },
        header: {
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
          padding: "16px 24px",
        },
        mask: {
          backgroundColor:
            theme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.45)",
        },
      }}
    >
      <div
        className={`space-y-6 p-6 rounded-lg ${
          theme === "dark"
            ? "!bg-gray-800 !text-white"
            : "!bg-white !text-gray-900"
        }`}
        style={{
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        {/* Giá phòng */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Khoảng giá</h3>
          <div className="space-y-4">
            <Slider
              range
              min={priceStats.min}
              max={priceStats.max}
              value={filters.priceRange}
              onChange={handlePriceChange}
              tooltip={{
                formatter: (value) => `${formatPrice(value)}₫`,
              }}
              className="custom-slider"
            />
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Từ</label>
                <InputNumber
                  min={priceStats.min}
                  max={filters.priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={handleMinPriceChange}
                  formatter={(value) => `${formatPrice(value)}`}
                  parser={(value) => value.replace(/\D/g, "")}
                  className="w-full"
                  addonAfter="₫"
                />
              </div>
              <div className="pt-6">-</div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Đến</label>
                <InputNumber
                  min={filters.priceRange[0]}
                  max={priceStats.max}
                  value={filters.priceRange[1]}
                  onChange={handleMaxPriceChange}
                  formatter={(value) => `${formatPrice(value)}`}
                  parser={(value) => value.replace(/\D/g, "")}
                  className="w-full"
                  addonAfter="₫"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Địa điểm */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Địa điểm</h3>
          <Select
            placeholder="Chọn địa điểm"
            value={filters.location}
            onChange={handleLocationChange}
            className="w-full"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {locations.map((location) => (
              <Option
                key={location.id}
                value={location.id}
                label={`${location.tenViTri}, ${location.tinhThanh}`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={location.hinhAnh}
                    alt={location.tenViTri}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span>
                    {location.tenViTri}, {location.tinhThanh}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {/* Đánh giá */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Đánh giá tối thiểu</h3>
          <div className="space-y-3">
            <Rate
              value={filters.rating}
              onChange={handleRatingChange}
              allowClear
              className="text-yellow-400"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filters.rating === 0
                ? "Tất cả đánh giá"
                : `Từ ${filters.rating} sao trở lên`}
            </div>
          </div>
        </div>

        {/* Số khách */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Số khách</h3>
          <InputNumber
            min={1}
            max={20}
            value={filters.guests}
            onChange={handleGuestsChange}
            className="w-full"
            addonBefore="👥"
            placeholder="Số lượng khách"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button type="default" onClick={handleReset} className="flex-1">
            Đặt lại
          </Button>
          <Button
            type="primary"
            onClick={handleApply}
            className="flex-1 bg-rose-500 hover:bg-rose-600 border-rose-500"
          >
            Áp dụng bộ lọc
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RoomFilter;

import React, { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RoomFilter from "./RoomFilter";
import * as locationService from "../../../services/locationService";
import * as roomService from "../../../services/roomService";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { fetchRoomListData, setFilters, clearFilters } from "./RoomListSlice";
import { formatRatingDisplay } from "../../../utils/ratingUtils";
import "./room-filter.css";

export default function RoomListPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme?.theme || "light");
  const searchCriteria = useSelector((state) => state.search?.searchCriteria);
  const {
    locations,
    rooms,
    roomsByLocation,
    filteredRoomsByLocation,
    filters,
    loading,
  } = useSelector((state) => state.roomList);

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const locationsPerPage = 5;
  const navigate = useNavigate();
  const scrollRefs = useRef({});
  const [isDragging, setIsDragging] = useState({});
  const [dragStart, setDragStart] = useState({});

  // Sử dụng filteredRoomsByLocation thay vì roomsByLocation để hiển thị
  const displayRoomsByLocation =
    Object.keys(filteredRoomsByLocation).length > 0
      ? filteredRoomsByLocation
      : roomsByLocation;

  const scrollLeft = (locationId) => {
    const container = scrollRefs.current[locationId];
    if (!container) return;

    const cardWidth = 270 + 24; // 270px (min-w-[270px]) + 24px (gap-6)
    const currentScroll = container.scrollLeft;
    const targetScroll = Math.max(0, currentScroll - cardWidth);

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const scrollRight = (locationId) => {
    const container = scrollRefs.current[locationId];
    if (!container) return;

    const cardWidth = 270 + 24; // 270px (min-w-[270px]) + 24px (gap-6)
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = Math.min(maxScroll, currentScroll + cardWidth);

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  // Drag scroll handlers
  const handleMouseDown = (e, locationId) => {
    const container = scrollRefs.current[locationId];
    if (!container) return;

    setIsDragging((prev) => ({ ...prev, [locationId]: true }));
    setDragStart((prev) => ({
      ...prev,
      [locationId]: {
        x: e.pageX,
        scrollLeft: container.scrollLeft,
      },
    }));

    container.style.scrollBehavior = "auto"; // Tắt smooth scroll khi drag
    e.preventDefault();
  };

  const handleMouseMove = (e, locationId) => {
    if (!isDragging[locationId]) return;

    const container = scrollRefs.current[locationId];
    if (!container || !dragStart[locationId]) return;

    e.preventDefault();

    // Tính toán khoảng cách di chuyển
    const x = e.pageX;
    const walkX = (x - dragStart[locationId].x) * 1.5; // Tăng độ nhạy
    const newScrollLeft = dragStart[locationId].scrollLeft - walkX;

    // Áp dụng scroll ngay lập tức
    container.scrollLeft = newScrollLeft;
  };

  const handleMouseUp = (locationId) => {
    setIsDragging((prev) => ({ ...prev, [locationId]: false }));

    // Bật lại smooth scroll
    const container = scrollRefs.current[locationId];
    if (container) {
      container.style.scrollBehavior = "smooth";
    }
  };

  const handleMouseLeave = (locationId) => {
    setIsDragging((prev) => ({ ...prev, [locationId]: false }));

    // Bật lại smooth scroll
    const container = scrollRefs.current[locationId];
    if (container) {
      container.style.scrollBehavior = "smooth";
    }
  };

  useEffect(() => {
    // Global mouse event listeners để xử lý drag khi chuột ra ngoài container
    const handleGlobalMouseMove = (e) => {
      Object.keys(isDragging).forEach((locationId) => {
        if (isDragging[locationId]) {
          handleMouseMove(e, locationId);
        }
      });
    };

    const handleGlobalMouseUp = () => {
      Object.keys(isDragging).forEach((locationId) => {
        if (isDragging[locationId]) {
          handleMouseUp(locationId);
        }
      });
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    dispatch(fetchRoomListData());
  }, [dispatch]);

  // Áp dụng filter từ Hero search khi component mount
  useEffect(() => {
    if (searchCriteria && searchCriteria.isFromHeroSearch) {
      const newFilters = {
        priceRange: filters.priceRange, // Giữ nguyên price range
        location: searchCriteria.locationId,
        rating: 0, // Reset rating
        guests: searchCriteria.guests,
      };

      dispatch(setFilters(newFilters));
    }
  }, [searchCriteria, dispatch]);

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;

  // Lọc locations có phòng trước khi phân trang
  const availableLocations = locations.filter(
    (loc) =>
      displayRoomsByLocation[loc.id] &&
      displayRoomsByLocation[loc.id].length > 0
  );

  const currentLocations = availableLocations.slice(
    indexOfFirstLocation,
    indexOfLastLocation
  );
  const totalPages = Math.ceil(availableLocations.length / locationsPerPage);

  // Lọc các địa điểm có phòng phù hợp (chính là currentLocations vì đã được lọc)
  const locationsWithRooms = currentLocations;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyFilter = (newFilters) => {
    dispatch(setFilters(newFilters));
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  // Đếm số filter đang active
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.rating > 0) count++;
    if (filters.guests > 1) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++;
    return count;
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-[#18181c] text-white"
          : "bg-gradient-to-br from-rose-50 via-white to-pink-100 text-gray-900"
      }`}
    >
      <Header />
      <main className="flex-1 w-full mx-auto px-4 py-10 dark:bg-[#101624]">
        {/* Filter Button */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold dark:text-white">
            Danh sách phòng theo địa điểm
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`filter-button flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                activeFiltersCount() > 0
                  ? "filter-active"
                  : theme === "dark"
                  ? "!bg-gray-800 hover:!bg-gray-700 !text-white !border-gray-600"
                  : "!bg-white hover:!bg-gray-50 !text-gray-800 !border-gray-300"
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Bộ lọc</span>
            </button>
            {activeFiltersCount() > 0 && (
              <div className="filter-badge">{activeFiltersCount()}</div>
            )}
          </div>
        </div>

        {/* Filter Modal */}
        <RoomFilter
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilter={handleApplyFilter}
          locations={locations}
          rooms={rooms}
          currentFilters={filters}
        />

        {loading ? (
          <div className="flex flex-col gap-10">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            {/* Hiển thị thông báo khi không có địa điểm nào có phòng phù hợp */}
            {locationsWithRooms.length === 0 && activeFiltersCount() > 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-semibold mb-2 dark:text-white">
                  Không tìm thấy phòng phù hợp
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Hãy thử điều chỉnh bộ lọc để tìm thêm kết quả
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              locationsWithRooms.map((loc, idx) => (
                <section key={loc.id}>
                  <motion.div
                    className="flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <img
                      src={loc.hinhAnh}
                      alt={loc.tenViTri}
                      className="w-12 h-12 rounded-xl object-cover shadow-lg border border-gray-200 dark:border-gray-700"
                    />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {loc.tenViTri}
                    </h2>
                    <span className="text-gray-500 dark:!text-gray-300 text-lg font-normal">
                      {loc.tinhThanh}, {loc.quocGia}
                    </span>
                  </motion.div>
                  <div className="relative group">
                    {/* Nút scroll trái */}
                    <button
                      onClick={() => scrollLeft(loc.id)}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-white hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Nút scroll phải */}
                    <button
                      onClick={() => scrollRight(loc.id)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-white hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>

                    <div
                      ref={(el) => (scrollRefs.current[loc.id] = el)}
                      className={`flex gap-6 overflow-x-auto pt-5 pb-10 scrollbar-hide select-none transition-all duration-200 ${
                        isDragging[loc.id] ? "cursor-grabbing" : "cursor-grab"
                      }`}
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitScrollbar: { display: "none" },
                        scrollBehavior: "smooth",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, loc.id)}
                      onMouseLeave={() => handleMouseLeave(loc.id)}
                    >
                      {displayRoomsByLocation[loc.id]?.length === 0 ? (
                        <div className="text-gray-400 italic">
                          {activeFiltersCount() > 0
                            ? "Không có phòng nào phù hợp với bộ lọc."
                            : "Chưa có phòng nào."}
                        </div>
                      ) : (
                        displayRoomsByLocation[loc.id]?.map((room, i) => (
                          <motion.div
                            key={room.id}
                            className="min-w-[270px] max-w-xs rounded-2xl shadow-xl border-0 bg-white/90 dark:bg-[#23232b] flex-shrink-0 hover:scale-[1.04] transition-transform duration-300 relative overflow-hidden group cursor-pointer"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            onClick={(e) => {
                              // Chỉ navigate khi không đang drag
                              if (!isDragging[loc.id]) {
                                navigate(`/room/${room.id}`);
                              }
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <img
                              src={room.hinhAnh}
                              alt={room.tenPhong}
                              className="h-44 w-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-4 flex flex-col gap-1">
                              {room.duocYeuThich && (
                                <span className="bg-rose-100 text-rose-500 dark:bg-gray-700 dark:text-rose-300 text-xs font-semibold px-2 py-1 rounded-full animate-fade-in">
                                  Được khách yêu thích
                                </span>
                              )}
                              <div className="font-semibold text-lg dark:text-white line-clamp-1">
                                {room.tenPhong}
                              </div>
                              <div className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2 mb-1">
                                {room.moTa}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-rose-500 font-bold text-base">
                                  {room.giaTien?.toLocaleString()}₫ / đêm
                                </span>
                                <span className="text-yellow-500 font-semibold flex items-center gap-1">
                                  {formatRatingDisplay(room).hasComments ? (
                                    <>
                                      ★ {formatRatingDisplay(room).rating}
                                      <span className="text-gray-500 text-xs">
                                        (
                                        {
                                          formatRatingDisplay(room)
                                            .totalComments
                                        }
                                        )
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-gray-400 text-xs">
                                      {formatRatingDisplay(room).displayText}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  i + 1 === currentPage
                    ? "bg-rose-500 text-white hover:bg-rose-600 dark:hover:bg-rose-600"
                    : "bg-gray-800 dark:bg-gray-800 text-white dark:text-white border border-gray-600 dark:border-gray-600"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

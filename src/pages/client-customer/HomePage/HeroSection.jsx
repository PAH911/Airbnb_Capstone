import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as locationService from "../../../services/locationService";
import * as roomService from "../../../services/roomService";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar as CalendarIcon, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";

export default function HeroSection() {
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [guests, setGuests] = useState(1);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    locationService.getLocations().then((res) => {
      setLocations(res.data.content || []);
    });
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, type: "spring" },
    }),
  };

  // Xử lý chọn ngày: luôn trả về object {from, to}
  const handleDateSelect = (range) => {
    if (!range || typeof range !== "object") {
      setDateRange({ from: null, to: null });
      return;
    }
    // Nếu chỉ chọn 1 ngày nhiều lần, vẫn giữ object {from, to}
    setDateRange({ from: range.from || null, to: range.to || null });
  };

  // Xử lý tìm kiếm phòng
  const handleSearch = async () => {
    if (!locationId) return;
    setLoading(true);
    try {
      const res = await roomService.getRoomsByLocation(locationId);
      let rooms = res.data.content || [];
      if (guests) rooms = rooms.filter((r) => r.khach >= guests);
      navigate(
        `/rooms?locationId=${locationId}` +
          (dateRange.from
            ? `&checkIn=${dayjs(dateRange.from).format("YYYY-MM-DD")}`
            : "") +
          (dateRange.to
            ? `&checkOut=${dayjs(dateRange.to).format("YYYY-MM-DD")}`
            : "") +
          (guests ? `&guests=${guests}` : "")
      );
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Helper: lấy label địa điểm đầy đủ
  const getLocationLabel = (id) => {
    const loc = locations.find((l) => l.id === id);
    if (!loc) return "Địa điểm";
    return (
      <span className="flex items-center gap-1">
        <span className="font-semibold text-rose-500 dark:text-pink-400">
          {loc.tenViTri}
        </span>
        <span className="text-gray-500 dark:text-gray-300 text-sm">
          {loc.tinhThanh}, {loc.quocGia}
        </span>
      </span>
    );
  };

  // Helper: hiển thị ngày rõ ràng
  const getDateLabel = () => {
    if (!dateRange || !dateRange.from)
      return (
        <span className="text-gray-400 dark:text-gray-400">
          Nhận phòng → Trả phòng
        </span>
      );
    if (dateRange.from && dateRange.to) {
      return (
        <span>
          <span className="font-semibold text-rose-500 dark:text-pink-400">
            {dayjs(dateRange.from).format("DD/MM/YYYY")}
          </span>
          <span className="mx-1 text-gray-400 dark:text-gray-400">→</span>
          <span className="font-semibold text-rose-500 dark:text-pink-400">
            {dayjs(dateRange.to).format("DD/MM/YYYY")}
          </span>
        </span>
      );
    }
    return (
      <span>
        <span className="font-semibold text-rose-500 dark:text-pink-400">
          {dayjs(dateRange.from).format("DD/MM/YYYY")}
        </span>
        <span className="mx-1 text-gray-400 dark:text-gray-400">→</span>
        <span className="text-gray-400 dark:text-gray-400">Trả phòng</span>
      </span>
    );
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-white dark:bg-[#101624] text-gray-900 dark:text-white">
      <div className="w-full max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-5xl md:text-7xl font-extrabold mb-3 text-gray-900 dark:text-white drop-shadow-lg text-center leading-tight"
        >
          Khám phá kỳ nghỉ mơ ước của bạn
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 mb-10 block text-center font-medium"
        >
          Đặt phòng dễ dàng, trải nghiệm không gian độc đáo với TripNest.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="w-full"
        >
          <div
            className="w-full max-w-3xl mx-auto rounded-full bg-white dark:bg-[#181f2a] p-2 md:p-4 shadow-xl flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4"
            style={{
              boxShadow:
                "0 8px 40px 0 rgba(244,63,94,0.10), 0 2px 24px 0 #f43f5e22",
            }}
          >
            {/* Địa điểm */}
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger className="rounded-full border border-gray-200 dark:border-gray-700 focus:ring-rose-400 w-full min-w-[180px] md:w-64 h-12 px-4 flex items-center gap-2 bg-white dark:bg-[#232b39] dark:text-white">
                <MapPin className="w-5 h-5 text-rose-500 dark:text-pink-400 mr-2" />
                <SelectValue placeholder="Địa điểm">
                  {getLocationLabel(locationId)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60 overflow-y-auto min-w-[260px] bg-white dark:bg-[#232b39] dark:text-white border border-gray-200 dark:border-gray-700">
                {locations.map((loc) => (
                  <SelectItem
                    key={loc.id}
                    value={loc.id}
                    className="flex items-center gap-2"
                  >
                    <span className="font-semibold text-rose-500 dark:text-pink-400">
                      {loc.tenViTri}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-300 ml-2">
                      {loc.tinhThanh}, {loc.quocGia}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Ngày nhận/trả phòng */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border border-gray-200 dark:border-gray-700 w-full min-w-[220px] md:w-72 h-12 px-4 flex items-center gap-2 justify-start text-left font-normal overflow-hidden bg-white dark:bg-[#232b39] dark:text-white"
                >
                  <CalendarIcon className="w-5 h-5 text-rose-500 dark:text-pink-400 mr-2" />
                  {getDateLabel()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-[#232b39] dark:text-white rounded-2xl shadow-xl border-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="rounded-2xl"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {/* Số khách */}
            <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232b39] h-12 px-4 w-full min-w-[80px] md:w-28 dark:text-white">
              <Users className="w-5 h-5 text-rose-500 dark:text-pink-400 mr-2" />
              <Input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="border-none shadow-none focus:ring-0 px-0 w-10 text-base bg-transparent dark:text-white"
                style={{ minWidth: 30, textAlign: "center" }}
                placeholder="Khách"
              />
            </div>
            {/* Nút tìm kiếm */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="h-full flex items-center shrink-0"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-500 dark:from-pink-700 dark:to-rose-400 hover:from-pink-500 hover:to-rose-500 border-none rounded-full h-12 text-lg font-semibold px-8 shadow-lg text-white"
                onClick={handleSearch}
                disabled={!locationId}
                loading={loading || undefined}
              >
                <Search className="w-5 h-5 mr-2" /> Tìm kiếm
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

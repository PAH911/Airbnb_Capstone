import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomsByLocation } from "./locationSlice";
import RoomMap from "./RoomMap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LocationPage() {
  const dispatch = useDispatch();
  const { rooms = [], loading, error } = useSelector((state) => state.location);

  useEffect(() => {
    dispatch(fetchRoomsByLocation());
  }, [dispatch]);

  const locations = Array.isArray(rooms)
    ? rooms.map((room) => ({
        lat: room.viDo,
        lng: room.kinhDo,
        name: room.tenPhong,
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Danh sách phòng theo vị trí</h2>
      {/* List phòng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {rooms?.map((room) => (
          <div
            key={room.id}
            className="rounded-xl shadow border p-4 bg-white flex flex-col items-center"
          >
            <img
              src={room.hinhAnh}
              alt={room.tenPhong}
              className="w-full h-48 object-cover rounded-xl mb-3"
            />
            <div className="font-semibold text-lg mb-2">{room.tenPhong}</div>
            <div className="text-gray-500 text-sm">{room.diaChi}</div>
            <div className="text-yellow-500 font-bold mt-1">
              ★ {room.saoDanhGia || "5.0"}
            </div>
            <a
              href={`/room/${room.id}`}
              className="mt-2 text-rose-500 hover:underline"
            >
              Xem chi tiết
            </a>
          </div>
        ))}
      </div>
      {/* Map hiển thị phòng */}
      <RoomMap rooms={rooms} />
    </div>
  );
}

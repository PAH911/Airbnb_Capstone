import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix marker icon không hiện (Leaflet bug khi dùng với webpack)
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function RoomMap({ rooms }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Không có phòng nào phù hợp để hiển thị bản đồ.
      </div>
    );
  }

  // Tính trung bình các vị trí để focus
  const center = [
    rooms.reduce((sum, r) => sum + (r.viDo || 0), 0) / rooms.length,
    rooms.reduce((sum, r) => sum + (r.kinhDo || 0), 0) / rooms.length,
  ];

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden my-6 border border-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "480px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {rooms.map((room) => (
          <Marker key={room.id} position={[room.viDo, room.kinhDo]}>
            <Popup>
              <strong>{room.tenPhong}</strong>
              <br />
              {room.diaChi || ""}
              <br />
              <a
                href={`/room/${room.id}`}
                className="text-rose-500 underline block mt-2"
              >
                Xem chi tiết
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

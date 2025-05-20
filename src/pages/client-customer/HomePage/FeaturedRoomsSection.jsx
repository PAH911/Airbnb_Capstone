import React, { useEffect, useState } from "react";
import { Card, Typography, Skeleton } from "antd";
import { motion } from "framer-motion";
import * as roomService from "../../../services/roomService";

const { Title, Text } = Typography;

export default function FeaturedRoomsSection() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        const res = await roomService.getRooms();
        setRooms(res.data.content || []);
      } catch (err) {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <Text className="uppercase text-rose-500 font-bold tracking-widest block text-center mb-2">
          Phòng nổi bật
        </Text>
        <Title className="text-center !mb-12 !text-4xl !font-bold text-gray-900 dark:text-white">
          Khám phá những phòng tuyệt vời nhất
        </Title>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} active avatar paragraph={{ rows: 4 }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 6).map((room, i) => (
              <motion.div
                key={room.id}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card
                  hoverable
                  className="rounded-2xl overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800"
                  cover={
                    <img
                      src={room.hinhAnh}
                      alt={room.tenPhong}
                      className="h-56 w-full object-cover"
                    />
                  }
                >
                  <Title
                    level={4}
                    className="!mb-1 text-gray-900 dark:text-white"
                  >
                    {room.tenPhong}
                  </Title>
                  <div className="flex items-center justify-between mt-2">
                    <Text className="text-rose-500 font-bold text-lg">
                      {room.giaTien?.toLocaleString()} VND
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-300">
                      {room.khach} khách
                    </Text>
                  </div>
                  <Text className="block mt-2 text-gray-500 dark:text-gray-300">
                    {room.moTa}
                  </Text>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

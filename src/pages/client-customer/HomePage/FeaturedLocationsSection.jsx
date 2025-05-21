import React, { useEffect, useState } from "react";
import { Card, Typography, Skeleton } from "antd";
import { motion } from "framer-motion";
import * as locationService from "../../../services/locationService";

const { Title, Text } = Typography;

export default function FeaturedLocationsSection() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      try {
        const res = await locationService.getLocations();
        setLocations(res.data.content || []);
      } catch (err) {
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <Text className="uppercase text-rose-500 font-bold tracking-widest block text-center mb-2">
          Địa điểm nổi bật
        </Text>
        <Title className="text-center !mb-12 !text-4xl !font-bold !text-gray-900 dark:!text-white">
          Điểm đến hấp dẫn trên TripNest
        </Title>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} active avatar paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.slice(0, 8).map((loc, i) => (
              <motion.div
                key={loc.id}
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
                      src={loc.hinhAnh}
                      alt={loc.tenViTri}
                      className="h-40 w-full object-cover"
                    />
                  }
                >
                  <Title
                    level={5}
                    className="!mb-1 !text-gray-900 dark:!text-white"
                  >
                    {loc.tenViTri}
                  </Title>
                  <Text className="text-gray-500 dark:text-gray-300">
                    {loc.tinhThanh}, {loc.quocGia}
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

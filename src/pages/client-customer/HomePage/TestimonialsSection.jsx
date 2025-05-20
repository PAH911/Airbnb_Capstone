import React from "react";
import { motion } from "framer-motion";
import { Avatar, Typography } from "antd";

const { Title, Text } = Typography;

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Doanh nhân",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      '"Dịch vụ tuyệt vời, trải nghiệm đặt phòng nhanh chóng và tiện lợi. Tôi sẽ quay lại!"',
  },
  {
    name: "Trần Thị B",
    role: "Nhà thiết kế",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      '"Trang web rất dễ sử dụng, nhiều lựa chọn phòng và điểm đến hấp dẫn."',
  },
  {
    name: "Lê Quốc C",
    role: "Phượt thủ",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    content:
      '"Tôi đã có những chuyến đi tuyệt vời cùng TripNest. Sẽ giới thiệu cho bạn bè!"',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <Text className="uppercase text-rose-500 font-bold tracking-widest block text-center mb-2">
          Đánh giá
        </Text>
        <Title className="text-center !mb-12 !text-4xl !font-bold text-gray-900 dark:text-white">
          Khách hàng nói gì về TripNest
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col gap-4 hover:shadow-2xl transition-all border border-rose-100 dark:border-gray-700"
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <Avatar src={t.avatar} size={56} />
                <div>
                  <Title
                    level={5}
                    className="!mb-0 text-gray-900 dark:text-white"
                  >
                    {t.name}
                  </Title>
                  <Text className="text-gray-500 dark:text-gray-300 text-sm">
                    {t.role}
                  </Text>
                </div>
              </div>
              <Text className="italic text-lg text-gray-700 dark:text-gray-200">
                {t.content}
              </Text>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

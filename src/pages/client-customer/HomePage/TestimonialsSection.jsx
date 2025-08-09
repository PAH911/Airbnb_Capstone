import React from "react";
import { motion } from "framer-motion";
import { Avatar, Typography } from "antd";

const { Title, Text } = Typography;

const testimonials = [
  {
    name: "Nguyễn Minh Anh",
    role: "Du lịch gia đình",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    content:
      '"Phòng rất sạch sẽ, đầy đủ tiện nghi. Chủ nhà thân thiện, hỗ trợt nhiệt tình. Gia đình tôi có kỳ nghỉ tuyệt vời!"',
  },
  {
    name: "Trần Quốc Bảo",
    role: "Chuyến công tác",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    content:
      '"Vị trí thuận tiện, gần trung tâm thành phố. Đặt phòng dễ dàng, check-in nhanh chóng. Rất hài lòng với dịch vụ!"',
  },
  {
    name: "Lê Thị Hương",
    role: "Chuyến du lịch cặp đôi",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    content:
      '"Phòng đẹp như hình, view tuyệt vời. Giá cả hợp lý, dịch vụ chuyên nghiệp. Chắc chắn sẽ quay lại TripNest!"',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <Text className="uppercase text-rose-500 font-bold tracking-widest block text-center mb-2">
          Phản hồi khách hàng
        </Text>
        <Title className="text-center !mb-12 !text-4xl !font-bold !text-gray-900 dark:!text-white">
          Khách hàng nói gì về trải nghiệm tại TripNest
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
                    className="!mb-0 !text-gray-900 dark:!text-white"
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

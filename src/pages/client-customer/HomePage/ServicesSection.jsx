import React from "react";
import { motion } from "framer-motion";
import { Typography } from "antd";
import {
  CloudOutlined,
  RocketOutlined,
  CalendarOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const services = [
  {
    icon: <CloudOutlined className="text-3xl text-rose-500" />,
    title: "Dự báo thời tiết",
    desc: "Cập nhật thời tiết chính xác cho chuyến đi của bạn.",
  },
  {
    icon: <RocketOutlined className="text-3xl text-rose-500" />,
    title: "Chuyến bay tốt nhất",
    desc: "Tìm kiếm và đặt vé máy bay giá tốt nhất.",
  },
  {
    icon: <CalendarOutlined className="text-3xl text-rose-500" />,
    title: "Sự kiện địa phương",
    desc: "Khám phá các sự kiện nổi bật tại điểm đến.",
  },
  {
    icon: <SettingOutlined className="text-3xl text-rose-500" />,
    title: "Tùy chỉnh",
    desc: "Dịch vụ cá nhân hóa cho từng khách hàng.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <Text className="uppercase text-rose-500 font-bold tracking-widest block text-center mb-2">
          Danh mục
        </Text>
        <Title className="text-center !mb-12 !text-4xl !font-bold text-gray-900 dark:text-white">
          Chúng tôi cung cấp dịch vụ tốt nhất
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {s.icon}
              <Title
                level={4}
                className="!mt-4 !mb-2 text-gray-900 dark:text-white"
              >
                {s.title}
              </Title>
              <Text className="text-gray-500 dark:text-gray-300 text-base">
                {s.desc}
              </Text>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

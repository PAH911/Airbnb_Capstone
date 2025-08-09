import React from "react";
import { motion } from "framer-motion";
import { Typography } from "antd";
import {
  HomeOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const services = [
  {
    icon: <HomeOutlined className="text-3xl text-rose-500" />,
    title: "Phòng chất lượng cao",
    desc: "Tất cả phòng đều được kiểm duyệt và đảm bảo tiêu chuẩn chất lượng.",
  },
  {
    icon: <SafetyOutlined className="text-3xl text-rose-500" />,
    title: "Đặt phòng an toàn",
    desc: "Thanh toán bảo mật và chính sách hoàn tiền linh hoạt.",
  },
  {
    icon: <CustomerServiceOutlined className="text-3xl text-rose-500" />,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn.",
  },
  {
    icon: <StarOutlined className="text-3xl text-rose-500" />,
    title: "Trải nghiệm tuyệt vời",
    desc: "Hàng nghìn đánh giá 5 sao từ khách hàng hài lòng.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <Text className="uppercase text-rose-500 font-bold tracking-widest block text-center mb-2">
          Tại sao chọn chúng tôi
        </Text>
        <Title className="text-center !mb-12 !text-4xl !font-bold !text-gray-900 dark:!text-white">
          Dịch vụ cho thuê phòng hàng đầu
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
                className="!mt-4 !mb-2 !text-gray-900 dark:!text-white"
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

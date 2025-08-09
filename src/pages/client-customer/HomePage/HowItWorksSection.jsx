import React from "react";
import { motion } from "framer-motion";
import { Typography } from "antd";
import {
  SearchOutlined,
  CreditCardOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const steps = [
  {
    icon: <SearchOutlined className="text-2xl text-rose-500" />,
    title: "Tìm kiếm phòng",
    desc: "Tìm kiếm phòng phù hợp với nhu cầu và ngân sách của bạn.",
  },
  {
    icon: <CreditCardOutlined className="text-2xl text-rose-500" />,
    title: "Đặt phòng & thanh toán",
    desc: "Đặt phòng và thanh toán an toàn qua nhiều phương thức.",
  },
  {
    icon: <HomeOutlined className="text-2xl text-rose-500" />,
    title: "Nhận phòng & tận hưởng",
    desc: "Check-in dễ dàng và tận hưởng kỳ nghỉ tuyệt vời.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <Text className="uppercase text-rose-500 font-bold tracking-widest block mb-2">
            Quy trình đặt phòng
          </Text>
          <Title className="!mb-8 !text-4xl !font-bold !text-gray-900 dark:!text-white">
            Đặt phòng chỉ với 3 bước đơn giản
          </Title>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="bg-rose-100 dark:bg-gray-700 rounded-full p-3">
                  {s.icon}
                </div>
                <div>
                  <Title
                    level={5}
                    className="!mb-1 !text-gray-900 dark:!text-white"
                  >
                    {s.title}
                  </Title>
                  <Text className="text-gray-500 dark:text-gray-300">
                    {s.desc}
                  </Text>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="rounded-2xl shadow-xl border-0 w-full max-w-sm bg-white dark:bg-gray-800 p-6 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80"
              alt="Beautiful Room"
              className="h-56 w-full object-cover rounded-xl mb-4"
            />
            <Title level={5} className="!mb-1 !text-gray-900 dark:!text-white">
              Căn hộ sang trọng
            </Title>
            <Text className="block mb-2 text-gray-500 dark:text-gray-300">
              2 phòng ngủ | 4 khách | Trung tâm TP
            </Text>
            <div className="flex items-center gap-2 mb-2">
              <Text className="text-rose-500 font-semibold">⭐ 4.9</Text>
              <Text className="text-gray-500 dark:text-gray-300">
                (127 đánh giá)
              </Text>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-rose-500 h-2 rounded-full"
                style={{ width: "95%" }}
              />
            </div>
            <Text className="text-gray-500 dark:text-gray-300">
              Đã được đặt 95% trong tháng
            </Text>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

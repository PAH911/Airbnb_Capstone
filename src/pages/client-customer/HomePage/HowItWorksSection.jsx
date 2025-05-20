import React from "react";
import { motion } from "framer-motion";
import { Typography } from "antd";
import {
  EnvironmentOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const steps = [
  {
    icon: <EnvironmentOutlined className="text-2xl text-rose-500" />,
    title: "Chọn điểm đến",
    desc: "Lựa chọn địa điểm bạn muốn khám phá.",
  },
  {
    icon: <MailOutlined className="text-2xl text-rose-500" />,
    title: "Thanh toán",
    desc: "Thanh toán nhanh chóng, an toàn.",
  },
  {
    icon: <UserOutlined className="text-2xl text-rose-500" />,
    title: "Đến sân bay",
    desc: "Chuẩn bị hành lý và tận hưởng chuyến đi.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <Text className="uppercase text-rose-500 font-bold tracking-widest block mb-2">
            Nhanh chóng & dễ dàng
          </Text>
          <Title className="!mb-8 !text-4xl !font-bold text-gray-900 dark:text-white">
            Đặt chuyến đi của bạn chỉ với 3 bước
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
                    className="!mb-1 text-gray-900 dark:text-white"
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
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="Trip to Greece"
              className="h-56 w-full object-cover rounded-xl mb-4"
            />
            <Title level={5} className="!mb-1 text-gray-900 dark:text-white">
              Trip To Greece
            </Title>
            <Text className="block mb-2 text-gray-500 dark:text-gray-300">
              14-29 June | by Robbin k
            </Text>
            <div className="flex items-center gap-2 mb-2">
              <Text className="text-rose-500 font-semibold">Ongoing</Text>
              <Text className="text-gray-500 dark:text-gray-300">
                Trip to Rome
              </Text>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-rose-500 h-2 rounded-full"
                style={{ width: "47%" }}
              />
            </div>
            <Text className="text-gray-500 dark:text-gray-300">
              24 người tham gia
            </Text>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

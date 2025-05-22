import React from "react";
import { motion } from "framer-motion";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useTheme } from "../../../contexts/ThemeContext";
import { Player } from "@lordicon/react";

import supportIcon from "../../../assets/lordicon/support.json";
import faqIcon from "../../../assets/lordicon/faq.json";
import privacyIcon from "../../../assets/lordicon/privacy.json";
import callIcon from "../../../assets/lordicon/call.json";

const supportTopics = [
  {
    icon: supportIcon,
    title: "Hỗ trợ khách hàng",
    desc: "Liên hệ với đội ngũ hỗ trợ 24/7 của chúng tôi để được giải đáp mọi thắc mắc về đặt phòng, thanh toán, hoặc các vấn đề khác.",
    contact: "support@tripnest.vn",
  },
  {
    icon: faqIcon,
    title: "Câu hỏi thường gặp",
    desc: "Xem các câu hỏi thường gặp về dịch vụ, chính sách hoàn tiền, và hướng dẫn sử dụng nền tảng TripNest.",
    contact: "FAQ & Hướng dẫn",
  },
  {
    icon: privacyIcon,
    title: "Bảo mật & Quyền riêng tư",
    desc: "Tìm hiểu về cách chúng tôi bảo vệ thông tin cá nhân và quyền riêng tư của bạn khi sử dụng TripNest.",
    contact: "privacy@tripnest.vn",
  },
  {
    icon: callIcon,
    title: "Liên hệ khẩn cấp",
    desc: "Nếu bạn gặp sự cố khẩn cấp trong quá trình lưu trú, hãy gọi ngay số hotline của chúng tôi để được hỗ trợ kịp thời.",
    contact: "1900 1234",
  },
];

export default function SupportPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center w-full dark:bg-[#101624]">
        <motion.div
          className="w-full max-w-5xl mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-center mb-6 dark:text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Trung tâm hỗ trợ TripNest
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-center mb-12 max-w-2xl mx-auto text-gray-500 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi. Hãy chọn chủ đề
            bạn quan tâm hoặc liên hệ trực tiếp với chúng tôi!
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportTopics.map((topic, idx) => (
              <motion.div
                key={topic.title}
                className={`rounded-3xl shadow-xl p-8 flex flex-col items-center border transition-transform hover:scale-[1.03] ${
                  theme === "dark"
                    ? "bg-[#23232b] border-gray-700"
                    : "bg-white/90 border-gray-200"
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Player
                  icon={topic.icon}
                  size={60}
                  autoplay
                  loop
                  style={{ marginBottom: "16px" }}
                />
                <div className="text-2xl font-bold mb-2 text-rose-500 dark:text-rose-300 text-center">
                  {topic.title}
                </div>
                <div className="text-base text-center mb-4 text-gray-500 dark:text-gray-300">
                  {topic.desc}
                </div>
                <div className="mt-auto text-sm font-semibold text-rose-600 dark:text-rose-300">
                  {topic.contact}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

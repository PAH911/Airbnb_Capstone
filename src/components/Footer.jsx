import React from "react";
import { motion } from "framer-motion";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Typography, Space, Divider, Row, Col, Button } from "antd";

const { Title, Text, Link } = Typography;

export default function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 dark:from-gray-900 dark:via-gray-800 dark:to-black pt-16 pb-8 px-4 border-t border-rose-100 dark:border-gray-800 font-sans shadow-inner"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <Row gutter={[32, 32]}>
          {/* Logo & About */}
          <Col xs={24} sm={12} md={6} className="mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-rose-500 drop-shadow-lg"
              >
                <circle cx="16" cy="16" r="16" fill="currentColor" />
                <path d="M16 8L20 24L16 20L12 24L16 8Z" fill="#fff" />
              </svg>
              <span className="font-extrabold text-3xl text-rose-600 dark:text-white tracking-tight">
                Trip
                <span className="text-rose-500">Nest</span>
              </span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed">
              Đặt phòng nhanh, giá tốt. Trải nghiệm kỳ nghỉ mơ ước cùng{" "}
              <span className="font-semibold text-rose-500">TripNest</span>.
            </div>
            <Space size="middle">
              <Button
                shape="circle"
                icon={<FacebookOutlined />}
                className="bg-white dark:bg-gray-800 text-rose-500 hover:text-pink-500 shadow border-none transition-all duration-200 hover:scale-110"
                href="#"
                aria-label="Facebook"
              />
              <Button
                shape="circle"
                icon={<InstagramOutlined />}
                className="bg-white dark:bg-gray-800 text-rose-500 hover:text-pink-500 shadow border-none transition-all duration-200 hover:scale-110"
                href="#"
                aria-label="Instagram"
              />
              <Button
                shape="circle"
                icon={<TwitterOutlined />}
                className="bg-white dark:bg-gray-800 text-rose-500 hover:text-pink-500 shadow border-none transition-all duration-200 hover:scale-110"
                href="#"
                aria-label="Twitter"
              />
            </Space>
          </Col>
          {/* Company */}
          <Col xs={24} sm={12} md={5} className="mt-3">
            <Title
              level={5}
              className="mb-3 !text-gray-900 dark:!text-white tracking-wide uppercase"
            >
              Công ty
            </Title>
            <Space direction="vertical" size={2} className="w-full">
              <Link
                href="#"
                className="!text-gray-400 dark:!text-gray-300 hover:!text-rose-500 transition-colors"
              >
                Về chúng tôi
              </Link>
              <Link
                href="#"
                className="!text-gray-400 dark:!text-gray-300 hover:!text-rose-500 transition-colors"
              >
                Tuyển dụng
              </Link>
              <Link
                href="#"
                className="!text-gray-400 dark:!text-gray-300 hover:!text-rose-500 transition-colors"
              >
                Mobile
              </Link>
            </Space>
          </Col>
          {/* Contact */}
          <Col xs={24} sm={12} md={9} className="mt-3">
            <Title
              level={5}
              className="mb-3 !text-gray-900 dark:!text-white tracking-wide uppercase"
            >
              Liên hệ
            </Title>
            <Space direction="vertical" size={2} className="w-full">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-base">
                <PhoneOutlined className="text-rose-400" /> +84 123 456 789
              </span>
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-base">
                <MailOutlined className="text-rose-400" /> support@tripnest.com
              </span>
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-base">
                <EnvironmentOutlined className="text-rose-400" /> 123 Đường ABC,
                Quận XYZ, TP. Hồ Chí Minh
              </span>
            </Space>
          </Col>
          {/* More */}
          <Col xs={24} sm={12} md={4} className="mt-3">
            <Title
              level={5}
              className="mb-3 !text-gray-900 dark:!text-white tracking-wide uppercase"
            >
              Khác
            </Title>
            <Space direction="vertical" size={2} className="w-full">
              <Link
                href="#"
                className="!text-gray-400 dark:!text-gray-300 hover:!text-rose-500 transition-colors"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="#"
                className="!text-gray-400 dark:!text-gray-300 hover:!text-rose-500 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="#"
                className="!text-gray-400 dark:!text-gray-300 hover:!text-rose-500 transition-colors"
              >
                FAQ
              </Link>
            </Space>
          </Col>
        </Row>
        <Divider className="border-gray-200 dark:border-gray-700 my-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-400 text-sm px-2">
          <div>
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-rose-500">TripNest</span>. All
            rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-rose-500 inline-block mx-1"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
            </svg>
            <span>by PAH113</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

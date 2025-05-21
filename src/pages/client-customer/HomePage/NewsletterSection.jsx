import React from "react";
import { Typography, Input, Button } from "antd";

const { Title, Text } = Typography;

export default function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Title className="!mb-4 !text-3xl !font-bold !text-gray-900 dark:!text-white">
          Đăng ký nhận thông tin mới nhất về TripNest
        </Title>
        <Text className="text-gray-600 dark:text-gray-300 text-lg mb-8 block">
          Nhận ưu đãi, tin tức và các chương trình hấp dẫn từ chúng tôi.
        </Text>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-6">
          <Input
            size="large"
            placeholder="Nhập email của bạn"
            className="rounded-full max-w-xs placeholder:text-black bg-white hover:bg-white hover:border-rose-500 focus:bg-white focus:!border-rose-500 border-2"
          />
          <Button
            type="primary"
            size="large"
            className="bg-rose-500 hover:!bg-rose-600 border-none rounded-full px-8 text-lg font-semibold shadow-lg"
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </section>
  );
}

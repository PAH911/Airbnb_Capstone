import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { UserOutlined, BookOutlined, CommentOutlined } from "@ant-design/icons";

export default function Dashboard() {
  // Dữ liệu mock - bạn thay API call hoặc Redux ở đây
  const stats = [
    {
      title: "Tổng người dùng",
      value: 1234,
      icon: <UserOutlined />,
    },
    {
      title: "Tổng đặt phòng",
      value: 567,
      icon: <BookOutlined />,
    },
    {
      title: "Tổng bình luận",
      value: 89,
      icon: <CommentOutlined />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: "#F4F6F8" }}>
        Dashboard quản trị
      </h1>
      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} md={8} key={stat.title}>
            <Card
              className="shadow rounded-lg"
              style={{
                background: "#292F3B",
                color: "#F4F6F8",
                border: "1px solid #2d3441",
                borderRadius: 8,
              }}
            >
              <Statistic
                title={<span style={{ color: "#A6B2C7" }}>{stat.title}</span>}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: "#F4F6F8" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

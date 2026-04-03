import { Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

const WelcomePage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
          minWidth: 400,
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ color: "#1677ff" }}>
          Chào mừng {user.name || user.username || "bạn"}!
        </Title>
        <Paragraph>
          Chúc bạn một ngày làm việc hiệu quả cùng hệ thống quản lý CafeSync ☕️
        </Paragraph>
      </Card>
    </div>
  );
};

export default WelcomePage;
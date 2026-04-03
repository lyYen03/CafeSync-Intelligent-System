import { Layout, Avatar, Dropdown, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const navigate = useNavigate();

  // 👉 Lấy tên admin từ localStorage (nếu có)
  const adminName = localStorage.getItem("adminName") || "Admin";

  // 👉 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate("/login");
  };

  // 👉 Dropdown menu (AntD v5)
  const items = [
    
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: "#ffffff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        position: "fixed",
        top: 0,
        right: 0,
        height: 64,
        zIndex: 1000,

        // 👉 Tự co giãn theo sidebar
        marginLeft: 220,
        width: "calc(100% - 220px)",
      }}
    >
      {/* 🔥 Logo / Title */}
      <Text strong style={{ fontSize: 20 }}>
        ☕ CafeSync
      </Text>

      {/* 🔥 User dropdown */}
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Space
          style={{
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: 8,
            transition: "all 0.2s",
          }}
        >
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1677ff" }}
          />
          <Text>{adminName}</Text>
        </Space>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
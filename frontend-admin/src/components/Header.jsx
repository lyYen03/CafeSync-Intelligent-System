import { useState } from "react";
import { Layout, Avatar, Dropdown, Space, Typography, Modal, Button, Descriptions } from "antd";
import { UserOutlined, LogoutOutlined, IdcardOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const navigate = useNavigate();

  // 👉 Lấy thông tin user từ localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || user?.username || "Admin";

  // 👉 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  // 👉 Dropdown menu (AntD v5)
  const items = [
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => setIsProfileModalVisible(true),
    },
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
          <Text>{userName}</Text>
        </Space>
      </Dropdown>

      {/* 🔥 Modal Thông tin cá nhân */}
      <Modal
        title="Thông tin cá nhân"
        open={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsProfileModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => {
              setIsProfileModalVisible(false);
              navigate("/profile");
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
      >
        {user ? (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Họ và tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Tên đăng nhập">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Typography.Text type="secondary">
                {user.role === "admin" ? "Admin" : user.role === "nhanvien" ? "Nhân viên" : user.role}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Typography.Text>Không có thông tin</Typography.Text>
        )}
      </Modal>
    </AntHeader>
  );
};

export default Header;
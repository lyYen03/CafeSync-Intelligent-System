import { useState } from "react";
import { Layout, Avatar, Dropdown, Space, Typography, Modal, Button, Descriptions, Breadcrumb, Badge } from "antd";
import { 
  UserOutlined, 
  LogoutOutlined, 
  IdcardOutlined, 
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const items = [
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => setIsProfileModalVisible(true),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Breadcrumb mapping
  const breadcrumbNameMap = {
    "/": "Dashboard",
    "/orders": "Đơn hàng",
    "/pos": "Bán hàng",
    "/CategoryPage": "Danh mục",
    "/products": "Sản phẩm",
    "/ingredients": "Kho hàng",
    "/users": "Nhân sự",
    "/reports": "Báo cáo",
    "/profile": "Hồ sơ",
  };

  const pathContent = breadcrumbNameMap[location.pathname] || "Trang chủ";

  return (
    <AntHeader
      style={{
        background: "#ffffff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
        position: "fixed",
        top: 0,
        right: 0,
        height: 64,
        zIndex: 1000,
        transition: "all 0.2s",
        marginLeft: collapsed ? 80 : 240,
        width: collapsed ? "calc(100% - 80px)" : "calc(100% - 240px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "16px", width: 64, height: 64 }}
        />
        <Breadcrumb style={{ marginLeft: 16 }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>{pathContent}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Space style={{ cursor: "pointer", padding: "4px 8px", borderRadius: 4, transition: "all 0.3s" }} className="header-user-dropdown">
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1677ff" }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
              <Text strong style={{ fontSize: 13 }}>{userName}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{user?.role?.toUpperCase()}</Text>
            </div>
          </Space>
        </Dropdown>
      </div>

      <Modal
        title="Thông tin cá nhân"
        open={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsProfileModalVisible(false)}>Đóng</Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => {
              setIsProfileModalVisible(false);
              navigate("/profile");
            }}
          >Chỉnh sửa</Button>,
        ]}
      >
        {user ? (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Họ và tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Text type="secondary">
                {user.role === "admin" ? "Quản trị viên" : "Nhân viên"}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Text>Không có thông tin</Text>
        )}
      </Modal>
    </AntHeader>
  );
};

export default Header;
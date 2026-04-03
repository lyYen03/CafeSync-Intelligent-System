import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  CoffeeOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider
      width={220}
      style={{
        minHeight: "100vh",
        background: "#151d2a",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          padding: 24,
          fontWeight: "bold",
          fontSize: 22,
          color: "#fff",
          textAlign: "center",
        }}
      >
        CafeSync
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={location.pathname === "/" ? [] : [location.pathname]}
        style={{ background: "#151d2a", borderRight: 0 }}
        items={[
          {
            key: "/",
            icon: <AppstoreOutlined />,
            label: "Quản lý danh mục",
            onClick: () => navigate("/CategoryPage"),
          },
          {
            key: "/users",
            icon: <UserOutlined />,
            label: "Quản lý Người dùng",
            onClick: () => navigate("/users"),
          },
          {
            key: "/products",
            icon: <CoffeeOutlined />,
            label: "Quản lý Sản phẩm",
            onClick: () => navigate("/products"),
          },
          {
            key: "/ingredients",
            icon: <DatabaseOutlined />,
            label: "Quản lý Nguyên liệu",
            onClick: () => navigate("/ingredients"),
          },
          {
            key: "/orders",
            icon: <FileTextOutlined />,
            label: "Quản lý Đơn hàng",
            onClick: () => navigate("/orders"),
          },
          {
            key: "/reports",
            icon: <LineChartOutlined />,
            label: "Báo cáo doanh thu",
            onClick: () => navigate("/reports"),
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
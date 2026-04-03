import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  CoffeeOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. LẤY THÔNG TIN USER VÀ CHUYỂN ROLE VỀ VIẾT THƯỜNG
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role ? user.role.toLowerCase() : "";

  // 2. KHỞI TẠO MENU VỚI CÁC MỤC DÙNG CHUNG
  const items = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      onClick: () => navigate("/"),
    },
    {
      key: "/orders",
      icon: <FileTextOutlined />,
      label: "Quản lý Đơn hàng",
      onClick: () => navigate("/orders"),
    },
  ];

  // 3. PHÂN CHIA QUYỀN HẠN RẠCH RÒI
  if (role === "admin") {
    // Admin: Quản trị hệ thống, KHÔNG bán hàng
    items.push(
      { key: "/CategoryPage", icon: <AppstoreOutlined />, label: "Quản lý Danh mục", onClick: () => navigate("/CategoryPage") },
      { key: "/products", icon: <CoffeeOutlined />, label: "Quản lý Sản phẩm", onClick: () => navigate("/products") },
      { key: "/ingredients", icon: <DatabaseOutlined />, label: "Quản lý Nguyên liệu", onClick: () => navigate("/ingredients") },
      { key: "/reports", icon: <LineChartOutlined />, label: "Báo cáo doanh thu", onClick: () => navigate("/reports") },
      { key: "/users", icon: <UserOutlined />, label: "Quản lý Người dùng", onClick: () => navigate("/users") }
    );
  } else if (role === "nhanvien") {
    // Nhân viên: Chuyên trách bán hàng tại quầy (POS)
    items.push({
      key: "/pos",
      icon: <ShoppingCartOutlined />,
      label: "Bán tại quầy (POS)",
      onClick: () => navigate("/pos"),
    });
  }

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
      <div style={{ padding: 24, fontWeight: "bold", fontSize: 22, color: "#fff", textAlign: "center", letterSpacing: "1px" }}>
        CafeSync
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ background: "#151d2a", borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
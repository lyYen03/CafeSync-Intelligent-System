import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const userStr = localStorage.getItem("user");
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  
  // Nếu là nhân viên, không cho phép truy cập các trang quản trị (đá về trang chủ)
  if (user.role === "nhanvien" || user.role === "staff") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;

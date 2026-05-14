import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  
  // NẾU ĐÃ LỠ ĐĂNG NHẬP VỚI ROLE CUSTOMER -> XÓA TOKEN VÀ ĐÁ SANG PORT 3001 LUN
  if (user.role === "customer") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:3001";
    return null;
  }

  return children;
};

export default RequireAuth;
import LoginPage from "./pages/LoginPage";
import RequireAuth from "./components/RequireAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AdminLayout from "./layouts/AdminLayout";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import UserManagementPage from "./pages/User";
import IngredientManagementPage from "./pages/IngredientManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import RevenueReportPage from "./pages/RevenueReportPage";
import POSPage from "./pages/POSPage"; // 👈 Import trang POS mới của Yến

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <RequireAuth>
              <AdminLayout>
                <Routes>
                  {/* --- CHỨC NĂNG DÙNG CHUNG --- */}
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/orders" element={<OrderManagementPage />} />
                  <Route path="/pos" element={<POSPage />} /> {/* 👈 Route cho Nhân viên/POS */}

                  {/* --- CHỨC NĂNG CHỈ ADMIN (Có thể bọc thêm logic nếu muốn) --- */}
                  <Route path="/CategoryPage" element={<CategoryPage />} />
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/ingredients" element={<IngredientManagementPage />} />
                  <Route path="/reports" element={<RevenueReportPage />} />
                </Routes>
              </AdminLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
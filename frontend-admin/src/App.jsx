import LoginPage from "./pages/LoginPage";
import RequireAuth from "./components/RequireAuth"; // tạo file này như trên

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AdminLayout from "./layouts/AdminLayout";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import UserManagementPage from "./pages/User";
import IngredientManagementPage from "./pages/IngredientManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import RevenueReportPage from "./pages/RevenueReportPage";

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
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/CategoryPage" element={<CategoryPage />} />
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/ingredients" element={<IngredientManagementPage />} />
                  <Route path="/orders" element={<OrderManagementPage />} />
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
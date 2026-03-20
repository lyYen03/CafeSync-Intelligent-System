# ☕ CaféSync - Intelligent System
Hệ thống đặt món thông minh và quản lý quán cà phê tích hợp Trợ lý ảo AI.

## 📖 Giới thiệu dự án
**CaféSync** là đồ án được phát triển với mục tiêu tối ưu hóa trải nghiệm gọi món của khách hàng thông qua giao diện Web App di động, đồng thời cung cấp hệ thống quản lý tập trung, hiện đại cho chủ quán. Điểm nhấn của hệ thống là việc tích hợp Trợ lý ảo AI giúp tư vấn đồ uống cá nhân hóa dựa trên tâm trạng và sở thích của khách hàng.

Giao diện được thiết kế theo phong cách Minimalism chuyên nghiệp, sử dụng tone màu Earth-toned (Raw Umber & Cosmic Latte) mang lại cảm giác sang trọng và tập trung vào trải nghiệm người dùng (UX/UI).

## 🚀 Công nghệ sử dụng
* **Kiến trúc hệ thống:** Mô hình MVC (Model - View - Controller), phân tách rõ ràng Client - Server.
* **Frontend (Khách hàng & Admin):** HTML5, CSS3, JavaScript, Bootstrap 5 (Mobile-first design).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB.
* **Trí tuệ nhân tạo (AI):** Tích hợp Chatbot AI tư vấn.

## 📂 Cấu trúc thư mục chuẩn
Dự án được quy hoạch thành 3 phân hệ độc lập để tối ưu hóa quá trình làm việc nhóm:
* `📁 App_KhachHang/`: Chứa mã nguồn giao diện Web App cho khách hàng (Quét QR, xem Menu, Đặt món, Chat AI).
* `📁 Web_Admin/`: Chứa mã nguồn giao diện Dashboard quản lý cho nhân viên và chủ quán.
* `📁 Backend_API/`: Khối máy chủ xử lý logic nghiệp vụ và tương tác với Cơ sở dữ liệu.

## 👥 Đội ngũ phát triển
Dự án được thực hiện bởi nhóm sinh viên chuyên ngành **Hệ thống Thông tin - Đại học Công nghiệp TP.HCM (IUH)**:

1. **Lý Thị Yến** (MSSV: 22665891)
   * *Vai trò:* Frontend Developer & UI/UX Designer.
   * *Phụ trách:* Phát triển trải nghiệm người dùng trên phân hệ `App_KhachHang`.
2. **Tài** (MSSV: Đang cập nhật...)
   * *Vai trò:* Backend Developer & Admin Frontend.
   * *Phụ trách:* Xây dựng API, quản trị CSDL và phát triển phân hệ `Web_Admin`.

---
*Dự án đang trong quá trình phát triển (Work In Progress).*
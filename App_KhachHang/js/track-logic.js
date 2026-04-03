/**
 * js/track-logic.js
 * Bản dứt điểm lỗi xoay vòng - Tối ưu hóa đường dẫn API
 */
async function fetchOrderStatus() {
    const orderDBId = localStorage.getItem('lastOrderDBId');
    const detailsContainer = document.getElementById('order-details-list');

    // Nếu không tìm thấy vùng hiển thị món thì thoát để tránh lỗi Console
    if (!detailsContainer) return;

    // QUAN TRỌNG: Dùng đường dẫn tuyệt đối đến cổng 5000 của Tài
    const baseUrl = 'http://localhost:5000/api/orders';
    const url = (orderDBId && orderDBId !== "null" && orderDBId !== "undefined")
        ? `${baseUrl}/${orderDBId}`
        : `${baseUrl}/latest`;

    try {
        console.log("📡 Đang kết nối API tại:", url);
        const res = await fetch(url);

        if (!res.ok) {
            // PHÁ BĂNG: Xóa vòng xoay ngay lập tức nếu Server báo lỗi
            detailsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-exclamation-triangle text-warning fs-2"></i>
                    <p class="mt-2 text-muted small">Server báo lỗi ${res.status}.<br>Yến bảo Tài kiểm tra lại API nhé!</p>
                </div>`;
            return;
        }

        const responseData = await res.json();
        console.log("📦 Dữ liệu đơn hàng nhận về:", responseData);

        // PHÁ BĂNG: Tự động bóc tách dữ liệu nếu Tài bọc trong field .order hoặc .data
        const order = responseData.order || responseData.data || responseData;

        // --- RENDER DỮ LIỆU & XÓA VÒNG XOAY ---
        if (!order || !order.items || order.items.length === 0) {
            detailsContainer.innerHTML = '<p class="text-center text-muted py-5">Đơn hàng hiện không có món nào.</p>';
        } else {
            // Lệnh này ghi đè hoàn toàn nội dung để mất Spinner
            detailsContainer.innerHTML = order.items.map(item => `
                <div class="d-flex justify-content-between mb-2 border-bottom border-light pb-2 animate__animated animate__fadeIn">
                    <div>
                        <span class="fw-bold text-dark" style="font-size: 0.9rem;">${item.name || 'Món ẩn danh'}</span>
                        <small class="text-muted d-block" style="font-size: 0.75rem;">Số lượng: ${item.quantity || 0}</small>
                    </div>
                    <span class="fw-bold text-dark" style="font-size: 0.9rem;">${((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}đ</span>
                </div>
            `).join('');
        }

        // Cập nhật các thông số hiển thị khác
        const totalDisplay = document.getElementById('total-price-display');
        const idDisplay = document.getElementById('order-id-display');
        const statusText = document.getElementById('status-text');

        if (totalDisplay) totalDisplay.innerText = Number(order.totalPrice || 0).toLocaleString('vi-VN') + 'đ';
        if (idDisplay) idDisplay.innerText = `#${order.orderID || 'N/A'}`;

        if (statusText) {
            statusText.innerText = order.status || 'Chờ xác nhận';
            // Đổi màu trạng thái cho sinh động
            statusText.style.color = (order.status === 'Hoàn thành') ? '#198754' : '#826644';
        }

        // Cập nhật thanh tiến trình
        updateTimeline(order.status);

    } catch (err) {
        console.error("❌ Lỗi Fetch:", err);
        // PHÁ BĂNG: Xóa vòng xoay ngay lập tức khi lỗi kết nối mạng
        detailsContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-wifi-off text-danger fs-1"></i>
                <p class="mt-2 text-danger fw-bold">Lỗi kết nối máy chủ!</p>
                <small class="text-muted">Yến kiểm tra Terminal xem Backend đã chạy chưa nha.</small>
            </div>`;
    }
}

/**
 * 2. Cập nhật thanh tiến trình (Timeline)
 */
function updateTimeline(status) {
    const statusMap = {
        'Chờ xác nhận': 1,
        'Đã xác nhận': 1,
        'Đang pha chế': 2,
        'Pha chế': 2,
        'Hoàn thành': 3,
        'Đã xong': 3
    };

    const currentStep = statusMap[status] || 1;
    const widths = { 1: '0%', 2: '50%', 3: '100%' };

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = widths[currentStep];
        progressBar.style.transition = "width 1s ease-in-out";
    }

    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step) {
            (i <= currentStep) ? step.classList.add('active') : step.classList.remove('active');
        }
    }
}

// KHỞI CHẠY TỰ ĐỘNG
document.addEventListener('DOMContentLoaded', () => {
    fetchOrderStatus();
    // Tự động kiểm tra sau mỗi 10 giây để cập nhật trạng thái mới nhất
    const pollInterval = setInterval(fetchOrderStatus, 10000);

    // Xóa interval khi người dùng rời trang để tránh tốn tài nguyên máy Yến
    window.addEventListener('beforeunload', () => clearInterval(pollInterval));
});
/**
 * Lấy thông tin và cập nhật trạng thái đơn hàng
 */
async function fetchOrderStatus() {
    const orderDBId = localStorage.getItem('lastOrderDBId');

    // Sử dụng đường dẫn tương đối để tránh lỗi CORS khi chạy cùng cổng 5000
    const url = (orderDBId && orderDBId !== "null" && orderDBId !== "undefined")
        ? `/api/orders/${orderDBId}`
        : `/api/orders/latest`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kết nối server thất bại");

        const order = await res.json();
        if (!order) {
            const statusText = document.getElementById('status-text');
            if (statusText) statusText.innerText = "Chưa có dữ liệu đơn hàng";
            return;
        }

        // 1. HIỂN THỊ TỔNG TIỀN (Chuẩn định dạng VNĐ)
        const totalDisplay = document.getElementById('total-price-display');
        if (totalDisplay) {
            const finalPrice = Number(order.totalPrice) || 0;
            totalDisplay.innerText = finalPrice.toLocaleString('vi-VN') + 'đ';
        }

        // 2. HIỂN THỊ DANH SÁCH MÓN ĂN
        const detailsContainer = document.getElementById('order-details-list');
        if (detailsContainer && order.items) {
            detailsContainer.innerHTML = order.items.map(item => {
                // Đảm bảo lấy được giá trị số để tính toán
                const pricePerItem = typeof item.price === 'number'
                    ? item.price
                    : parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;

                return `
                <div class="d-flex justify-content-between mb-2 border-bottom border-light pb-2">
                    <div>
                        <span class="fw-bold text-dark">${item.name}</span>
                        <small class="text-muted d-block">Số lượng: ${item.quantity}</small>
                    </div>
                    <span class="fw-bold text-dark">${(pricePerItem * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>`;
            }).join('');
        }

        // 3. CẬP NHẬT MÃ ĐƠN VÀ TRẠNG THÁI CHỮ
        const idDisplay = document.getElementById('order-id-display');
        const statusText = document.getElementById('status-text');

        if (idDisplay) idDisplay.innerText = `#${order.orderID || 'N/A'}`;
        if (statusText) statusText.innerText = order.status || 'Đang xử lý';

        // 4. CẬP NHẬT THANH TIẾN TRÌNH (TIMELINE)
        updateTimeline(order.status);

    } catch (err) {
        console.error("❌ Lỗi cập nhật trạng thái đơn hàng:", err);
    }
}

/**
 * Cập nhật giao diện thanh tiến trình dựa trên trạng thái đơn hàng
 */
function updateTimeline(status) {
    // Bản đồ trạng thái tương ứng với các bước trên giao diện
    const statusMap = {
        'Chờ xác nhận': 1,
        'Đã xác nhận': 1,
        'Đang pha chế': 2,
        'Pha chế': 2,
        'Hoàn thành': 3,
        'Đã xong': 3,
        'Đang giao': 3 // Dự phòng cho tương lai
    };

    const currentStep = statusMap[status] || 1;
    const widths = { 1: '0%', 2: '45%', 3: '90%' };

    // Cập nhật độ dài thanh Progress
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = widths[currentStep];
        progressBar.style.transition = "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    // Cập nhật trạng thái các vòng tròn (step)
    for (let i = 1; i <= 3; i++) {
        const stepCircle = document.getElementById(`step-${i}`);
        if (stepCircle) {
            if (i <= currentStep) {
                stepCircle.classList.add('active');
            } else {
                stepCircle.classList.remove('active');
            }
        }
    }
}

// KHỞI CHẠY VÀ THIẾT LẬP LÀM MỚI TỰ ĐỘNG
document.addEventListener('DOMContentLoaded', () => {
    // Gọi lần đầu ngay khi trang load
    fetchOrderStatus();

    // Tự động kiểm tra trạng thái mới mỗi 10 giây
    const pollInterval = setInterval(fetchOrderStatus, 10000);

    // Dọn dẹp interval khi người dùng rời trang để tối ưu hiệu năng
    window.addEventListener('beforeunload', () => {
        clearInterval(pollInterval);
    });
});
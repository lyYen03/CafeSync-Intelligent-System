/**
 * 1. Vẽ tóm tắt đơn hàng (Items list & Total)
 */
function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('order-summary-list');
    const totalDisplay = document.getElementById('final-total');
    let totalMoney = 0;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-3">Giỏ hàng đang trống.</p>';
        if (totalDisplay) totalDisplay.innerText = '0đ';
        return;
    }

    container.innerHTML = cart.map(item => {
        // Chuẩn hóa giá tiền về kiểu số
        const price = typeof item.price === 'number'
            ? item.price
            : parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;

        const itemTotal = price * item.quantity;
        totalMoney += itemTotal;

        return `
            <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                <div style="flex: 1;">
                    <div class="fw-bold text-dark">${item.name} <span class="text-muted small">x${item.quantity}</span></div>
                    ${item.options ? `
                        <small class="text-muted d-block" style="font-size: 0.75rem; line-height: 1.2;">
                            Size: ${item.options.size} | ${item.options.sugar} Đường | ${item.options.ice} Đá
                        </small>
                    ` : ''}
                </div>
                <div class="fw-bold text-dark text-end" style="min-width: 100px;">
                    ${itemTotal.toLocaleString('vi-VN')}đ
                </div>
            </div>`;
    }).join('');

    if (totalDisplay) {
        totalDisplay.innerText = totalMoney.toLocaleString('vi-VN') + 'đ';
    }
}

/**
 * 2. Hàm xử lý đặt hàng chính
 */
async function placeOrder(e) {
    if (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    const btn = document.getElementById('btn-place-order');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Lấy thông tin bàn/hình thức nhận hàng từ giao diện
    const orderType = document.querySelector('select[name="order-type"]')?.value || "Tại bàn";
    const tableNo = document.querySelector('select[name="table-number"]')?.value || localStorage.getItem('selectedTable') || "Mang đi";

    if (cart.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Giỏ hàng trống', text: 'Vui lòng chọn món trước khi đặt hàng!' });
        return;
    }

    // Hiệu ứng vô hiệu hóa nút
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Đang gửi đơn...';

    // Tính tổng tiền cuối cùng
    const totalOrderMoney = cart.reduce((sum, item) => {
        const p = typeof item.price === 'number' ? item.price : parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;
        return sum + (p * item.quantity);
    }, 0);

    const orderData = {
        orderID: `CFS${Math.floor(Math.random() * 9000 + 1000)}`,
        items: cart,
        totalPrice: totalOrderMoney,
        location: orderType === "Mang đi" ? "Mang đi" : `Bàn ${tableNo}`,
        status: "Chờ xác nhận",
        createdAt: new Date()
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
                text: 'Đơn hàng của bạn đã được chuyển đến quầy pha chế.',
                confirmButtonColor: '#826644',
                confirmButtonText: 'Theo dõi đơn ngay',
                allowOutsideClick: false
            }).then((res) => {
                if (res.isConfirmed) {
                    localStorage.setItem('lastOrderDBId', result.order._id);
                    localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi đặt thành công
                    window.location.href = 'track-order.html';
                }
            });
        } else {
            throw new Error("Server trả về lỗi thành công giả");
        }

    } catch (error) {
        console.error("❌ Checkout Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi hệ thống',
            text: 'Không thể kết nối với máy chủ. Vui lòng thử lại!'
        });

        // Khôi phục trạng thái nút nếu lỗi
        btn.disabled = false;
        btn.innerText = "THANH TOÁN NGAY";
    }
}

/**
 * 3. Khởi chạy khi nạp trang
 */
document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();

    const btn = document.getElementById('btn-place-order');
    if (btn) {
        // Sử dụng onclick để đảm bảo chỉ có duy nhất 1 sự kiện đặt hàng được đăng ký
        btn.onclick = placeOrder;
    }
});
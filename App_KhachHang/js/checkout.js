/**
 * 1. Vẽ tóm tắt đơn hàng
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
        const price = typeof item.price === 'number' ? item.price : parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;
        const itemTotal = price * item.quantity;
        totalMoney += itemTotal;

        return `
            <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                <div style="flex: 1;">
                    <div class="fw-bold text-dark">${item.name} <span class="text-muted small">x${item.quantity}</span></div>
                    ${item.options ? `<small class="text-muted d-block" style="font-size: 0.75rem;">Size: ${item.options.size} | ${item.options.sugar} | ${item.options.ice}</small>` : ''}
                </div>
                <div class="fw-bold text-dark text-end">${itemTotal.toLocaleString('vi-VN')}đ</div>
            </div>`;
    }).join('');

    if (totalDisplay) totalDisplay.innerText = totalMoney.toLocaleString('vi-VN') + 'đ';
}

/**
 * 2. Hàm xử lý đặt hàng chính (Đã sửa lỗi treo nút)
 */
async function placeOrder(e) {
    if (e) e.preventDefault();

    const btn = document.getElementById('btn-place-order');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderType = document.querySelector('select[name="order-type"]')?.value || "Tại bàn";
    const tableNo = document.querySelector('select[name="table-number"]')?.value || localStorage.getItem('selectedTable') || "Mang đi";

    if (cart.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Giỏ hàng trống', text: 'Vui lòng chọn món trước!' });
        return;
    }

    // BẬT TRẠNG THÁI LOAD
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang gửi đơn...';

    const totalOrderMoney = cart.reduce((sum, item) => {
        const p = typeof item.price === 'number' ? item.price : parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;
        return sum + (p * item.quantity);
    }, 0);

    const orderData = {
        orderID: `CFS${Math.floor(Math.random() * 9000 + 1000)}`,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: typeof item.price === 'number' ? item.price : parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0,
            options: item.options || { size: 'M', sugar: '100%', ice: '100%' },
            note: item.note || ""
        })),
        totalPrice: totalOrderMoney,
        location: orderType === "Mang đi" ? "Mang đi" : `Bàn ${tableNo}`,
        status: "Chờ xác nhận"
    };

    try {
        // GỬI ĐẾN SERVER CỔNG 5000 CỦA TÀI
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        // TẮT LOAD NGAY KHI CÓ KẾT QUẢ (Dù thành công hay thất bại)
        if (response.ok || result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
                text: 'Đơn hàng đã được gửi tới quán.',
                confirmButtonColor: '#826644',
                confirmButtonText: 'Theo dõi đơn'
            }).then(() => {
                localStorage.setItem('lastOrderDBId', result.order?._id || result._id);
                localStorage.removeItem('cart');
                window.location.href = 'track-order.html';
            });
        } else {
            throw new Error(result.message || "Server từ chối đơn hàng");
        }

    } catch (error) {
        console.error("❌ Lỗi đặt hàng:", error);
        // TẮT LOAD VÀ HIỆN LỖI ĐỂ NÚT KHÔNG XOAY MÃI
        btn.disabled = false;
        btn.innerText = "THANH TOÁN NGAY";

        Swal.fire({
            icon: 'error',
            title: 'Lỗi hệ thống',
            text: 'Không kết nối được server. Yến kiểm tra xem Terminal đã chạy npm start chưa nhé!'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();
    const btn = document.getElementById('btn-place-order');
    if (btn) btn.onclick = placeOrder;
});
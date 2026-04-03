/**
 * 1. Hàm hiển thị danh sách giỏ hàng
 */
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-list');

    if (!container) return;

    // Trường hợp giỏ hàng trống
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center mt-5 py-5 animate__animated animate__fadeIn">
                <i class="bi bi-cart-x text-muted" style="font-size: 5rem; opacity: 0.3;"></i>
                <p class="mt-3 text-muted fw-medium">Giỏ hàng của bạn đang trống</p>
                <a href="index.html" class="btn btn-sm mt-2 px-4 rounded-pill shadow-sm" 
                   style="background-color: var(--raw-umber); color: white;">
                    Quay lại chọn món
                </a>
            </div>`;

        // Cập nhật thanh thanh toán về 0 và khóa nút
        updateCheckoutBar(0, 0, true);
        return;
    }

    // Vẽ danh sách các món ăn trong giỏ
    container.innerHTML = cart.map((item, index) => {
        let priceNum = typeof item.price === 'string'
            ? parseInt(item.price.replace(/[^0-9]/g, ''))
            : item.price;

        let displayPrice = (priceNum || 0).toLocaleString('vi-VN') + 'đ';

        const imagePath = (item.image && item.image.startsWith('http'))
            ? item.image
            : `/images/${item.image}`;

        let optionText = "";
        if (item.options) {
            const size = item.options.size;
            const sugar = item.options.sugar.toLowerCase().includes('đường') ? item.options.sugar : item.options.sugar + ' Đường';
            const ice = item.options.ice.toLowerCase().includes('đá') ? item.options.ice : item.options.ice + ' Đá';
            optionText = `${size} | ${sugar} | ${ice}`;
        }

        return `
        <div class="cart-item p-3 mb-3 shadow-sm border-0 rounded-4 bg-white animate__animated animate__fadeInUp">
            <div class="d-flex align-items-center">
                <img src="${imagePath}" class="cart-img me-3 rounded-3" 
                     style="width: 85px; height: 85px; object-fit: cover; border: 1px solid #f8f9fa;"
                     onerror="this.src='https://via.placeholder.com/150?text=CaféSync'">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="item-title mb-0 fw-bold text-dark" style="font-size: 0.95rem;">${item.name}</h6>
                            ${item.options ? `<small class="text-muted d-block mt-1" style="font-size: 0.7rem;">${optionText}</small>` : ''}
                        </div>
                        <i class="bi bi-x-circle-fill text-danger opacity-50" onclick="removeItem(${index})" style="cursor: pointer; font-size: 1.1rem;"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="item-price fw-bold" style="color: var(--raw-umber); font-size: 0.9rem;">${displayPrice}</span>
                        <div class="d-flex align-items-center bg-light rounded-pill px-1 border border-light-subtle">
                            <button class="btn btn-sm border-0 shadow-none px-2 py-1" onclick="changeQty(${index}, -1)"><i class="bi bi-dash-lg"></i></button>
                            <span class="mx-2 fw-bold text-dark">${item.quantity}</span>
                            <button class="btn btn-sm border-0 shadow-none px-2 py-1" onclick="changeQty(${index}, 1)"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    calculateTotal(cart);
}

/**
 * 2. Tính toán tổng tiền và cập nhật trạng thái nút
 */
function calculateTotal(cart) {
    let totalMoney = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const price = typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price;
        totalMoney += (item.quantity * (price || 0));
        totalItems += item.quantity;
    });

    // Nếu có món thì không khóa nút (isEmpty = false)
    updateCheckoutBar(totalMoney, totalItems, false);
}

/**
 * 3. Cập nhật thanh thanh toán và KHÓA NÚT nếu giỏ hàng trống
 */
function updateCheckoutBar(money, count, isEmpty) {
    const totalDisplay = document.getElementById('total-money-display');
    const countDisplay = document.getElementById('total-count-display');
    const checkoutBtn = document.querySelector('.btn-confirm-order') || document.querySelector('.btn-checkout');

    if (totalDisplay) totalDisplay.innerText = money.toLocaleString('vi-VN') + 'đ';
    if (countDisplay) countDisplay.innerText = `Tổng cộng (${count} món):`;

    if (checkoutBtn) {
        if (isEmpty) {
            // Khóa nút: làm mờ, chặn nhấn, đổi chữ
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = "0.5";
            checkoutBtn.style.cursor = "not-allowed";
            checkoutBtn.innerHTML = 'GIỎ HÀNG TRỐNG <i class="bi bi-cart-x ms-2"></i>';
        } else {
            // Mở nút: hiện rõ, cho phép nhấn, đổi lại chữ cũ
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = "1";
            checkoutBtn.style.cursor = "pointer";
            checkoutBtn.innerHTML = 'XÁC NHẬN ĐƠN HÀNG <i class="bi bi-arrow-right-short fs-4"></i>';
        }
    }
}

// Các hàm bổ trợ (Xóa/Thay đổi số lượng) giữ nguyên logic của Yến
window.changeQty = function (index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

document.addEventListener('DOMContentLoaded', renderCart);
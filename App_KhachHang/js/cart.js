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
            <div class="text-center mt-5 py-5">
                <i class="bi bi-cart-x fs-1 text-muted" style="font-size: 4rem !important;"></i>
                <p class="mt-3 text-muted">Giỏ hàng của bạn đang trống</p>
                <a href="index.html" class="btn btn-outline-primary btn-sm mt-2 px-4 rounded-pill">Quay lại chọn món</a>
            </div>`;
        updateCheckoutBar(0, 0);
        return;
    }

    // Vẽ danh sách các món ăn trong giỏ
    container.innerHTML = cart.map((item, index) => {
        let priceNum = typeof item.price === 'string'
            ? parseInt(item.price.replace(/[^0-9]/g, ''))
            : item.price;

        let displayPrice = (priceNum || 0).toLocaleString('vi-VN') + 'đ';

        // Xử lý options để không bị lặp chữ "Đường Đường", "Đá Đá"
        let optionText = "";
        if (item.options) {
            const size = item.options.size;
            // Nếu trong chuỗi đã có chữ 'đường' thì giữ nguyên, nếu chưa có thì mới thêm vào
            const sugar = item.options.sugar.toLowerCase().includes('đường')
                ? item.options.sugar
                : item.options.sugar + ' Đường';
            const ice = item.options.ice.toLowerCase().includes('đá')
                ? item.options.ice
                : item.options.ice + ' Đá';

            optionText = `${size} | ${sugar} | ${ice}`;
        }

        return `
        <div class="cart-item p-3 mb-3 shadow-sm border-0 rounded-4 bg-white animate__animated animate__fadeIn">
            <div class="d-flex align-items-center">
                <img src="${item.image}" class="cart-img me-3 rounded-3" 
                     style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #f0f0f0;">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="item-title mb-0 fw-bold text-dark">${item.name}</h6>
                            ${item.options ? `
                                <small class="text-muted d-block" style="font-size: 0.7rem; line-height: 1.2;">
                                    ${optionText}
                                </small>
                            ` : ''}
                        </div>
                        <i class="bi bi-x-circle-fill text-danger opacity-75" 
                           onclick="removeItem(${index})" 
                           style="cursor: pointer; font-size: 1.2rem;"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="item-price fw-bold text-primary" style="color: #826644 !important;">${displayPrice}</span>
                        <div class="d-flex align-items-center bg-light rounded-pill px-2 border">
                            <button class="btn btn-sm border-0 shadow-none px-2" onclick="changeQty(${index}, -1)">
                                <i class="bi bi-dash-lg" style="font-size: 0.8rem;"></i>
                            </button>
                            <span class="mx-2 fw-bold text-dark" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button class="btn btn-sm border-0 shadow-none px-2" onclick="changeQty(${index}, 1)">
                                <i class="bi bi-plus-lg" style="font-size: 0.8rem;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    calculateTotal(cart);
}

/**
 * 2. Hàm tăng/giảm số lượng món
 */
window.changeQty = function (index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart[index]) return;

    cart[index].quantity += delta;

    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

/**
 * 3. Hàm xóa món khỏi giỏ
 */
window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

/**
 * 4. Tính toán tổng tiền
 */
function calculateTotal(cart) {
    let totalMoney = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const price = typeof item.price === 'string'
            ? parseInt(item.price.replace(/[^0-9]/g, ''))
            : item.price;

        totalMoney += (item.quantity * (price || 0));
        totalItems += item.quantity;
    });

    updateCheckoutBar(totalMoney, totalItems);
}

/**
 * 5. Cập nhật thanh thanh toán phía dưới (Checkout Bar)
 */
function updateCheckoutBar(money, count) {
    const totalDisplay = document.querySelector('.checkout-bar .item-price') || document.getElementById('total-money-display');
    const countDisplay = document.querySelector('.checkout-bar span:first-child');

    if (totalDisplay) {
        totalDisplay.innerText = money.toLocaleString('vi-VN') + 'đ';
    }
    if (countDisplay) {
        countDisplay.innerText = `Tổng cộng (${count} món):`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
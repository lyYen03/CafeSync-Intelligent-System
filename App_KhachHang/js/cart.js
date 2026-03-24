// public/js/cart.js

// 1. Dữ liệu bàn giả lập (Giữ nguyên của Yến)
const tables = [
    { id: '02', status: 'empty' },
    { id: '03', status: 'empty' },
    { id: '05', status: 'empty' }
];

// 2. Hàm HIỂN THỊ GIỎ HÀNG từ LocalStorage
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-list'); // Đảm bảo ID này khớp với HTML

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center mt-5">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <p class="mt-2 text-muted">Giỏ hàng trống trơn à Yến ơi! ☕</p>
                <a href="index.html" class="btn btn-outline-primary btn-sm mt-2">Đi chọn món ngay</a>
            </div>`;
        updateCheckoutBar(0, 0);
        return;
    }

    // Vẽ danh sách món
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item p-3 mb-3 shadow-sm border-0 rounded-4 bg-white">
            <div class="d-flex align-items-center">
                <img src="${item.image}" class="cart-img me-3 rounded-3" style="width: 70px; height: 70px; object-fit: cover;">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                        <h6 class="item-title mb-0 fw-bold">${item.name}</h6>
                        <i class="bi bi-x-circle-fill text-danger opacity-75" onclick="removeItem(${index})" style="cursor: pointer;"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="item-price fw-bold text-primary">${item.price}</span>
                        <div class="d-flex align-items-center bg-light rounded-pill px-2">
                            <button class="btn btn-sm border-0" onclick="changeQty(${index}, -1)">-</button>
                            <span class="mx-2 fw-bold" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button class="btn btn-sm border-0" onclick="changeQty(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    calculateTotal(cart);
}

// 3. Hàm tăng/giảm số lượng
window.changeQty = function (index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Vẽ lại giao diện
};

// 4. Hàm xóa món
window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Vẽ lại giao diện
};

// 5. Logic tính toán tổng tiền
function calculateTotal(cart) {
    let totalMoney = 0;
    let totalItems = 0;

    cart.forEach(item => {
        // Xử lý chuỗi giá "35.000đ" thành số 35000
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        totalMoney += item.quantity * price;
        totalItems += item.quantity;
    });

    updateCheckoutBar(totalMoney, totalItems);
}

function updateCheckoutBar(money, count) {
    const totalDisplay = document.querySelector('.checkout-bar .item-price');
    const countDisplay = document.querySelector('.checkout-bar span:first-child');
    if (totalDisplay) totalDisplay.innerText = money.toLocaleString('vi-VN') + 'đ';
    if (countDisplay) countDisplay.innerText = `Tổng cộng (${count} món):`;
}

// 6. Logic nhận diện bàn (Giữ nguyên của Yến)
function initTableInfo() {
    const savedTable = localStorage.getItem('selectedTable');
    const qrInfo = document.getElementById('qr-table-info');
    const manualSection = document.getElementById('manual-selection');
    const displayTable = document.getElementById('display-table-no');

    if (savedTable && qrInfo) {
        qrInfo.classList.remove('d-none');
        if (manualSection) manualSection.classList.add('d-none');
        if (displayTable) displayTable.innerText = savedTable;
    }
}

// CHẠY KHỞI TẠO
initTableInfo();
renderCart();
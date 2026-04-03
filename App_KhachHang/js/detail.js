// 1. Khai báo các phần tử DOM
const priceDisplay = document.querySelector('.item-price');
const footerPriceDisplay = document.querySelector('.footer-action .fw-bold.fs-5');
const sizeOptions = document.querySelectorAll('input[name="size"]');
const qtyDisplay = document.querySelector('.footer-action span.mx-3');
const plusBtn = document.querySelector('.bi-plus-circle');
const minusBtn = document.querySelector('.bi-dash-circle');
const noteArea = document.querySelector('textarea');
const btnAddMain = document.querySelector('.btn-add-main');

let currentQty = 1;
let extraPrice = 0;
let basePrice = 0;

/**
 * 2. Hàm lấy giá gốc từ giao diện
 * (Giúp trang detail dùng chung được cho tất cả các món ăn)
 */
function getInitialPrice() {
    if (priceDisplay) {
        const rawPrice = priceDisplay.innerText;
        // Chuyển "35.000đ" -> 35000
        basePrice = parseInt(rawPrice.replace(/\D/g, '')) || 0;
    }
}

/**
 * 3. Hàm cập nhật tổng tiền khi đổi Size hoặc Số lượng
 */
function updateTotalPrice() {
    // Logic cộng thêm tiền theo size của Yến
    const sizeS = document.getElementById('sizeS');
    const sizeM = document.getElementById('sizeM');
    const sizeL = document.getElementById('sizeL');

    if (sizeS && sizeS.checked) extraPrice = 0;
    if (sizeM && sizeM.checked) extraPrice = 5000;
    if (sizeL && sizeL.checked) extraPrice = 10000;

    const finalPrice = (basePrice + extraPrice) * currentQty;
    const formattedPrice = finalPrice.toLocaleString('vi-VN') + 'đ';

    if (priceDisplay) priceDisplay.innerText = formattedPrice;
    if (footerPriceDisplay) footerPriceDisplay.innerText = formattedPrice;
}

// Xử lý sự kiện thay đổi Size
sizeOptions.forEach(radio => radio.addEventListener('change', updateTotalPrice));

// Xử lý tăng giảm số lượng
if (plusBtn) {
    plusBtn.addEventListener('click', () => {
        currentQty++;
        if (qtyDisplay) qtyDisplay.innerText = currentQty;
        updateTotalPrice();
    });
}
if (minusBtn) {
    minusBtn.addEventListener('click', () => {
        if (currentQty > 1) {
            currentQty--;
            if (qtyDisplay) qtyDisplay.innerText = currentQty;
            updateTotalPrice();
        }
    });
}

/**
 * 4. LOGIC LƯU VÀO GIỎ HÀNG (Khớp Model của Tài)
 */
if (btnAddMain) {
    btnAddMain.addEventListener('click', function () {
        const selectedSizeInput = document.querySelector('input[name="size"]:checked');
        const selectedSugarInput = document.querySelector('input[name="sugar"]:checked');
        const selectedIceInput = document.querySelector('input[name="ice"]:checked');

        const selectedSize = selectedSizeInput ? selectedSizeInput.nextElementSibling.innerText : "M";
        const selectedSugar = selectedSugarInput ? selectedSugarInput.nextElementSibling.innerText : "100%";
        const selectedIce = selectedIceInput ? selectedIceInput.nextElementSibling.innerText : "100%";

        const pricePerUnit = basePrice + extraPrice;

        const newItem = {
            name: document.querySelector('.item-name').innerText,
            price: pricePerUnit, // Lưu dạng Number cho Backend
            image: document.querySelector('.header-image').src,
            quantity: currentQty,
            options: {
                size: selectedSize,
                sugar: selectedSugar,
                ice: selectedIce
            },
            note: noteArea ? noteArea.value : ""
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Kiểm tra xem món này đã có với cùng option chưa để gộp số lượng
        const existingIndex = cart.findIndex(item =>
            item.name === newItem.name &&
            JSON.stringify(item.options) === JSON.stringify(newItem.options)
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += newItem.quantity;
        } else {
            cart.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateBadge();

        // Hiển thị thông báo
        if (window.Swal) {
            Swal.fire({
                icon: 'success',
                title: 'Đã thêm vào giỏ',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            alert("Đã thêm vào giỏ hàng!");
        }
    });
}

/**
 * 5. Cập nhật số lượng Badge trên Header
 */
function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge-count');
    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

/**
 * 6. HIỆU ỨNG ĐỔI MÀU HEADER KHI CUỘN
 */
window.addEventListener('scroll', function () {
    const headerAction = document.querySelector('.fixed-top-action');
    if (headerAction) {
        if (window.scrollY > 50) {
            headerAction.classList.add('scrolled');
        } else {
            headerAction.classList.remove('scrolled');
        }
    }
});

// Khởi tạo ban đầu khi load trang
document.addEventListener('DOMContentLoaded', () => {
    getInitialPrice(); // Lấy giá gốc trước
    updateBadge();
    updateTotalPrice();
});
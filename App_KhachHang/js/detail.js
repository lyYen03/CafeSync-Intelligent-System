// 1. Khai báo các biến
const basePrice = 35000;
const priceDisplay = document.querySelector('.item-price');
const footerPriceDisplay = document.querySelector('.footer-action .fw-bold.fs-5');
const sizeOptions = document.querySelectorAll('input[name="size"]');
const qtyDisplay = document.querySelector('.footer-action span.mx-3');
const plusBtn = document.querySelector('.bi-plus-circle');
const minusBtn = document.querySelector('.bi-dash-circle');
const noteArea = document.querySelector('textarea');
const btnAddMain = document.querySelector('.btn-add-main');
const cartBadge = document.getElementById('cart-badge-count'); // Dùng ID mới để chính xác hơn

let currentQty = 1;
let extraPrice = 0;

// Hàm cập nhật tổng tiền
function updateTotalPrice() {
    if (document.getElementById('sizeS').checked) extraPrice = 0;
    if (document.getElementById('sizeM').checked) extraPrice = 5000;
    if (document.getElementById('sizeL').checked) extraPrice = 10000;

    const finalPrice = (basePrice + extraPrice) * currentQty;
    const formattedPrice = finalPrice.toLocaleString('vi-VN') + 'đ';
    if (priceDisplay) priceDisplay.innerText = formattedPrice;
    if (footerPriceDisplay) footerPriceDisplay.innerText = formattedPrice;
}

// Xử lý sự kiện thay đổi Size/Số lượng
sizeOptions.forEach(radio => radio.addEventListener('change', updateTotalPrice));
if (plusBtn) plusBtn.addEventListener('click', () => { currentQty++; if (qtyDisplay) qtyDisplay.innerText = currentQty; updateTotalPrice(); });
if (minusBtn) minusBtn.addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; if (qtyDisplay) qtyDisplay.innerText = currentQty; updateTotalPrice(); }
});

// LOGIC LƯU VÀO GIỎ HÀNG
if (btnAddMain) btnAddMain.addEventListener('click', function () {
    const selectedSize = document.querySelector('input[name="size"]:checked').nextElementSibling.innerText;
    const selectedSugar = document.querySelector('input[name="sugar"]:checked').nextElementSibling.innerText;
    const selectedIce = document.querySelector('input[name="ice"]:checked').nextElementSibling.innerText;

    const pricePerUnit = basePrice + extraPrice;

    const newItem = {
        name: document.querySelector('.item-name').innerText,
        price: pricePerUnit,
        image: document.querySelector('.header-image').src,
        quantity: currentQty,
        options: { size: selectedSize, sugar: selectedSugar, ice: selectedIce },
        note: noteArea ? noteArea.value : ""
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateBadge();

    // Hiển thị thông báo đẹp bằng SweetAlert2 nếu có
    if (window.Swal) {
        Swal.fire({
            icon: 'success',
            title: 'Đã thêm vào giỏ',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: 'top-end'
        });
    } else {
        alert("Đã thêm vào giỏ hàng!");
    }
});

// Cập nhật số lượng Badge trên Header
function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge-count');
    if (badge) badge.innerText = totalItems;
}

// HIỆU ỨNG ĐỔI MÀU HEADER KHI CUỘN TRANG
window.addEventListener('scroll', function () {
    const headerAction = document.querySelector('.fixed-top-action');
    if (window.scrollY > 50) {
        headerAction.classList.add('scrolled');
    } else {
        headerAction.classList.remove('scrolled');
    }
});

// Khởi tạo ban đầu
document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    updateTotalPrice();
});
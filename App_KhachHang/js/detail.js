// js/detail.js

// 1. Khai báo các biến
const basePrice = 35000;
const priceDisplay = document.querySelector('.item-price');
const footerPriceDisplay = document.querySelector('.footer-action .fw-bold.fs-5');
const sizeOptions = document.querySelectorAll('input[name="size"]');
const qtyDisplay = document.querySelector('.footer-action span.mx-3');
const plusBtn = document.querySelector('.bi-plus-circle');
const minusBtn = document.querySelector('.bi-dash-circle');
const noteArea = document.querySelector('textarea'); // Lấy ô ghi chú

// Biến cho nút Thêm và Badge giỏ hàng
const btnAddMain = document.querySelector('.btn-add-main');
const cartBadge = document.querySelector('.badge');

let currentQty = 1;
let extraPrice = 0;

// 2. Hàm cập nhật giá tiền
function updateTotalPrice() {
    if (document.getElementById('sizeS').checked) extraPrice = 0;
    if (document.getElementById('sizeM').checked) extraPrice = 5000;
    if (document.getElementById('sizeL').checked) extraPrice = 10000;

    const finalPrice = (basePrice + extraPrice) * currentQty;
    const formattedPrice = finalPrice.toLocaleString('vi-VN') + 'đ';
    priceDisplay.innerText = formattedPrice;
    footerPriceDisplay.innerText = formattedPrice;
}

// 3. Sự kiện đổi Size và Tăng/Giảm
sizeOptions.forEach(radio => radio.addEventListener('change', updateTotalPrice));
plusBtn.addEventListener('click', () => { currentQty++; qtyDisplay.innerText = currentQty; updateTotalPrice(); });
minusBtn.addEventListener('click', () => {
    if (currentQty > 1) {
        currentQty--;
        qtyDisplay.innerText = currentQty;
        updateTotalPrice();
    }
});

// 4. LOGIC QUAN TRỌNG: Lưu món ăn kèm Options vào LocalStorage
btnAddMain.addEventListener('click', function () {
    // A. Thu thập dữ liệu khách chọn
    const selectedSize = document.querySelector('input[name="size"]:checked').nextElementSibling.innerText;
    const selectedSugar = document.querySelector('input[name="sugar"]:checked').nextElementSibling.innerText;
    const selectedIce = document.querySelector('input[name="ice"]:checked').nextElementSibling.innerText;
    const note = noteArea.value;
    const productName = document.querySelector('.item-name').innerText;
    const productImage = document.querySelector('.header-image').src;

    // B. Tạo đối tượng món ăn hoàn chỉnh
    const newItem = {
        name: productName,
        price: priceDisplay.innerText, // Giá đã bao gồm size và số lượng
        image: productImage,
        quantity: currentQty,
        options: {
            size: selectedSize,
            sugar: selectedSugar,
            ice: selectedIce
        },
        note: note
    };

    // C. Lưu vào "sổ tay" LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    // D. Hiệu ứng giao diện
    const originalContent = this.innerHTML;
    this.innerHTML = '<i class="bi bi-check-lg"></i> Đã thêm vào giỏ!';
    this.style.backgroundColor = '#28a745';

    // Cập nhật số lượng Badge (tổng tất cả món)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.innerText = totalItems;

    setTimeout(() => {
        this.innerHTML = originalContent;
        this.style.backgroundColor = '';
    }, 1500);
});

// Cập nhật badge khi vừa load trang chi tiết
function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.innerText = totalItems;
}

updateBadge();
updateTotalPrice();
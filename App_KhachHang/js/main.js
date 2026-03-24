// Khai báo các biến dùng chung
let cartCount = 0;
const cartBadge = document.getElementById('cart-count');
const cartButton = document.querySelector('.btn-outline-dark'); // Nút giỏ hàng trên navbar
const addButtons = document.querySelectorAll('.btn-add-cart'); // Các nút "Thêm" món ăn

// 1. Hàm cập nhật badge từ bộ nhớ khi vừa tải trang
function updateBadgeOnLoad() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartBadge) {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalQty;
        cartCount = totalQty; // Đồng bộ biến đếm với dữ liệu thật
    }
}

// 2. Logic khi nhấn nút "Thêm" món ăn
addButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Lấy dữ liệu món ăn từ Card
        const card = this.closest('.card');
        const productName = card.querySelector('.card-title').innerText;
        const productPrice = card.querySelector('.price').innerText;
        const productImage = card.querySelector('.card-img-top').src;

        const newItem = {
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };

        // Lưu vào LocalStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === newItem.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(newItem);
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        // --- HIỆU ỨNG GIAO DIỆN ---
        cartCount++;
        if (cartBadge) cartBadge.innerText = cartCount;

        // Hiệu ứng rung giỏ hàng
        if (cartButton) {
            cartButton.classList.add('shake-animation');
            setTimeout(() => cartButton.classList.remove('shake-animation'), 300);
        }

        // Hiệu ứng đổi màu nút "Thêm"
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check2"></i> Đã thêm';
        this.classList.replace('btn-add-cart', 'btn-success');
        this.style.backgroundColor = '#198754';
        this.style.color = '#fff';

        setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.replace('btn-success', 'btn-add-cart');
            this.style.backgroundColor = '';
            this.style.color = '';
        }, 800);
    });
});

// 3. Logic Chatbot
const chatBtn = document.getElementById('chatbot-btn');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat');

if (chatBtn && chatWindow) {
    chatBtn.addEventListener('click', function () {
        if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
            chatWindow.style.display = 'block';
            chatBtn.innerHTML = '<i class="bi bi-chat-dots-fill fs-3"></i>';
        } else {
            chatWindow.style.display = 'none';
            chatBtn.innerHTML = '<i class="bi bi-robot fs-3"></i>';
        }
    });
}

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', function () {
        chatWindow.style.display = 'none';
        chatBtn.innerHTML = '<i class="bi bi-robot fs-3"></i>';
    });
}

// 4. Nhận diện bàn từ URL
const urlParams = new URLSearchParams(window.location.search);
const tableNo = urlParams.get('table');
if (tableNo) {
    localStorage.setItem('selectedTable', tableNo);
    console.log("Đã xác nhận khách ngồi bàn: " + tableNo);
}

// Chạy khởi tạo khi load trang
updateBadgeOnLoad();
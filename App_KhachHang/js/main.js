// 1. Khai báo các phần tử DOM
const cartBadge = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-btn');
const chatBtn = document.getElementById('chatbot-btn');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat');

// 2. Hàm cập nhật badge tổng quát
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.innerText = totalQty;
        cartBadge.style.display = totalQty > 0 ? 'block' : 'none';
    }
}

// 3. Logic Chatbot (Sửa lỗi tự hiển thị)
function toggleChat() {
    if (chatWindow) {
        const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';

        if (isHidden) {
            chatWindow.style.display = 'flex'; // Hiện ra dạng flex
            chatBtn.innerHTML = '<i class="bi bi-x-lg fs-3"></i>';
        } else {
            chatWindow.style.display = 'none';
            chatBtn.innerHTML = '<i class="bi bi-chat-dots-fill fs-3"></i>';
        }
    }
}

// 4. Logic khi nhấn nút "Thêm" món ăn (Event Delegation)
document.addEventListener('click', function (e) {
    const btnAdd = e.target.closest('.btn-add-cart');
    if (btnAdd) {
        const card = btnAdd.closest('.card');
        const newItem = {
            name: card.querySelector('.card-title').innerText,
            price: card.querySelector('.price').innerText,
            image: card.querySelector('.card-img-top').src,
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === newItem.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(newItem);
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();

        // Hiệu ứng rung giỏ hàng
        if (cartButton) {
            cartButton.classList.add('shake-animation');
            setTimeout(() => cartButton.classList.remove('shake-animation'), 300);
        }

        // Feedback nút bấm
        const originalHTML = btnAdd.innerHTML;
        btnAdd.innerHTML = '<i class="bi bi-check2"></i> Đã thêm';
        btnAdd.style.backgroundColor = '#198754';
        btnAdd.style.color = '#fff';

        setTimeout(() => {
            btnAdd.innerHTML = originalHTML;
            btnAdd.style.backgroundColor = '';
            btnAdd.style.color = '';
        }, 800);
    }
});

// 5. Gán sự kiện cho Chatbot
if (chatBtn) chatBtn.addEventListener('click', toggleChat);
if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

// 6. Nhận diện bàn từ URL
const tableNo = new URLSearchParams(window.location.search).get('table');
if (tableNo) {
    localStorage.setItem('selectedTable', tableNo);
    console.log(`📍 Đang phục vụ tại Bàn: ${tableNo}`);
}

// 7. KHỞI TẠO KHI LOAD TRANG
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // ÉP KIỂU ẨN KHUNG CHAT KHI VỪA VÀO TRANG
    if (chatWindow) {
        chatWindow.style.display = 'none';
    }
});
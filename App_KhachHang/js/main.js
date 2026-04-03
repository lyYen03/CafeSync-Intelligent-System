// 1. Khai báo các phần tử DOM
const cartBadge = document.getElementById('cart-count');
const productContainer = document.getElementById('product-container');
const categoryButtons = document.querySelectorAll('#category-filter button');
const searchInput = document.getElementById('main-search');
const searchBtn = document.querySelector('#main-search ~ button') || document.querySelector('.search-box button') || document.getElementById('search-button');
const chatBtn = document.getElementById('chatbot-btn');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat');

// Bản đồ ID danh mục (Khớp với Database của Tài)
const categoryMap = {
    "Cà Phê": "69ce82f2e29634cdd7933bfe",
    "Sinh tố": "69ce855ce29634cdd7933c0b",
    "Nước ép": "69ce8560e29634cdd7933c0d",
    "Trà": "69ce856be29634cdd7933c0f"
};

// 2. HÀM HIỂN THỊ SẢN PHẨM
function displayProducts(products) {
    if (!products || products.length === 0) {
        productContainer.innerHTML = `
            <div class="col-12 text-center py-5 animate__animated animate__fadeIn">
                <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" width="80" class="mb-3 opacity-50">
                <p class="text-muted">Rất tiếc, Lisieen không tìm thấy món này rồi! ☕</p>
            </div>`;
        return;
    }

    productContainer.innerHTML = products.map(p => {
        const imagePath = p.image.startsWith('http') ? p.image : `/images/${p.image}`;
        return `
            <div class="col-6 col-md-4 col-lg-3 mb-3 animate__animated animate__fadeIn">
                <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <img src="${imagePath}" class="card-img-top" alt="${p.name}" style="height: 140px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/150?text=CafeSync'">
                    <div class="card-body d-flex flex-column p-2">
                        <h6 class="card-title text-truncate mb-1" style="font-size: 0.9rem; font-weight: 600; color: #3d2b1f;">${p.name}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="price fw-bold" style="font-size: 0.85rem; color: #704214;">${p.price.toLocaleString()}đ</span>
                            <button class="btn btn-add-cart btn-sm p-1 px-2 rounded-3 border-0" style="background-color: #704214; color: white;">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}

// 3. HÀM GỌI API TÌM KIẾM
async function performSearch() {
    const term = searchInput.value.trim();
    if (term === "") {
        fetchProducts('all');
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/api/search/products?q=${encodeURIComponent(term)}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
    }
}

// 4. LOGIC TÌM KIẾM (Click & Input)
if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

if (searchBtn) {
    searchBtn.onclick = function (e) {
        e.preventDefault();
        performSearch();
    };
}

// 5. LẤY DỮ LIỆU THEO DANH MỤC
async function fetchProducts(categoryName = 'all') {
    try {
        productContainer.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-secondary"></div></div>';
        let url = 'http://localhost:5000/api/products';
        if (categoryName !== 'all') {
            const categoryId = categoryMap[categoryName];
            if (categoryId) url += `?category=${categoryId}`;
        }
        const response = await fetch(url);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        productContainer.innerHTML = '<div class="col-12 text-center text-danger py-5">Lỗi kết nối máy chủ! 🛑</div>';
    }
}

categoryButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        categoryButtons.forEach(b => b.classList.remove('btn-dark', 'active'));
        categoryButtons.forEach(b => b.classList.add('btn-outline-dark'));
        this.classList.replace('btn-outline-dark', 'btn-dark');
        this.classList.add('active');
        fetchProducts(this.getAttribute('data-category'));
        if (searchInput) searchInput.value = "";
    });
});

// 6. GIỎ HÀNG & CHATBOT
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.innerText = totalQty;
        cartBadge.style.display = totalQty > 0 ? 'block' : 'none';
    }
}

function toggleChat() {
    if (chatWindow) {
        const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
        chatWindow.style.display = isHidden ? 'flex' : 'none';
        chatBtn.innerHTML = isHidden ? '<i class="bi bi-x-lg fs-3"></i>' : '<i class="bi bi-chat-dots-fill fs-3"></i>';
    }
}

// 7. QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP
function initAuthStatus() {
    const userName = localStorage.getItem('userName');
    const welcomeMsg = document.getElementById('welcome-msg');
    const userBtn = document.getElementById('user-action-btn');

    if (userName) {
        if (welcomeMsg) welcomeMsg.innerText = `Chào ${userName}! Hôm nay bạn muốn trải nghiệm hương vị nào?`;
        if (userBtn) {
            userBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
            userBtn.title = "Đăng xuất tài khoản";
            userBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm(`Chào ${userName}, bạn muốn đăng xuất khỏi hệ thống?`)) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userName');
                    window.location.reload();
                }
            };
        }
    } else {
        if (userBtn) {
            userBtn.onclick = () => { window.location.href = 'login.html'; };
        }
    }
}

// Lắng nghe sự kiện thêm vào giỏ hàng (Event Delegation)
document.addEventListener('click', function (e) {
    const btnAdd = e.target.closest('.btn-add-cart');
    if (btnAdd) {
        const card = btnAdd.closest('.card');
        const rawPrice = card.querySelector('.price').innerText;
        const numericPrice = parseInt(rawPrice.replace(/\D/g, ''));
        const newItem = {
            name: card.querySelector('.card-title').innerText,
            price: numericPrice,
            image: card.querySelector('.card-img-top').src,
            quantity: 1,
            options: { size: "M", sugar: "100%", ice: "100%" },
            note: ""
        };
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === newItem.name);
        if (existingItem) existingItem.quantity += 1; else cart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Hiệu ứng phản hồi nút bấm
        const originalHTML = btnAdd.innerHTML;
        btnAdd.innerHTML = '<i class="bi bi-check2 text-white"></i>';
        btnAdd.style.backgroundColor = '#198754';
        setTimeout(() => {
            btnAdd.innerHTML = originalHTML;
            btnAdd.style.backgroundColor = '#704214';
        }, 800);
    }
});

if (chatBtn) chatBtn.addEventListener('click', toggleChat);
if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

// KHỞI CHẠY KHI TRANG SẴN SÀNG
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchProducts();
    initAuthStatus();
    if (chatWindow) chatWindow.style.display = 'none';
});
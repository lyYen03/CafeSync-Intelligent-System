// public/js/checkout.js

// 1. Giả lập dữ liệu bàn trống
const tables = [
    { id: '02', status: 'empty' },
    { id: '03', status: 'empty' },
    { id: '05', status: 'empty' },
    { id: '08', status: 'empty' }
];

const tableSelect = document.getElementById('table-number');
const deliveryType = document.getElementById('delivery-type');
const tableArea = document.getElementById('table-selection');
const tableError = document.getElementById('table-error');
const qrInfo = document.getElementById('qr-info');
const manualInfo = document.getElementById('manual-info');
const displayTable = document.getElementById('display-table');

// 2. Hàm khởi tạo trang thanh toán
function initCheckout() {
    const savedTable = localStorage.getItem('selectedTable');

    if (savedTable) {
        if (qrInfo) qrInfo.classList.remove('d-none');
        if (manualInfo) manualInfo.classList.add('d-none');
        if (displayTable) displayTable.innerText = savedTable;
    } else {
        if (qrInfo) qrInfo.classList.add('d-none');
        if (manualInfo) manualInfo.classList.remove('d-none');
        loadAvailableTables();
    }
}

// 3. Đổ dữ liệu bàn trống vào select
function loadAvailableTables() {
    if (!tableSelect) return;
    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.id;
        option.textContent = `Bàn số ${table.id} (Trống)`;
        tableSelect.appendChild(option);
    });
}

// 4. Xử lý ẩn hiện phần chọn bàn
if (deliveryType) {
    deliveryType.addEventListener('change', function () {
        if (this.value === 'takeaway') {
            tableArea.classList.add('d-none');
        } else {
            tableArea.classList.remove('d-none');
        }
    });
}

// 5. Hàm xác nhận đặt hàng
async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedTable = localStorage.getItem('selectedTable');

    // Gom dữ liệu chuẩn bị gửi
    const orderData = {
        orderID: `CFS${Math.floor(Math.random() * 10000)}`,
        items: cart,
        totalPrice: parseInt(document.getElementById('final-total').innerText.replace(/[^0-9]/g, '')),
        location: savedTable ? `Bàn ${savedTable}` : "Mang đi"
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        if (result.success) {
            alert("🎉 Tuyệt vời Yến ơi! Đơn hàng đã lên hệ thống.");
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert("Có lỗi xảy ra, Yến kiểm tra lại Server nhé!");
    }
}

// Chạy khởi tạo ngay khi load file js
initCheckout();
// Thêm đoạn này vào cuối file public/js/checkout.js

function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('order-summary-list');
    const totalDisplay = document.getElementById('final-total');

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted">Chưa có món nào để thanh toán.</p>';
        return;
    }

    let totalMoney = 0;

    container.innerHTML = cart.map(item => {
        // Tính tổng tiền (Xử lý chuỗi giá thành số)
        const priceValue = parseInt(item.price.replace(/[^0-9]/g, ''));
        totalMoney += priceValue;

        // Vẽ giao diện từng món kèm Options và Ghi chú
        return `
            <div class="mb-3">
                <div class="d-flex justify-content-between fw-bold">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${item.price}</span>
                </div>
                <div class="ps-3 border-start ms-2 mt-1" style="border-width: 2px !important; border-color: var(--raw-umber) !important;">
                    ${item.options ? `
                        <small class="text-muted d-block">- Size: ${item.options.size}</small>
                        <small class="text-muted d-block">- Lựa chọn: ${item.options.sugar} Đường, ${item.options.ice} Đá</small>
                    ` : ''}
                    ${item.note ? `
                        <small class="text-info d-block" style="font-size: 0.8rem;">
                            <i class="bi bi-chat-left-text me-1"></i> Ghi chú: "${item.note}"
                        </small>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    totalDisplay.innerText = totalMoney.toLocaleString('vi-VN') + 'đ';
}

// Chạy hàm này khi trang load
renderOrderSummary();
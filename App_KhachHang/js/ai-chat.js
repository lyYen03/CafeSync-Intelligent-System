// Hàm gửi tin nhắn tới Lisieen AI
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const content = document.getElementById('chat-content');

    // Kiểm tra nếu ô nhập trống thì không gửi
    if (!input || !input.value.trim()) return;

    const userMsg = input.value;

    // 1. Hiển thị tin nhắn của người dùng (Yến) - Căn phải, màu nâu nhạt
    content.innerHTML += `
        <div class="d-flex justify-content-end mb-3">
            <div class="p-2 rounded-3 shadow-sm text-white" 
                 style="max-width: 85%; font-size: 0.85rem; background-color: #a67c52;">
                ${userMsg}
            </div>
        </div>`;

    input.value = ''; // Xóa ô nhập sau khi gửi
    content.scrollTop = content.scrollHeight; // Tự động cuộn xuống cuối

    try {
        // 2. Gọi API đến Backend đã cấu hình ở Port 5000
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMsg,
                userName: "Yến" // Bạn có thể lấy từ localStorage nếu đã đăng nhập
            })
        });

        const data = await response.json();

        // 3. Hiển thị phản hồi từ Lisieen AI - Căn trái, màu trắng
        content.innerHTML += `
            <div class="d-flex justify-content-start mb-3">
                <div class="bg-white p-2 rounded-3 shadow-sm border" 
                     style="max-width: 85%; font-size: 0.85rem; border-left: 4px solid var(--raw-umber) !important;">
                    <strong style="color: var(--raw-umber);">Lisieen:</strong> ${data.reply}
                </div>
            </div>`;

        content.scrollTop = content.scrollHeight;
    } catch (err) {
        console.error("Lỗi kết nối AI:", err);
        content.innerHTML += `
            <div class="text-center small text-danger my-2">
                <i class="bi bi-exclamation-triangle"></i> Lisieen đang bận pha máy, thử lại sau nhé!
            </div>`;
    }
}

// 4. Thiết lập các sự kiện khi trang web tải xong
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-chat-btn');
    const input = document.getElementById('chat-input');
    const chatBtn = document.getElementById('chatbot-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');

    // Mở khung chat
    if (chatBtn) {
        chatBtn.onclick = () => {
            chatWindow.style.display = 'flex'; // Hiện khung chat
            chatBtn.style.display = 'none';    // Ẩn nút tròn
        };
    }

    // Đóng khung chat
    if (closeChat) {
        closeChat.onclick = () => {
            chatWindow.style.display = 'none'; // Ẩn khung chat
            chatBtn.style.display = 'flex';    // Hiện lại nút tròn
        };
    }

    // Gửi bằng nút bấm
    if (sendBtn) {
        sendBtn.onclick = sendMessage;
    }

    // Gửi bằng phím Enter
    if (input) {
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Ngăn xuống dòng
                sendMessage();
            }
        };
    }
});
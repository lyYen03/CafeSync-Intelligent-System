/**
 * js/ai-chat.js
 * Logic điều khiển Lisieen AI Chatbot - CaféSync
 */

function showTypingIndicator() {
    const content = document.getElementById('chat-content');
    if (!content) return;
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'd-flex justify-content-start mb-3 animate__animated animate__fadeIn';
    typingDiv.innerHTML = `
        <div class="ai-bubble-typing p-2 rounded-3 shadow-sm border">
            <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>`;
    content.appendChild(typingDiv);
    content.scrollTop = content.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const content = document.getElementById('chat-content');
    if (!input || !input.value.trim()) return;

    const userMsg = input.value;
    input.value = '';

    content.innerHTML += `
        <div class="d-flex justify-content-end mb-3 animate__animated animate__fadeInRight animate__faster">
            <div class="user-chat-bubble p-2 rounded-3 shadow-sm text-white">
                ${userMsg}
            </div>
        </div>`;
    content.scrollTop = content.scrollHeight;

    showTypingIndicator();

    try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg, userName: "Yến" })
        });

        const data = await response.json();
        removeTypingIndicator();

        content.innerHTML += `
            <div class="d-flex justify-content-start mb-3 animate__animated animate__fadeInLeft animate__faster">
                <div class="ai-chat-bubble bg-white p-2 rounded-3 shadow-sm border">
                    <strong class="ai-name">Lisieen:</strong> ${data.reply}
                </div>
            </div>`;
    } catch (err) {
        removeTypingIndicator();
        content.innerHTML += `<div class="text-center small text-danger my-2">Lisieen đang bận pha máy, thử lại sau nhé!</div>`;
    }
    content.scrollTop = content.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-chat-btn');
    const input = document.getElementById('chat-input');
    const chatBtn = document.getElementById('chatbot-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');

    if (chatBtn) chatBtn.onclick = () => { chatWindow.style.display = 'flex'; chatBtn.style.display = 'none'; input.focus(); };
    if (closeChat) closeChat.onclick = () => { chatWindow.style.display = 'none'; chatBtn.style.display = 'flex'; };
    if (sendBtn) sendBtn.onclick = sendMessage;
    if (input) input.onkeypress = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } };
});
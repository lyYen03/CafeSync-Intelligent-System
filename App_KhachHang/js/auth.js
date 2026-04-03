const API_URL = 'http://localhost:5000/api/auth';

// 1. XỬ LÝ ĐĂNG NHẬP
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    try {
        const res = await fetch(`${API_URL}/login-custom`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userName', data.user.name);
            alert(`Chào mừng bạn quay trở lại! ☕`);
            window.location.href = "index.html";
        } else {
            alert(data.message || "Đăng nhập không thành công!");
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Không thể kết nối đến máy chủ!");
    }
};

// 2. XỬ LÝ ĐĂNG KÝ
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;

    try {
        const res = await fetch(`${API_URL}/register-custom`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Đăng ký tài khoản thành công! 🎉");
            // Tự động chuyển sang tab đăng nhập
            const loginTabTrigger = document.getElementById('pills-login-tab');
            const tab = new bootstrap.Tab(loginTabTrigger);
            tab.show();
        } else {
            alert(data.message || "Đăng ký không thành công!");
        }
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        alert("Lỗi kết nối máy chủ!");
    }
};
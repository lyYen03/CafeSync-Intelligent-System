import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/auth.css';

const Login = () => {
    // 1. Quản lý trạng thái Tab (Sign In / Sign Up)
    const [isLoginTab, setIsLoginTab] = useState(true);

    // 2. Quản lý dữ liệu nhập vào
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api/auth';

    // 3. Hàm xử lý Đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/login-custom`, loginData);
            if (res.data.token) {
                localStorage.setItem('userToken', res.data.token);
                localStorage.setItem('userName', res.data.user.name);
                alert(`Chào mừng Yến quay trở lại CaféSync! ☕`);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Đăng nhập thất bại rồi!");
        }
    };

    // 4. Hàm xử lý Đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/register-custom`, registerData);
            alert("Tạo tài khoản thành công! 🎉 Mời Yến đăng nhập.");
            setIsLoginTab(true); // Tự động chuyển về tab đăng nhập
        } catch (error) {
            alert(error.response?.data?.message || "Đăng ký không thành công!");
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Nút quay lại trang chủ tiện lợi */}
            <Link to="/" className="auth-back-btn">
                <i className="bi bi-chevron-left fs-5"></i>
            </Link>

            <div className="auth-container animate__animated animate__fadeIn">
                {/* Ảnh Header nghệ thuật */}
                <img
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"
                    alt="CaféSync Coffee"
                    className="auth-header-img"
                />

                <div className="auth-form-content shadow-lg">
                    {/* Tab Navigation giống mẫu Yến chọn */}
                    <ul className="nav auth-tabs-nav">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${isLoginTab ? 'active' : ''}`}
                                onClick={() => setIsLoginTab(true)}
                            >Sign In</button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${!isLoginTab ? 'active' : ''}`}
                                onClick={() => setIsLoginTab(false)}
                            >Sign Up</button>
                        </li>
                    </ul>

                    {isLoginTab ? (
                        /* --- FORM ĐĂNG NHẬP (Sign In) --- */
                        <form onSubmit={handleLogin} className="animate__animated animate__fadeIn">
                            <div className="auth-input-group">
                                <i className="bi bi-envelope"></i>
                                <input
                                    type="email" className="auth-form-control"
                                    placeholder="Email Address" required
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                            </div>
                            <div className="auth-input-group">
                                <i className="bi bi-lock"></i>
                                <input
                                    type="password" className="auth-form-control"
                                    placeholder="Password" required
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                            </div>
                            <div className="text-center mt-4 mb-3">
                                <button type="submit" className="btn-auth-soft shadow">
                                    SIGN IN
                                </button>
                            </div>
                            <div className="text-center">
                                <a href="#" className="auth-secondary-link">Forgot Password?</a>
                            </div>
                        </form>
                    ) : (
                        /* --- FORM ĐĂNG KÝ (Sign Up) --- */
                        <form onSubmit={handleRegister} className="animate__animated animate__fadeIn">
                            <div className="auth-input-group">
                                <i className="bi bi-person"></i>
                                <input
                                    type="text" className="auth-form-control"
                                    placeholder="Full Name" required
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                />
                            </div>
                            <div className="auth-input-group">
                                <i className="bi bi-envelope"></i>
                                <input
                                    type="email" className="auth-form-control"
                                    placeholder="Email Address" required
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                            </div>
                            <div className="auth-input-group">
                                <i className="bi bi-lock"></i>
                                <input
                                    type="password" className="auth-form-control"
                                    placeholder="Password" required
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                />
                            </div>
                            <div className="text-center mt-4">
                                <button type="submit" className="btn-auth-soft shadow">
                                    SIGN UP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Social Login Icons */}
                    <div className="text-center mt-4">
                        <span className="text-white-50 small">or</span>
                        <div className="auth-social-group">
                            <a href="#" className="auth-social-icon"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="auth-social-icon"><i className="bi bi-google"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
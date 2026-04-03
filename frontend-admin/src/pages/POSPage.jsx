import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Button, Space, List, Divider, message, InputNumber } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { getCategories } from "../api/categoryApi";
import { getProductsByCategory } from "../api/productApi";

const { Title, Text } = Typography;

const POSPage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. Lấy danh mục và món ăn ban đầu
    useEffect(() => {
        getCategories().then(data => {
            setCategories(data);
            if (data.length > 0) handleSelectCategory(data[0]._id);
        });
    }, []);

    const handleSelectCategory = async (id) => {
        setActiveCategory(id);
        setLoading(true);
        const data = await getProductsByCategory(id);
        setProducts(data);
        setLoading(false);
    };

    // 2. Logic Giỏ hàng tại quầy
    const addToCart = (product) => {
        const exist = cart.find(item => item._id === product._id);
        if (exist) {
            setCart(cart.map(item => item._id === product._id ? { ...exist, quantity: exist.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. Xác nhận Thanh toán (Gửi lên Server)
    const handleCheckout = async () => {
        if (cart.length === 0) return message.warning("Giỏ hàng đang trống!");

        const payload = {
            orderID: "POS-" + Date.now(),
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                options: { size: "M", sugar: "100%", ice: "100%" }
            })),
            totalPrice: totalAmount,
            status: "Hoàn thành", // Bán tại quầy thì xong luôn
            location: "Tại quầy (POS)",
            paymentMethod: "Tiền mặt"
        };

        try {
            await axios.post("http://localhost:5000/api/orders", payload);
            message.success("Thanh toán thành công! Đã lưu đơn hàng.");
            setCart([]); // Xóa giỏ hàng sau khi xong
        } catch (error) {
            message.error("Lỗi khi lưu đơn hàng!");
        }
    };

    return (
        <Row gutter={24}>
            {/* CỘT TRÁI: THỰC ĐƠN (70%) */}
            <Col span={16}>
                <Title level={4}>☕ Thực đơn gọi món</Title>
                <Space wrap style={{ marginBottom: 20 }}>
                    {categories.map(cat => (
                        <Button
                            key={cat._id}
                            shape="round"
                            type={activeCategory === cat._id ? "primary" : "default"}
                            onClick={() => handleSelectCategory(cat._id)}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </Space>

                <Row gutter={[16, 16]} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {products.map(p => (
                        <Col span={8} key={p._id}>
                            <Card
                                hoverable
                                cover={<img src={`http://localhost:5000/images/${p.image}`} style={{ height: 120, objectFit: 'cover' }} />}
                                onClick={() => addToCart(p)}
                            >
                                <Card.Meta title={p.name} description={<Text strong color="green">{p.price.toLocaleString()}đ</Text>} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>

            {/* CỘT PHẢI: GIỎ HÀNG & THANH TOÁN (30%) */}
            <Col span={8}>
                <Card title={<span><ShoppingCartOutlined /> Đơn hàng tại quầy</span>} className="shadow-sm">
                    <List
                        dataSource={cart}
                        renderItem={item => (
                            <List.Item actions={[<DeleteOutlined onClick={() => removeFromCart(item._id)} style={{ color: 'red' }} />]}>
                                <List.Item.Meta title={item.name} description={`${item.quantity} x ${item.price.toLocaleString()}đ`} />
                            </List.Item>
                        )}
                    />
                    <Divider />
                    <div style={{ display: 'flex', justifyBetween: 'space-between', marginBottom: 20 }}>
                        <Text strong fontSize={18}>TỔNG TIỀN:</Text>
                        <Title level={4} style={{ margin: 0, color: '#16a34a' }}>{totalAmount.toLocaleString()} VND</Title>
                    </div>
                    <Button
                        type="primary"
                        block
                        size="large"
                        icon={<CheckCircleOutlined />}
                        onClick={handleCheckout}
                        style={{ height: 60, borderRadius: 12, background: '#16a34a' }}
                    >
                        XÁC NHẬN THANH TOÁN
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default POSPage;
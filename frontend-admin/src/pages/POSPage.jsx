import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { Modal, Form, Select, Input } from "antd";

const removeAccents = (str) => {
  if (!str) return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
};

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [optionModal, setOptionModal] = useState({ open: false, product: null });
  const [optionForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const filteredProducts = products.filter((product) => {
    const productName = removeAccents(product.name);
    const searchKeyword = removeAccents(searchText).trim();
    return productName.includes(searchKeyword);
  });

  // Lấy danh sách sản phẩm
  useEffect(() => {
    axiosClient.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => alert("Không lấy được danh sách món!"));
  }, []);

  // Thêm món vào giỏ
  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item._id === product._id);
      if (found) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Trừ món khỏi giỏ
  const removeFromCart = (productId) => {
    setCart(prev =>
      prev
        .map(item =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Xóa hẳn món khỏi giỏ
  const deleteFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  // Đặt món
  const handleOrder = () => {
    if (cart.length === 0) return alert("Chưa chọn món!");
    const orderID = "POS" + Date.now();
    const items = cart.map(item => ({
      id_product: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options || {}, // truyền đầy đủ options
      note: item.note || ""
    }));
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderData = {
      orderID,
      items,
      totalPrice,
      location: "Tại quầy",
      // status, createdAt: backend tự sinh
    };
    axiosClient.post("/orders", orderData)
      .then(() => {
        alert("Đặt món thành công!");
        setCart([]);
      })
      .catch((err) => {
        alert("Đặt món thất bại!");
        console.error(err);
      });
  };

  return (
    <div className="container-fluid py-3">
      {/* CSS HOVER trực tiếp */}
      <style>
        {`
        .product-card {
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .product-card:hover {
          box-shadow: 0 0 0 3px #0d6efd33, 0 4px 24px rgba(0,0,0,0.10);
          border: 2px solid #0d6efd;
          transform: translateY(-4px) scale(1.03);
          cursor: pointer;
        }
      `}
      </style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">🛒 POS - Đặt món tại quầy</h3>
        <Input.Search
          placeholder="Tìm kiếm món theo tên..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <div className="row">
        {/* DANH SÁCH MÓN */}
        <div className="col-lg-8">
          <div className="row g-3">
            {filteredProducts.map(product => (
              <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                <div className="card h-100 border-0 shadow-sm product-card">
                  <img
                    src={product.image ? `http://localhost:5000/images/${product.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: 140, objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column p-2">
                    <div className="fw-semibold small text-truncate">
                      {product.name}
                    </div>

                    <div className="text-danger fw-bold mb-2">
                      {product.price?.toLocaleString()}đ
                    </div>

                    <button
                      className="btn btn-sm btn-primary mt-auto"
                      onClick={() => setOptionModal({ open: true, product })}
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center text-muted py-5">
                Không có sản phẩm
              </div>
            )}
          </div>
        </div>

        {/* GIỎ HÀNG */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header fw-bold">
              🧾 Giỏ hàng
            </div>

            <div className="card-body" style={{ maxHeight: 500, overflowY: "auto" }}>
              {cart.length === 0 && (
                <div className="text-muted">Chưa có món</div>
              )}

              {cart.map(item => (
                <div key={item._id} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image ? `http://localhost:5000/images/${item.image}` : "https://via.placeholder.com/45x45?text=No+Image"}
                    width={45}
                    height={45}
                    style={{ borderRadius: 8, objectFit: "cover", marginRight: 10 }}
                    alt={item.name}
                  />

                  <div className="flex-grow-1">
                    <div className="fw-semibold small">{item.name}</div>
                    {item.options && (
                      <div className="small text-muted">
                        {item.options.size && <>Size: {item.options.size} </>}
                        {item.options.topping && item.options.topping.length > 0 && <>| Topping: {item.options.topping.join(", ")} </>}
                        {item.options.sugar && <>| Đường: {item.options.sugar} </>}
                        {item.options.ice && <>| Đá: {item.options.ice} </>}
                        {item.note && <>| Note: {item.note}</>}
                      </div>
                    )}
                    <div className="text-muted small">x{item.quantity}</div>
                  </div>

                  <div className="fw-bold text-danger me-2">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>

                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => removeFromCart(item._id)}
                    title="Giảm số lượng"
                  >-</button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteFromCart(item._id)}
                    title="Xóa khỏi giỏ"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="card-footer">
                <div className="d-flex justify-content-between fw-bold mb-2">
                  <span>Tổng:</span>
                  <span className="text-danger">
                    {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}đ
                  </span>
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={handleOrder}
                >
                  ✅ Xác nhận
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TUỲ CHỌN SẢN PHẨM */}
      <Modal
        open={optionModal.open}
        title={optionModal.product?.name}
        onCancel={() => setOptionModal({ open: false, product: null })}
        onOk={() => {
          optionForm.validateFields().then(values => {
            // Thêm vào giỏ hàng với tuỳ chọn
            const { size, topping, sugar, ice, note } = values;
            const product = optionModal.product;
            setCart(prev => {
              return [
                ...prev,
                {
                  ...product,
                  quantity: 1,
                  options: {
                    size,
                    toppings: topping || [],
                    sugar,
                    ice
                  },
                  note
                }
              ];
            });
            setOptionModal({ open: false, product: null });
            optionForm.resetFields();
          });
        }}
        okText="Thêm vào giỏ"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={optionForm} layout="vertical">
          {optionModal.product?.sizes?.length > 0 && (
            <Form.Item name="size" label="Size" rules={[{ required: true, message: "Chọn size" }]}>
              <Select options={optionModal.product.sizes.map(s => ({ label: s, value: s }))} />
            </Form.Item>
          )}
          {optionModal.product?.toppings?.length > 0 && (
            <Form.Item name="topping" label="Topping">
              <Select
                mode="multiple"
                options={optionModal.product.toppings.map(t => ({ label: t, value: t }))}
                placeholder="Chọn topping (nếu có)"
              />
            </Form.Item>
          )}
          {optionModal.product?.sugarOptions?.length > 0 && (
            <Form.Item name="sugar" label="Mức đường" rules={[{ required: true, message: "Chọn mức đường" }]}>
              <Select options={optionModal.product.sugarOptions.map(s => ({ label: s, value: s }))} />
            </Form.Item>
          )}
          {optionModal.product?.iceOptions?.length > 0 && (
            <Form.Item name="ice" label="Mức đá" rules={[{ required: true, message: "Chọn mức đá" }]}>
              <Select options={optionModal.product.iceOptions.map(i => ({ label: i, value: i }))} />
            </Form.Item>
          )}
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú cho món này (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default POSPage;
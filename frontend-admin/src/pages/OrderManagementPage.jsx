import { useEffect, useState } from "react";
import { Table, Typography, Tag, Button, Modal, Select, message, Popconfirm } from "antd";
import axios from "axios";

const { Title } = Typography;

const statusColors = {
  "Chờ xác nhận": "orange",
  "Đang pha chế": "blue",
  "Hoàn thành": "green",
};

const statusOptions = [
  { value: "Chờ xác nhận", label: "Chờ xác nhận" },
  { value: "Đang pha chế", label: "Đang pha chế" },
  { value: "Hoàn thành", label: "Hoàn thành" },
];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [status, setStatus] = useState("");

  // Load orders
  const fetchOrders = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/orders")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open modal to update status
  const openStatusModal = (order) => {
    setEditingOrder(order);
    setStatus(order.status);
  };

  // Update order status
  const handleUpdateStatus = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${editingOrder._id}/status`, { status });
      message.success("Cập nhật trạng thái thành công!");
      setEditingOrder(null);
      fetchOrders();
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      message.success("Xóa đơn hàng thành công!");
      fetchOrders();
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "orderID", key: "orderID" },
    { title: "Vị trí", dataIndex: "location", key: "location" },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <ul style={{ paddingLeft: 16 }}>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name} x{item.quantity} ({item.price.toLocaleString("vi-VN")}đ)
              {item.options && (
                <span style={{ color: "#888", fontSize: 12 }}>
                  {item.options.size ? `, Size: ${item.options.size}` : ""}
                  {item.options.sugar ? `, Đường: ${item.options.sugar}` : ""}
                  {item.options.ice ? `, Đá: ${item.options.ice}` : ""}
                </span>
              )}
              {item.note && <span style={{ color: "#888", fontSize: 12 }}> - {item.note}</span>}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (v) => <b style={{ color: "#16a34a" }}>{v.toLocaleString("vi-VN")} VND</b>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || "default"}>{status}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openStatusModal(record)} style={{ marginRight: 8 }}>
            Đổi trạng thái
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa đơn này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>🧾 Quản lý Đơn hàng</Title>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={!!editingOrder}
        title="Cập nhật trạng thái đơn hàng"
        onCancel={() => setEditingOrder(null)}
        onOk={handleUpdateStatus}
        okText="Cập nhật"
      >
        <Select
          value={status}
          onChange={setStatus}
          style={{ width: "100%" }}
          options={statusOptions}
        />
      </Modal>
    </div>
  );
};

export default OrderManagementPage;
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout>
      <Sidebar />
      <Layout style={{ marginLeft: 220 }}>
        <Header />
        <Content
          style={{
            marginTop: 64,
            padding: 32,
            background: "#f6f9fc",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
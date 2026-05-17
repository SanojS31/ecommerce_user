import Layout from "@/components/common/Layout";
import CartSection from "@/components/cart/CartSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function CartPage() {
  return (
    <PrivateRoute>
      <Layout>
        <CartSection />
      </Layout>
    </PrivateRoute>
  );
}
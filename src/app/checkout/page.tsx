import Layout from "@/components/common/Layout";
import CheckoutSection from "@/components/checkout/CheckoutSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function CheckoutPage() {
  return (
    <PrivateRoute>
      <Layout>
        <CheckoutSection />
      </Layout>
    </PrivateRoute>
  );
}
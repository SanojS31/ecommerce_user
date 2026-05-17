import Layout from "@/components/common/Layout";
import WishlistSection from "@/components/wishlist/WishlistSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function WishlistPage() {
  return (
    <PrivateRoute>
      <Layout>
        <WishlistSection />
      </Layout>
    </PrivateRoute>
  );
}
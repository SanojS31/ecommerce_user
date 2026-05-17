import Layout from "@/components/common/Layout";
import ProfileSection from "@/components/profile/ProfileSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Layout>
        <ProfileSection />
      </Layout>
    </PrivateRoute>
  );
}
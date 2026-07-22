import { Suspense } from "react";
import LoginSection from "@/components/auth/LoginSection";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginSection />
    </Suspense>
  );
}
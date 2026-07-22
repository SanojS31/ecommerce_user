import { Suspense } from "react";
import RegisterSection from "@/components/auth/RegisterSection";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterSection />
    </Suspense>
  );
}
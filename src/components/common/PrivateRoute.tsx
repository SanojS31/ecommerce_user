"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userAccessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <Spin className="h-screen flex items-center justify-center">
        Loading...
      </Spin>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      {children}
    </div>
  );
}
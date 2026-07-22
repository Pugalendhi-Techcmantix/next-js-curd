"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, isAuthenticated, logout } from "@/app/lib/auth";
import { Button, Spin } from "antd";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setUser(getUser());

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large">Loading...</Spin>
      </div>
      // <Spin className="h-screen! flex items-center justify-center">
      //   Loading...
      // </Spin>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Inventory</h2>

        <ul className="space-y-3">
          <li>Dashboard</li>
          <li>Users</li>
          <li>Products</li>
          <li>Categories</li>
          <li>Suppliers</li>
        </ul>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between">
          <p>
            Welcome, <strong>{user?.username}</strong>
          </p>
          <Button onClick={logout}>Logout</Button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

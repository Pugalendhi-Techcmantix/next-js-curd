"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, isAuthenticated, logout } from "@/app/lib/auth";
import { Button, Spin, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname = usePathname();

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
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-200">
          Inventory
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          style={{ height: "100%", borderRight: 0 }}
          items={[
            {
              key: "/dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => router.push("/dashboard"),
            },
            {
              key: "masters",
              icon: <TeamOutlined />,
              label: "Masters",
              children: [
                {
                  key: "/employees",
                  icon: <UserOutlined />,
                  label: "Employees",
                  onClick: () => router.push("/employees"),
                },
                {
                  key: "/roles",
                  icon: <UserOutlined />,
                  label: "Roles",
                  onClick: () => router.push("/roles"),
                },
                // {
                //   key: "/categories",
                //   label: "Categories",
                //   onClick: () => router.push("/categories"),
                // },
                // {
                //   key: "/suppliers",
                //   label: "Suppliers",
                //   onClick: () => router.push("/suppliers"),
                // },
              ],
            },
            // {
            //   key: "inventory",
            //   icon: <AppstoreOutlined />,
            //   label: "Inventory",
            //   children: [
            //     {
            //       key: "/products",
            //       icon: <ShoppingOutlined />,
            //       label: "Products",
            //       onClick: () => router.push("/products"),
            //     },
            //     {
            //       key: "/stocks",
            //       label: "Stocks",
            //       onClick: () => router.push("/stocks"),
            //     },
            //   ],
            // },
            // {
            //   key: "/settings",
            //   icon: <SettingOutlined />,
            //   label: "Settings",
            //   onClick: () => router.push("/settings"),
            // },
          ]}
        />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6">
          <p>
            Welcome, <strong>{user?.username}</strong>
          </p>

          <Button danger onClick={logout}>
            Logout
          </Button>
        </header>

        <main className="flex-1 bg-slate-100 p-6">{children}</main>
      </div>
    </div>
  );
}

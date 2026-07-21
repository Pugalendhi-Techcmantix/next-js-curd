export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h2 className="text-xl font-bold mb-5">
          Inventory
        </h2>

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
        <header className="bg-white shadow px-6 py-4">
          Welcome Admin
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
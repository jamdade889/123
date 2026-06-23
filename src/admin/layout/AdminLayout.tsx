import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  CreditCard,
  LogOut,
  UserCircle,
  Image,
  Lock

} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-xl transition font-medium ${isActive
    ? "bg-blue-600 text-white shadow-md"
    : "text-gray-700 hover:bg-gray-100"
  }`;

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-xl flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static z-50 md:z-auto h-full`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Admin Info */}
        <div className="flex items-center gap-3 p-4 border-b">
          <UserCircle size={35} className="text-gray-500" />
          <div>
            <p className="font-semibold">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Users size={18} />
            Users
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <ShoppingCart size={18} />
            Shop Products
          </NavLink>

          <NavLink to="/admin/admin-products" className={linkClass}>
            <Package size={18} />
            Admin Products
          </NavLink>

          <NavLink to="/admin/payments" className={linkClass}>
            <CreditCard size={18} />
            Payments
          </NavLink>

          <NavLink to="/admin/testimonials" className={linkClass}>
            <Image size={18} />
            Testimonials
          </NavLink>
        </nav>

        {/* Logout (Always visible at bottom) */}
        <div className="p-4 border-t">

          <button
            onClick={() => navigate("/admin/change-password")}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Lock size={18} />
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 hover:bg-gray-200 rounded"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-700">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-gray-600" />
            <span className="hidden md:block font-medium">{user?.name}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
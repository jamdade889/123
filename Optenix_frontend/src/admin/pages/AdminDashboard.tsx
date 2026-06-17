import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  ShoppingCart,
  CreditCard,
  Package
} from "lucide-react";

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error", error);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome Back, 
        </h2>
        <p className="text-gray-500 mt-1">
          Here’s what’s happening in your store today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">
                {data.totalUsers}
              </h3>
            </div>
            <Users className="text-blue-600" size={30} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">
                {data.totalProducts}
              </h3>
            </div>
            <Package className="text-green-600" size={30} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Orders</p>
              <h3 className="text-2xl font-bold mt-1">
                {data.totalOrders}
              </h3>
            </div>
            <ShoppingCart className="text-purple-600" size={30} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                ₹{data.totalRevenue}
              </h3>
            </div>
            <CreditCard className="text-red-500" size={30} />
          </div>
        </div>

      </div>
    </div>
  );
}
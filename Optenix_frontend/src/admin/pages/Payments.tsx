// src/admin/pages/Payments.tsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/payments") // ✅ FIXED
      .then(res => setPayments(res.data))
      .catch(err => console.error("Payments API error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading payments...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map(p => (
                <tr key={p._id} className="border-b">
                  <td className="p-3">{p.user?.email}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
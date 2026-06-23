import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Users() {
  const { loading: authLoading, token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= PAGINATION ================= */
  const USERS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (authLoading || !token) return;

    api
      .get("/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Users API error:", err))
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  /* ================= RESET PAGE ON SEARCH ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= SEARCH FILTER ================= */
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /* ================= PAGINATED USERS ================= */
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  if (authLoading || loading) {
    return <p className="p-6">Loading users...</p>;
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Registered Users
        </h1>

        <input
          type="text"
          placeholder="Search by name, email, role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3">Sr No.</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Registered</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u, index) => (
              <tr
                key={u._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">
                  {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                </td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedUsers.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No users found.
          </p>
        )}
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u, index) => (
          <div
            key={u._id}
            className="bg-white rounded-xl shadow-md p-4 space-y-3 border-l-4 border-indigo-500"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Sr No.</span>
              <span>
                {(currentPage - 1) * USERS_PER_PAGE + index + 1}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Name</span>
              <span>{u.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Email</span>
              <span className="text-sm break-all">{u.email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Role</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  u.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {u.role}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Registered
              </span>
              <span>
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}

        {paginatedUsers.length === 0 && (
          <p className="text-center text-gray-500">
            No users found.
          </p>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>

          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
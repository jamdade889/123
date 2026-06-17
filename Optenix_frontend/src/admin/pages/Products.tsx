import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 5;

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data.products ?? res.data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  /* ---------------- PAGINATION LOGIC ---------------- */

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* PRODUCTS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentProducts.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img
              src={p.image}
              className="h-40 w-full object-contain mb-3"
              alt={p.name}
            />
            <h3 className="font-semibold">{p.name}</h3>
            <p>₹{p.price}</p>

            <button
              onClick={() => deleteProduct(p._id)}
              className="mt-3 text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
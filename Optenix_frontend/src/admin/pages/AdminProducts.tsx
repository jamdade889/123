import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Product, ProductForm } from "../../types/Product";

/* ---------------- EMPTY PRODUCT ---------------- */
const emptyProduct: ProductForm = {
  name: "",
  image: "",
  images: [],
  price: "",
  originalPrice: "",
  rating: "",
  discount: "",
  description: "",
  specifications: [{ key: "", value: "" }],
  category: "",
  subCategory: "",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // pagination
  const ITEMS_PER_PAGE = 5;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- LOAD PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data.products ?? res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- IMAGE → BASE64 ---------------- */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.[0]) return;
    const base64 = await fileToBase64(e.target.files[0]);
    setForm((prev) => ({ ...prev, image: base64 }));
  };

  const handleGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    const newImages = await Promise.all(
      Array.from(e.target.files).map(fileToBase64),
    );

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages], // ✅ append instead of replace
    }));

    // 🔥 reset input so same file can be selected again
    e.target.value = "";
  };

  // handle paste main image

  const handleMainImagePaste = async (
    e: React.ClipboardEvent<HTMLDivElement>,
  ) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (!file) continue;

        const base64 = await fileToBase64(file);

        setForm((prev) => ({
          ...prev,
          image: base64, // ✅ replace main image
        }));
      }
    }
  };

  // handle paste gallery image

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (!file) continue;

        const base64 = await fileToBase64(file);

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, base64],
        }));
      }
    }
  };

  /* ---------------- SPECIFICATIONS ---------------- */
  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const updated = [...form.specifications];
    updated[index][field] = value;
    setForm({ ...form, specifications: updated });
  };

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecification = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  /* ---------------- ADD / UPDATE PRODUCT ---------------- */
  const submitProduct = async () => {
    if (
      !form.name.trim() ||
      Number(form.price) <= 0 ||
      !form.image ||
      !form.category
    ) {
      toast.error("Name, Category, Price and Image are required");
      return;
    }
    setLoading(true);
    toast.loading(editingId ? "Updating product..." : "Adding product...", {
      id: "product",
    });

    try {
      if (editingId) {
        // 🔐 Admin protected route
        await api.put(`/api/products/${editingId}`, form);

        toast.success("Product updated successfully", { id: "product" });
      } else {
        // 🔐 Admin protected route
        const res = await api.post("/api/products", {
          // /products
          ...form,
          isActive: true,
          status: "published",
        });

        // ✅ Explicit success check
        if (res.data?.success) {
          toast.success("Product added successfully", { id: "product" });
        } else {
          throw new Error("API did not return success");
        }
      }

      resetForm();
      fetchProducts();
    } catch (err: any) {
      console.error("SUBMIT PRODUCT ERROR:", err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Operation failed", {
        id: "product",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE PRODUCT ---------------- */
  const deleteProduct = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">
            Are you sure you want to delete this product?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded bg-gray-200 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                toast.loading("Deleting product...", { id: "delete" });

                try {
                  await api.delete(`/api/products/${id}`);
                  setProducts((prev) => prev.filter((p) => p._id !== id));
                  toast.success("Product deleted successfully", {
                    id: "delete",
                  });
                } catch (err: any) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete product",
                    { id: "delete" },
                  );
                }
              }}
              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
      },
    );
  };

  /* ---------------- EDIT ---------------- */
  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
  name: product.name,
  image: product.image,
  images: product.images ?? [],

  price: product.price,
  originalPrice: product.originalPrice ?? 0,

  rating: product.rating ?? 3.5,
  discount: product.discount ?? "",

  description: product.description,

  specifications:
    product.specifications?.length > 0
      ? product.specifications
      : [{ key: "", value: "" }],

  category: product.category ?? "",
  subCategory: product.subCategory ?? "",
  featured: product.featured ?? false,
});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search),
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin · Product Management
        </h1>
        <p className="text-gray-500 mt-1">
          Add and manage products shown in the shop. Orders are placed by users
          from the storefront.
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            placeholder="Selling Price"
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={(e) =>
              setForm({
                ...form,
                originalPrice:
                  e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            placeholder="Original Price"
            className="border p-2 rounded"
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Interactive Displays">Interactive Displays</option>
            <option value="Cameras">Cameras</option>
            <option value="Audio Solutions">Audio Solutions</option>
            <option value="Lighting">Lighting</option>
            <option value="Digital Signage">Digital Signage</option>
            <option value="Accessories">Accessories</option>
            <option value="Education Solutions">Education Solutions</option>
            <option value="Enterprise Solutions">Enterprise Solutions</option>
          </select>

          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            name="rating"
            value={form.rating}
            onChange={(e) =>
              setForm({
                ...form,
                rating: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            placeholder="Rating (1–5)"
            className="border p-2 rounded"
          />

          <input
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount (e.g. 20%)"
            className="border p-2 rounded"
          />

          {/* MAIN IMAGE */}
          <div
            className="md:col-span-2"
            onPaste={handleMainImagePaste}
            tabIndex={0}
          >
            <label className="block font-medium mb-2">Main Image *</label>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Upload Main Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleMainImageChange}
                />
              </label>

              {form.image && (
                <img
                  src={form.image}
                  alt="Main Preview"
                  className="h-24 w-24 object-cover rounded-lg border shadow"
                />
              )}
            </div>
          </div>

          {/* GALLERY IMAGES */}
          <div className="md:col-span-2" onPaste={handlePaste} tabIndex={0}>
            <label className="block font-medium mb-2">Gallery Images</label>

            <label className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition inline-block">
              Upload Multiple Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleGalleryChange}
              />
            </label>

            <p className="text-sm text-gray-500 mt-2">
              You can upload multiple images or press Ctrl + V to paste.
            </p>

            {form.images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {form.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      className="h-20 w-20 object-cover rounded-lg border shadow"
                    />
                    <button
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="block font-medium mb-2">Product Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="border p-2 rounded md:col-span-2"
          />

          {/* SPECIFICATIONS */}
          <div>
            <label className="block font-medium mb-2">Specifications</label>

            {form.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  placeholder="Property (e.g. Brand)"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecChange(index, "key", e.target.value)
                  }
                  className="border p-2 rounded w-1/2"
                />
                <input
                  placeholder="Value (e.g. Optenix)"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, "value", e.target.value)
                  }
                  className="border p-2 rounded w-1/2"
                />
                <button
                  onClick={() => removeSpecification(index)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={addSpecification}
              className="bg-indigo-600 text-white px-4 py-2 rounded mt-2"
            >
              + Add Specification
            </button>
          </div>

          <button
            disabled={loading}
            onClick={submitProduct}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded md:col-span-2"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Products</h2>

        <input
          type="text"
          placeholder="Search by name or price..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="w-full md:w-72 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* PRODUCTS LIST */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full hidden md:table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  <img
                    src={p.image}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 font-semibold">₹{p.price}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedProducts.map((p) => (
            <div key={p._id} className="border rounded-lg p-4 flex gap-4">
              <img src={p.image} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹{p.price}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            Previous
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
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

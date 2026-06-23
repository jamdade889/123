import { useEffect, useMemo, useState, useRef } from "react";
import { Star, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProducts } from "../services/productApi";
import { Product } from "../types/Product";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function Shop() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
const [category, setCategory] = useState("All");
const [categories, setCategories] = useState<any[]>([]);
const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
  axios
    .get("http://localhost:5000/api/categories")
    .then((res) => {
      setCategories(res.data);
    })
    .catch(console.error);
}, []);

useEffect(() => {
  const categoryFromUrl = searchParams.get("category");

  if (categoryFromUrl) {
    setCategory(categoryFromUrl);
  }
}, [searchParams]);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredProducts = useMemo(() => {
  return products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(
        query.toLowerCase().trim()
      ) ?? false;

    const matchesMin =
      !minPrice || Number(p.price) >= Number(minPrice);

    const matchesMax =
      !maxPrice || Number(p.price) <= Number(maxPrice);

    const matchesRating =
      ratingFilter === 0 ||
      Number(p.rating) >= ratingFilter;

    const matchesCategory =
      category === "All" ||
      p.category?.toLowerCase() ===
        category.toLowerCase();

    return (
      matchesSearch &&
      matchesMin &&
      matchesMax &&
      matchesRating &&
      matchesCategory
    );
  });
}, [
  products,
  query,
  minPrice,
  maxPrice,
  ratingFilter,
  category,
]);

  /* ---------------- SLIDER ---------------- */
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  /* ---------------- FILTER UI ---------------- */
  const FilterContent = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Filters</h2>
      {/* Price */}
      <div>
        <label className="font-medium">Price Range</label>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 border p-2 rounded"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 border p-2 rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="font-medium">Minimum Rating</label>
        <select
          className="w-full mt-2 border p-2 rounded"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
        >
          <option value={0}>All</option>
          <option value={4}>4★ & above</option>
          <option value={3}>3★ & above</option>
          <option value={2}>2★ & above</option>
        </select>
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        {/* Title */} <motion.div className="text-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20"
         initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} > 
         <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"> Optenix{" "} <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> World </span>
          </h1> <p className="text-black text-xl max-w-2xl mx-auto"> Explore our smart hardware and digital solutions designed for education and enterprises. </p> </motion.div>

        {/* MOBILE FILTER BUTTON */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* DESKTOP FILTER */}
          <div className="hidden md:block bg-white rounded-xl shadow p-4">

  <h3 className="font-bold text-lg mb-4">
    Categories
  </h3>

  <button
    onClick={() => setCategory("All")}
    className={`w-full text-left p-3 mb-2 rounded ${
      category === "All"
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-50"
    }`}
  >
    All
  </button>

  {categories.map((cat) => (
    <button
      key={cat._id}
      onClick={() => setCategory(cat.name)}
      className={`w-full text-left p-3 mb-2 rounded ${
        category === cat.name
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-50"
      }`}
    >
      {cat.name}
    </button>
  ))}

  <hr className="my-4" />

  <FilterContent />

</div>
          {/* PRODUCTS */}
          <div className="md:col-span-3">

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded border"
              />
            </div>

            {/* Products Grid */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() =>
                      navigate(`/products/${product._id}`)
                    }
                  >
                    <img
                      src={product.image}
                      className="h-44 sm:h-36 mx-auto object-contain"
                    />

                    <h3 className="mt-3 font-semibold text-sm">
                      {product.name}
                    </h3>

                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < product.rating
                              ? "fill-blue-500 text-blue-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-2 font-bold text-blue-700">
                      ₹{product.price}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Suggested Slider */}
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-4">
                Suggested Products
              </h2>

              <div className="relative">
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
                >
                  <ChevronLeft />
                </button>

                <div
                  ref={sliderRef}
                  className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
                >
                  {products.slice(0, 8).map((p) => (
                    <div
                      key={p._id}
                      className="min-w-[160px] bg-white p-4 rounded shadow"
                    >
                      <img
                        src={p.image}
                        className="h-20 mx-auto object-contain"
                      />
                      <p className="text-sm mt-2">{p.name}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* MOBILE DRAWER */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
            <div className="bg-white w-3/4 p-6">
              <FilterContent />
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
            <div
              className="flex-1"
              onClick={() => setIsDrawerOpen(false)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
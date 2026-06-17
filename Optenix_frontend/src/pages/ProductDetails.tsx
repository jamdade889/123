import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Star, Search, Minus, Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getProducts, getProductById } from "../services/productApi";
import { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartPopup from "../others/CartPopup";
import toast from "react-hot-toast";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedImageFromShop = location.state?.selectedImage;

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  /* ---------- LOAD PRODUCT ---------- */
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setQty(1); // reset qty when product changes

    getProductById(id)
      .then((data) => {
        if (!data) {
          toast.error("Product not found");
          setProduct(null);
          return;
        }

        setProduct(data);

        // Priority:
// 1️⃣ Image selected from Shop
// 2️⃣ Main image
// 3️⃣ First gallery image

if (selectedImageFromShop) {
  setActiveImage(selectedImageFromShop);
} else if (data.image) {
  setActiveImage(data.image);
} else if (data.images?.length) {
  setActiveImage(data.images[0]);
} else {
  setActiveImage("");
}
      })
      .catch(() => {
        toast.error("Failed to load product");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id,selectedImageFromShop]);

  /* ---------- LOAD ALL PRODUCTS ---------- */
  useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .catch(() => toast.error("Failed to load suggestions"));
  }, []);

  /* ---------- SEARCH DEBOUNCE ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  /* ---------- FILTER LOGIC ---------- */
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return [];
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(debouncedQuery)
    );
  }, [debouncedQuery, allProducts]);

      // ✅ Create safe image list
const imageList = useMemo(() => {
  const images = [];

  if (product?.image) images.push(product.image);
  if (product?.images?.length) {
    images.push(...product.images);
  }

  // remove duplicates + empty values
  return [...new Set(images.filter(Boolean))];
}, [product]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xl text-gray-500">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-2xl text-red-600">
        Product not found
      </div>
    );
  }

  /* ---------- PRICE CALCULATION ---------- */
  const basePrice = product.price * qty;
  const gst = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gst;

  const rating =
    typeof product.rating === "number"
      ? product.rating
      : Number(product.rating) || 0;

  /* ---------- CART ---------- */
  const handleAddToCart = () => {
    const item: CartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: activeImage || product.image,
      quantity: qty,
    };

    addToCart(item);
    setLastAddedItem(item);
    setShowPopup(true);
    toast.success(`${product.name} added to cart`);

    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast("Login required to place order", { icon: "⚠️" });
      navigate("/register", { state: { from: location.pathname } });
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: activeImage || product.image,
      quantity: qty,
    });

    toast.success("Proceeding to checkout");
    navigate("/place-order");
  };

  const suggestions = allProducts
    .filter((p) => p._id !== product._id)
    .slice(0, 6);



  return (
    <section className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* SEARCH RESULTS */}
        {debouncedQuery && filteredProducts.length > 0 && (
          <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/products/${p._id}`)}
                className="border rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-28 mx-auto object-contain"
                />
                <h3 className="text-sm font-semibold mt-2">{p.name}</h3>
                <div className="font-bold text-blue-900">₹{p.price}</div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT DETAILS */}
        <div className="grid lg:grid-cols-2 gap-14 bg-white p-8 rounded-xl shadow-lg">
          
          {/* IMAGES */}
          <div>
            <div className="border rounded-xl p-6 bg-gray-100 mb-4 flex items-center justify-center">
             <img
  src={activeImage || imageList[0]}
  alt={product.name}
  className="max-h-[420px] mx-auto object-contain"
/>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
  {imageList.map((img, i) => (
    <img
      key={i}
      src={img}
      alt={`Thumbnail ${i + 1}`}
      onClick={() => setActiveImage(img)}
      className={`w-20 h-20 border rounded cursor-pointer object-contain transition ${
        activeImage === img
          ? "ring-2 ring-blue-500"
          : "hover:ring-2 hover:ring-gray-300"
      }`}
    />
  ))}
</div>
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold mb-3">{product.name}</h1>

            {/* RATING */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(rating)
                      ? "fill-blue-500 text-blue-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-blue-600">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* PRICE */}
            <div className="border rounded-xl p-4 bg-gray-50 mb-6 space-y-2">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>₹{basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="border p-2 rounded hover:bg-gray-100 transition"
              >
                <Minus />
              </button>
              <span className="px-6 py-2 border rounded font-semibold">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="border p-2 rounded hover:bg-gray-100 transition"
              >
                <Plus />
              </button>
            </div>

            {/* DESCRIPTION */}
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="mb-6 text-gray-700">{product.description}</p>

            {/* SPECIFICATIONS */}
{product.specifications?.length > 0 && (
  <>
    <h3 className="text-xl font-semibold mb-3">Specifications</h3>

    <div className="space-y-2 mb-4">
      {(showAllSpecs
        ? product.specifications
        : product.specifications.slice(0, 6)
      ).map((spec, i) => (
        <div
          key={i}
          className="flex justify-between border-b pb-2 text-sm"
        >
          <span className="font-medium text-gray-700">
            {spec.key}
          </span>
          <span className="text-gray-600">
            {spec.value}
          </span>
        </div>
      ))}
    </div>

    {product.specifications.length > 6 && (
      <button
        onClick={() => setShowAllSpecs((v) => !v)}
        className="text-blue-600 hover:underline mb-6"
      >
        {showAllSpecs ? "Show Less" : "Show More"}
      </button>
    )}
  </>
)}
            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded flex-1 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded flex-1 transition"
              >
                Buy Now
              </button>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="text-blue-600 font-medium hover:underline"
            >
              ← Back to Shop
            </button>
          </div>
        </div>

        {/* SUGGESTIONS */}
        <h2 className="text-2xl font-semibold mt-16 mb-6">
          You might also like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {suggestions.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/products/${p._id}`)}
              className="border rounded-xl p-4 cursor-pointer hover:shadow transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-28 mx-auto object-contain"
              />
              <h3 className="text-sm font-medium text-center">
                {p.name}
              </h3>
              <div className="text-blue-900 font-bold text-center">
                ₹{p.price}
              </div>
            </div>
          ))}
        </div>

        {/* CART POPUP */}
        {showPopup && lastAddedItem && (
          <CartPopup
            item={lastAddedItem}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </section>
  );
}
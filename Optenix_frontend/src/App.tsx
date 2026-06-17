import { Routes, Route, useLocation } from "react-router-dom";
import "aos/dist/aos.css";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Services from "./pages/Services";
import CartPage from "./pages/CartPage";
import PlaceOrder from "./pages/PlaceOrder";
import ConfirmPayment from "./pages/ConfirmPayment";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";

/* Admin Layout + Pages */
import AdminLayout from "./admin/layout/AdminLayout";
import Users from "./admin/pages/Users";
import Products from "./admin/pages/Products";
import AdminProducts from "./admin/pages/AdminProducts";
import Payments from "./admin/pages/Payments";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
/* Auth */
import Login from "./authenticate/Login";
import Register from "./authenticate/Register";
import Profile from "./authenticate/Profile";

/* Routes */
import ProtectedRoute from "./routes/ProtectedRoutes";
import AdminRoute from "./routes/AdminRoute";

/* Utils */
import ScrollToTop from "./others/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AdminTestimonials from "./admin/pages/AdminTestimonials";

function App() {
  const location = useLocation();

  /* Hide header/footer on payment pages */
  const hideLayout =
    location.pathname === "/payment" ||
    location.pathname === "/success";

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />

      {!hideLayout && <Header />}

      <WhatsAppFloat/>

      <main className="flex-grow">
        <Routes>

          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/career" element={<Career />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
<Route
  path="/admin/change-password"
  element={<ChangePassword />}
/>
          {/* ---------- Authentication ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ---------- Orders ---------- */}
          <Route
            path="/place-order"
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/confirm-order"
            element={
              <ProtectedRoute>
                <ConfirmPayment />
              </ProtectedRoute>
            }
          />

          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          

          {/* ---------- Admin (Route-Based + Nested) ---------- */}
          <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<Users />} />
  <Route path="products" element={<Products />} />
  <Route path="admin-products" element={<AdminProducts />} />
  <Route path="payments" element={<Payments />} />
  <Route path = "testimonials" element={<AdminTestimonials/>}/>
</Route>

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
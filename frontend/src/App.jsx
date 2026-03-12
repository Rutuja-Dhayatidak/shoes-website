import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import VendorRequests from "./pages/admin/VendorRequests";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import VendorOrderDetails from "./pages/vendor/VendorOrderDetails";
import VendorMyProducts from "./pages/vendor/VendorMyProducts";
import AddProduct from "./pages/vendor/AddProduct";
import Shop from "./pages/Shop";
import ShoeDetail from "./pages/ShoeDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";



// Home Page Component to keep App.jsx clean
const Home = () => (
  <div className="relative">
    <Navbar />
    <Hero />
    <Footer />
  </div>
);

function App() {
  return (
    <>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/vendor-requests" element={<VendorRequests />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/order/:orderId" element={<VendorOrderDetails />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/vendor/products" element={<VendorMyProducts />} />
        <Route path="/vendor/add-product" element={<AddProduct />} />
        <Route path="/shoe/:id" element={<ShoeDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />

      </Routes>
    </>
  )
}

export default App

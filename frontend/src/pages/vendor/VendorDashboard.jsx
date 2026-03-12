import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Home, Package, PlusCircle,
    ShoppingBag, Clock
} from "lucide-react";
import { toast } from "react-toastify";
import VendorMyProducts from "./VendorMyProducts";
import AddProduct from "./AddProduct";
import VendorOrders from "./VendorOrders";
import { getVendorDashboard, getVendorDashboardStats } from "../../api/vendorApi";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const VendorDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);

        const fetchDashboardData = async () => {
            try {
                const [dashData, statData] = await Promise.all([
                    getVendorDashboard(),
                    getVendorDashboardStats()
                ]);
                setStats({
                    totalProducts: dashData.totalProducts,
                    totalOrders: statData.data.totalOrders,
                    pendingOrders: statData.data.pendingOrders,
                    totalRevenue: statData.data.totalRevenue
                });
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            }
        };
        fetchDashboardData();

        return () => clearTimeout(timer);
    }, []);

    const menuItems = [
        { id: "dashboard", label: "Overview", icon: <Home size={20} /> },
        { id: "products", label: "My Products", icon: <Package size={20} /> },
        { id: "add-product", label: "Add Product", icon: <PlusCircle size={20} /> },
        { id: "orders", label: "Orders", icon: <ShoppingBag size={20} />, badge: stats.pendingOrders > 0 ? stats.pendingOrders : null },
    ];

    if (!user || user.role !== "vendor") {
        navigate("/login");
        return null;
    }

    return (
        <DashboardLayout
            user={user}
            title="Vendor Panel"
            subtitle="Shop Management"
            menuItems={menuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === "dashboard" ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Quick Stat Cards */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all">
                                <Package className="text-cyan-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Products</p>
                            <h3 className="text-3xl font-black text-white">{stats.totalProducts}</h3>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                                <ShoppingBag className="text-blue-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Orders Received</p>
                            <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-all">
                                <Clock className="text-orange-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Pending Orders</p>
                            <h3 className="text-3xl font-black text-white">{stats.pendingOrders}</h3>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-all">
                                <span className="text-emerald-400 font-black text-xl">₹</span>
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-black text-white">₹{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl border border-white/5 p-10 md:p-16 rounded-[48px] text-center flex flex-col items-center justify-center group hover:border-white/10 transition-all">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-4xl">👋</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 uppercase">Welcome Back, {user.name}</h2>
                        <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">Your store performance is looking great today. Check your recent orders or update your inventory below.</p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => setActiveTab("add-product")}
                                className="px-8 py-4 bg-white text-[#0a0f1a] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-xl shadow-white/5"
                            >
                                List New Product
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
            ) : activeTab === "products" ? (
                <VendorMyProducts />
            ) : activeTab === "add-product" ? (
                <AddProduct setActiveTab={setActiveTab} />
            ) : activeTab === "orders" ? (
                <VendorOrders />
            ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-20 rounded-[40px] text-center">
                    <p className="text-gray-500 tracking-widest uppercase text-sm font-black italic">Content Area Under Construction</p>
                </div>
            )}
        </DashboardLayout>
    );
};
export default VendorDashboard;

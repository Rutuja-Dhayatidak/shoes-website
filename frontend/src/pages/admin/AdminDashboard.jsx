import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, Users, Package, ClipboardList, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import VendorRequests from "./VendorRequests";
import UsersView from "./Users";
import AdminProducts from "./AdminProducts";
import { getAdminStats } from "../../api/adminApi";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (error) {
            console.log(error);
        }
    };

    const menuItems = [
        { id: "dashboard", label: "Analytics", icon: <Home size={20} /> },
        { id: "users", label: "User Management", icon: <Users size={20} /> },
        { id: "products", label: "Inventory", icon: <Package size={20} /> },
        { id: "vendor-requests", label: "Vendors", icon: <ClipboardList size={20} />, badge: "New" },
    ];

    if (!user || user.role !== "admin") {
        navigate("/login");
        return null;
    }

    return (
        <DashboardLayout
            user={user}
            title="Admin Control"
            subtitle="System Overview"
            menuItems={menuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === "dashboard" ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Quick Stat Cards */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                                <Users className="text-blue-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Users</p>
                            <h3 className="text-3xl font-black text-white">{stats ? stats.totalUsers : "..."}</h3>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-all">
                                <Package className="text-purple-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Products</p>
                            <h3 className="text-3xl font-black text-white">{stats ? stats.totalShoes : "..."}</h3>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => setActiveTab('vendor-requests')}>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-all">
                                <ClipboardList className="text-indigo-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Pending Requests</p>
                            <h3 className="text-3xl font-black text-indigo-300">New</h3>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all">
                                <Home className="text-cyan-400" size={24} />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Vendors</p>
                            <h3 className="text-3xl font-black text-white">{stats ? stats.totalVendors : "..."}</h3>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl border border-white/5 p-12 rounded-[48px] h-80 flex flex-col items-center justify-center text-center group">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldAlert className="text-blue-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Intelligence Overview</h2>
                        <p className="text-gray-500 mt-4 max-w-sm font-medium">Detailed analytical charts and system logs will appear here in the next update.</p>
                    </div>
                </div>
            ) : activeTab === "users" ? (
                <UsersView />
            ) : activeTab === "vendor-requests" ? (
                <VendorRequests />
            ) : activeTab === "products" ? (
                <AdminProducts />
            ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-20 rounded-[40px] text-center italic text-gray-500 font-black uppercase tracking-widest">
                    Section Under Maintenance
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;

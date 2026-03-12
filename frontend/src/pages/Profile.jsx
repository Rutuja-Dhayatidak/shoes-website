import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestVendor } from "../api/vendorApi";
import { LogOut, User, Mail, Shield, Store, ArrowRight, Zap, Crown } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleVendorRequest = async () => {
        try {
            await requestVendor();
            toast.success("Vendor request sent successfully ✅", { position: "top-right", autoClose: 1000 });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong sending the request", { position: "top-right", autoClose: 1000 });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully 👋", { position: "top-right", autoClose: 1000 });
        navigate("/login");
    };

    // Get initials for avatar
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    if (!user) {
        return (
            <div className="relative min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center overflow-hidden">
                <Navbar />
                {/* Background glowing elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className={`w-full max-w-sm mx-auto z-10 px-4 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center group hover:border-white/20 transition-all duration-500">
                        <h3 className="text-xl font-semibold text-white mb-2 uppercase tracking-wider group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Access Denied</h3>
                        <p className="text-gray-400 text-sm mb-6">Please login to view your profile</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#0a0f1a] flex flex-col justify-center overflow-hidden pt-20 perspective-1000">
            <Navbar />

            {/* Background glowing elements - Now animated */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite_1s]"></div>

            {/* Floating particles background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/20 filter blur-[2px]"
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                        }}
                    />
                ))}
            </div>

            <div className={`w-full max-w-lg mx-auto z-10 my-auto px-4 relative mt-16 mb-16 transform transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${isLoaded ? 'translate-y-0 opacity-100 rotate-x-0' : 'translate-y-24 opacity-0 rotate-x-12'}`}>

                {/* Header Container */}
                <div className={`text-center mb-10 relative z-50 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="w-24 h-24 mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500 group cursor-default">
                        <span className="text-3xl font-extrabold text-white tracking-widest uppercase group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">
                            {getInitials(user.name)}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{user.name}</h2>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">{user.role} Account</p>
                </div>

                {/* Profile Details Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative group hover:border-white/20 transition-all duration-500 overflow-hidden">

                    {/* Subtle moving gradient sweep effect inside card */}
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

                    <h3 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4 text-center relative z-10">Profile Information</h3>

                    <div className="space-y-6 relative z-10">

                        {/* Full Name */}
                        <div className={`transition-all duration-700 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Full Name
                            </label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center hover:bg-white/10 transition-colors duration-300 transform hover:translate-x-1">
                                <User size={18} className="text-gray-400 mr-3" />
                                <span className="text-white text-sm font-medium">{user.name}</span>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className={`transition-all duration-700 delay-600 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center hover:bg-white/10 transition-colors duration-300 transform hover:translate-x-1">
                                <Mail size={18} className="text-gray-400 mr-3" />
                                <span className="text-white text-sm font-medium truncate">{user.email}</span>
                            </div>
                        </div>

                        {/* Access Level */}
                        <div className={`transition-all duration-700 delay-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Access Level
                            </label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center hover:bg-white/10 transition-colors duration-300 transform hover:translate-x-1">
                                <Shield size={18} className="text-gray-400 mr-3" />
                                <span className="text-white text-sm font-medium capitalize">{user.role}</span>
                            </div>
                        </div>

                        <div className={`pt-6 mt-6 border-t border-white/10 space-y-4 transition-all duration-700 delay-[800ms] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {/* Become Vendor Button */}
                            {user.role === "user" && (
                                <button
                                    onClick={handleVendorRequest}
                                    className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-all duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                                >
                                    <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                                    <Zap size={18} className="relative z-10 group-hover:text-yellow-500 transition-colors" />
                                    <span className="relative z-10">Become a Vendor</span>
                                </button>
                            )}

                            {/* Vendor Dashboard Button */}
                            {user.role === "vendor" && (
                                <button
                                    onClick={() => navigate("/vendor/dashboard")}
                                    className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-all duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                                >
                                    <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                                    <Store size={18} className="relative z-10" />
                                    <span className="relative z-10">Vendor Dashboard</span>
                                    <ArrowRight size={18} className="relative z-10 absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                            )}

                            {/* Admin Dashboard Button */}
                            {user.role === "admin" && (
                                <button
                                    onClick={() => navigate("/admin")}
                                    className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-all duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                                >
                                    <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                                    <Crown size={18} className="relative z-10" />
                                    <span className="relative z-10">Admin Dashboard</span>
                                    <ArrowRight size={18} className="relative z-10 absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                            )}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-400/5 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Logout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

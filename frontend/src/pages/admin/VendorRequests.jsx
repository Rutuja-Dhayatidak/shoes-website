import React, { useEffect, useState } from "react";
import { getVendorRequests, approveVendor } from "../../api/vendorApi";
import { toast } from "react-toastify";
import { Check, User, Mail, AlertCircle, Clock } from "lucide-react";

const VendorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getVendorRequests();
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load requests", { position: "top-right", autoClose: 2000 });
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveVendor(id);
            toast.success("Vendor Approved ✅", { position: "top-right", autoClose: 1500 });
            fetchRequests(); // refresh list
        } catch (error) {
            toast.error("Error approving vendor", { position: "top-right", autoClose: 2000 });
        }
    };

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400 font-semibold tracking-widest uppercase text-sm animate-pulse">Loading Requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Vendor Requests</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium italic">Pending ecosystem access requests.</p>
                </div>
                <div className="w-fit bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-2xl border border-indigo-500/20 flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                    <Clock size={16} />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{requests.length} Pending</span>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-16 sm:p-24 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-2">
                        <AlertCircle size={40} strokeWidth={1.5} />
                    </div>
                    <div className="max-w-xs">
                        <h3 className="text-xl font-black text-white tracking-widest uppercase">Cleared</h3>
                        <p className="text-gray-500 text-sm mt-2 font-medium">No pending vendor applications in the system right now.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {requests.map((user, index) => (
                        <div
                            key={user._id}
                            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 hover:border-white/20 transition-all duration-500 group hover:-translate-y-2 flex flex-col h-full relative overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center space-x-5 mb-8 pb-8 border-b border-white/5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(99,102,241,0.4)] group-hover:rotate-6 transition-transform">
                                        <span className="text-xl font-black text-white tracking-widest uppercase">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-lg truncate tracking-tight">{user.name}</h4>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                            <span className="text-[9px] font-black text-yellow-500/80 uppercase tracking-widest">Awaiting Verification</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 mb-10">
                                    <div className="flex items-center text-gray-400 group/item">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover/item:bg-white/10 transition-colors">
                                            <User size={14} className="text-indigo-400" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 tracking-wide uppercase text-[10px]">{user.name}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 group/item">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover/item:bg-white/10 transition-colors">
                                            <Mail size={14} className="text-purple-400" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 truncate lowercase text-[10px] tracking-widest font-mono">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleApprove(user._id)}
                                className="relative z-10 w-full bg-green-500 text-[#0a0f1a] rounded-2xl font-black uppercase text-[10px] tracking-[0.25em] py-4 flex items-center justify-center gap-2 hover:brightness-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all active:scale-[0.97]"
                            >
                                <Check size={16} strokeWidth={4} />
                                Grant Access
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorRequests;

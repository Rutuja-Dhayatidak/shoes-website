import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUserByAdmin } from "../../api/adminApi";
import { toast } from "react-toastify";
import { User, Mail, Shield, AlertCircle, Users as UsersIcon, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const limit = 6;

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers(page, limit);

            // Handle both array and paginated object structures gracefully
            const usersList = Array.isArray(data) ? data : (data.users || []);
            setUsers(usersList);

            if (data.totalPages) setTotalPages(data.totalPages);
            if (data.users && !Array.isArray(data) && data.users.length > 0) {
                // We don't have total count directly from backend unless they returned it.
                // The backend uses totalPages. But let's assume we can approximate or if they passed it let's store it
            }
            // For total users display count, we might not have it exactly if using pagination.
            // Let's just use the length of the current list if we don't have total count, or if not paginated.
            setTotalUsersCount(Array.isArray(data) ? data.length : "...");

            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users", { position: "top-right", autoClose: 2000 });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Use SweetAlert2 for a styled confirmation dialog
        const result = await Swal.fire({
            title: "Delete User?",
            text: "You won't be able to revert this! This action is permanent.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", // red-500
            cancelButtonColor: "#3b82f6", // blue-500
            confirmButtonText: "Yes, delete it!",
            background: "#111827", // dark background matching theme
            color: "#fff",
            customClass: {
                popup: 'rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]',
                confirmButton: 'rounded-xl tracking-wider font-bold',
                cancelButton: 'rounded-xl tracking-wider font-bold'
            }
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUserByAdmin(id);
            toast.success("User deleted successfully 🗑️", { position: "top-right", autoClose: 1500 });

            // Check if we need to go back a page after deleting the last item on current page
            if (users.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchUsers(); // refresh list
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error deleting user", { position: "top-right", autoClose: 2000 });
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
                    <p className="text-gray-400 font-semibold tracking-widest uppercase text-sm animate-pulse">Loading Users...</p>
                </div>
            </div>
        );
    }

    const getRoleBadgeColor = (role) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-red-500/20 text-red-400 border-red-500/30";
            case "vendor":
                return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
            default:
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        }
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">All Users</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and view all registered users in the platform.</p>
                </div>
                <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <UsersIcon size={16} />
                    <span className="text-sm font-bold">Manage Roles</span>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-2">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-wider">No Users Found</h3>
                    <p className="text-gray-400">There are currently no users registered in the system.</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    {/* Header Row */}
                    <div className="hidden md:flex items-center px-6 py-3 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-1/3">User Profile</div>
                        <div className="w-1/3">Email Address</div>
                        <div className="w-1/4">Role Level</div>
                        <div className="flex-1 text-right">Actions</div>
                    </div>

                    {/* User Rows */}
                    {users.map((user, index) => (
                        <div
                            key={user._id}
                            className="flex flex-col md:flex-row md:items-center bg-transparent hover:bg-white/5 border-b border-white/5 rounded-xl px-4 md:px-6 py-4 transition-colors duration-300 group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Profile Info */}
                            <div className="flex items-center space-x-4 w-full md:w-1/3 mb-4 md:mb-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                    <span className="text-sm font-bold text-white tracking-widest uppercase">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-white font-bold text-sm truncate">{user.name}</h4>
                                    <div className="mt-1">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider inline-block ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Email Info */}
                            <div className="flex items-center text-gray-400 w-full md:w-1/3 mb-3 md:mb-0">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
                                    <Mail size={14} className="text-indigo-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-300 truncate">{user.email}</p>
                            </div>

                            {/* Role Info */}
                            <div className="flex items-center text-gray-400 w-full md:w-1/4 mb-4 md:mb-0">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
                                    <Shield size={14} className="text-purple-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-300 capitalize">{user.role}</p>
                            </div>


                            {/* View Action Placeholder */}
                            <div className="flex-1 flex justify-end">
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white px-3 py-2 border border-red-500/30 hover:bg-red-500 hover:border-red-500 rounded-lg flex items-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                    title="Delete User"
                                >
                                    <Trash2 size={16} />
                                    <span className="hidden sm:inline">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest hidden sm:block">
                                Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                            </p>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Prev</span>
                                </button>

                                <div className="flex items-center space-x-1 px-2">
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const pageNum = idx + 1;
                                        // Simple logic to show current, next, prev, first, last
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= page - 1 && pageNum <= page + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${page === pageNum
                                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                                        : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === page - 2 ||
                                            pageNum === page + 2
                                        ) {
                                            return <span key={pageNum} className="text-gray-600 text-xs">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider">Next</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Users;

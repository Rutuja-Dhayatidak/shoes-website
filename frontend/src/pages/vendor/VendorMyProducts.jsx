import React, { useEffect, useState } from "react";
import { getMyProducts, deleteProduct, updateStock } from "../../api/vendorApi";
import { Package, AlertCircle, Tag, PlusCircle, Activity, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { IMAGE_BASE_URL } from "../../api/axiosInstance";

const VendorMyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getMyProducts(page, limit);
            const toUrl = (path) => path && (path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`);
            // Ensure images are prefixed if needed
            const processedProducts = (data.products || []).map(p => ({
                ...p,
                displayImage: toUrl(p.image)
            }));
            setProducts(processedProducts);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Product?",
            text: "This action cannot be undone!",
            icon: "warning",
            iconColor: "#ef4444",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            background: "rgba(10, 15, 26, 0.95)",
            color: "#fff",
            customClass: {
                popup: 'bg-[#0a0f1a] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-3xl p-6',
                title: 'text-2xl font-bold tracking-wider text-white',
                htmlContainer: 'text-gray-400 text-sm tracking-wide mt-2',
                confirmButton: 'bg-red-500/10 rounded-xl tracking-widest uppercase text-xs font-bold border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all px-8 py-3 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] ml-2',
                cancelButton: 'bg-white/5 rounded-xl tracking-widest uppercase text-xs font-bold border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all px-8 py-3 mr-2'
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully 🗑️", { position: "top-right", autoClose: 1500 });
                // If deleting last item on page (and not page 1), go back a page
                if (products.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchProducts();
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete product", { position: "top-right" });
            }
        }
    };

    const handleUpdateStock = async (product) => {
        const htmlContent = `
            <div class="flex flex-col gap-4 mt-4 text-left">
                ${product.sizes.map(s => `
                    <div class="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <span class="text-white font-bold tracking-wider uppercase text-xs">Size: ${s.size}</span>
                        <input type="number" id="swal-input-${s.size}" class="bg-[#0a0f1a] border border-white/20 text-white rounded-lg px-3 py-2 w-24 text-center focus:border-cyan-500 focus:outline-none transition-colors" value="${s.stock}" min="0" />
                    </div>
                `).join('')}
            </div>
        `;

        const result = await Swal.fire({
            title: 'Update Stock',
            html: htmlContent,
            background: "rgba(10, 15, 26, 0.95)",
            color: "#fff",
            showCancelButton: true,
            confirmButtonColor: "rgba(6, 182, 212, 0.2)",
            cancelButtonColor: "rgba(255, 255, 255, 0.1)",
            confirmButtonText: "Save Changes",
            customClass: {
                popup: 'rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-3xl',
                title: 'text-2xl font-bold tracking-wider text-cyan-400',
                confirmButton: 'rounded-xl tracking-widest uppercase text-xs font-bold border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all px-6 py-3',
                cancelButton: 'rounded-xl tracking-widest uppercase text-xs font-bold border border-white/20 text-white hover:bg-white/20 transition-all px-6 py-3'
            },
            preConfirm: () => {
                return product.sizes.map(s => {
                    const inputElement = document.getElementById(`swal-input-${s.size}`);
                    return {
                        ...s,
                        stock: Number(inputElement.value)
                    };
                });
            }
        });

        if (result.isConfirmed && result.value) {
            try {
                await updateStock(product._id, result.value);
                toast.success("Stock updated successfully 📦", { position: "top-right", autoClose: 1500 });
                fetchProducts();
            } catch (error) {
                console.error(error);
                toast.error("Failed to update stock", { position: "top-right" });
            }
        }
    };

    if (loading && page === 1) { // Only show full loading spinner on initial load to avoid jumping
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400 font-semibold tracking-widest uppercase text-sm animate-pulse">Loading Inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">My Products</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and view your listed products.</p>
                </div>
                <button className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-500/30 flex items-center gap-2 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                    <PlusCircle size={16} />
                    <span className="text-sm font-bold uppercase tracking-wider">Add New</span>
                </button>
            </div>

            {/* Empty State vs List */}
            {products.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-2">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-wider">No Products Found</h3>
                    <p className="text-gray-400 mb-4">You haven't added any products to your store yet.</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    {/* Header Row */}
                    <div className="hidden md:flex items-center px-6 py-3 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-[30%]">Product Name</div>
                        <div className="w-[15%]">Brand</div>
                        <div className="w-[15%]">Total Stock</div>
                        <div className="w-[20%] text-center">Status</div>
                        <div className="flex-1 text-right">Actions</div>
                    </div>

                    {/* Product Rows / Cards */}
                    <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'} space-y-4 md:space-y-0`}>
                        {products.map((item, index) => (
                            <div
                                key={item._id}
                                className="flex flex-col md:flex-row md:items-center bg-white/5 md:bg-transparent hover:bg-white/10 border border-white/10 md:border-0 md:border-b md:border-white/5 rounded-[24px] md:rounded-xl p-6 md:px-6 md:py-4 transition-all duration-300 group"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Mobile Header: Image + Name + Status */}
                                <div className="flex items-start md:items-center space-x-4 w-full md:w-[30%] mb-6 md:mb-0">
                                    <div className="w-16 h-16 md:w-12 md:h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                        {item.displayImage ? (
                                            <img src={item.displayImage} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={20} className="text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <h4 className="text-white font-bold text-base md:text-sm tracking-wide truncate" title={item.name}>{item.name}</h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400 uppercase tracking-widest">
                                                {item.category || "General"}
                                            </span>
                                            {/* Status Badge - Visible on Mobile inline */}
                                            <span className={`md:hidden px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${item.stockStatus === 'Out of Stock'
                                                ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                                : item.stockStatus === 'Low Stock'
                                                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                                                }`}>
                                                {item.stockStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid - Visible on Mobile */}
                                <div className="grid grid-cols-2 gap-4 mb-6 md:hidden">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Tag size={10} className="text-blue-400" /> Brand
                                        </p>
                                        <p className="text-sm font-bold text-white truncate">{item.brand || "N/A"}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Activity size={10} className="text-purple-400" /> Stock
                                        </p>
                                        <p className="text-sm font-bold text-white">{item.totalStock} units</p>
                                    </div>
                                </div>

                                {/* Desktop Columns */}
                                <div className="hidden md:flex items-center text-gray-400 w-[15%]">
                                    <p className="text-sm font-medium text-gray-300 truncate">{item.brand || "N/A"}</p>
                                </div>

                                <div className="hidden md:flex items-center text-gray-400 w-[15%]">
                                    <p className="text-sm font-bold text-gray-300">{item.totalStock} units</p>
                                </div>

                                <div className="hidden md:flex items-center w-[20%] justify-center">
                                    <div className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${item.stockStatus === 'Out of Stock'
                                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                        : item.stockStatus === 'Low Stock'
                                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                            : 'bg-green-500/10 border-green-500/30 text-green-400'
                                        }`}>
                                        {item.stockStatus}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex-1 flex flex-row justify-end md:justify-end gap-3 mt-4 md:mt-0 border-t md:border-0 border-white/5 pt-4 md:pt-0">
                                    <button
                                        onClick={() => handleUpdateStock(item)}
                                        className="flex-1 md:flex-none transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white px-4 py-3 border border-cyan-500/30 hover:bg-cyan-500 rounded-2xl flex items-center justify-center gap-2"
                                        title="Update Stock"
                                    >
                                        <Edit2 size={16} /> Stock
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-white p-3 border border-red-500/30 hover:bg-red-500 rounded-2xl flex items-center justify-center"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${page === 1
                                    ? 'bg-transparent text-gray-600 border border-white/5 cursor-not-allowed'
                                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-x-1 shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${page === i + 1
                                            ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400/50'
                                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${page === totalPages
                                    ? 'bg-transparent text-gray-600 border border-white/5 cursor-not-allowed'
                                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:translate-x-1 shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                                    }`}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VendorMyProducts;

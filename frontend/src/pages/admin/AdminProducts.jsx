import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/adminApi";
import { Package, Search, AlertCircle, ShoppingBag, DollarSign, Tag, Store, ChevronLeft, ChevronRight } from "lucide-react";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts(page, limit);
            setProducts(data.products || []);
            if (data.totalPages) setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400 font-semibold tracking-widest uppercase text-sm animate-pulse">Loading Products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">All Products</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and view all products listed by vendors.</p>
                </div>
                <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <ShoppingBag size={16} />
                    <span className="text-sm font-bold">Catalog</span>
                </div>
            </div>

            {/* Empty State vs List */}
            {products.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-2">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-wider">No Products Found</h3>
                    <p className="text-gray-400">There are currently no products listed in the system.</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    {/* Header Row */}
                    <div className="hidden md:flex items-center px-6 py-3 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-1/4">Product Name</div>
                        <div className="w-1/6">Price</div>
                        <div className="w-1/6">Stock</div>
                        <div className="w-1/4">Category</div>
                        <div className="flex-1 text-right">Vendor</div>
                    </div>

                    {/* Product Rows */}
                    {products.map((item, index) => (
                        <div
                            key={item._id}
                            className="flex flex-col md:flex-row md:items-center bg-transparent hover:bg-white/5 border-b border-white/5 rounded-xl px-4 md:px-6 py-4 transition-colors duration-300 group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Product Name */}
                            <div className="flex items-center space-x-4 w-full md:w-1/4 mb-4 md:mb-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                    <Package size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <h4 className="text-white font-bold text-sm truncate" title={item.name}>{item.name}</h4>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center text-gray-400 w-full md:w-1/6 mb-3 md:mb-0">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
                                    <DollarSign size={14} className="text-green-400" />
                                </div>
                                <p className="text-sm font-bold text-green-400">₹{item.price}</p>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center text-gray-400 w-full md:w-1/6 mb-3 md:mb-0">
                                <p className="text-sm font-medium text-gray-300">
                                    <span className="md:hidden text-xs uppercase tracking-widest text-gray-500 mr-2">Stock:</span>
                                    {item.stock} units
                                </p>
                            </div>

                            {/* Category */}
                            <div className="flex items-center text-gray-400 w-full md:w-1/4 mb-4 md:mb-0">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
                                    <Tag size={14} className="text-blue-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-300 capitalize truncate" title={item.category}>{item.category}</p>
                            </div>

                            {/* Vendor */}
                            <div className="flex-1 flex justify-start md:justify-end items-center">
                                <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-2 max-w-[150px]">
                                    <Store size={12} className="text-cyan-400 shrink-0" />
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider truncate" title={item.vendor?.name || "N/A"}>
                                        {item.vendor?.name || "N/A"}
                                    </span>
                                </div>
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
                                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
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

export default AdminProducts;

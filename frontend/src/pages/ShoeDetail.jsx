import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getSingleProduct } from "../api/productApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    ArrowLeft, Heart, ShoppingBag,
    CheckCircle, XCircle, ChevronRight,
    Package, Truck, RotateCcw
} from "lucide-react";

const ShoeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shoe, setShoe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [wishlist, setWishlist] = useState(false);
    const [added, setAdded] = useState(false);
    const { addItemToCart } = useCart();

    useEffect(() => {
        const fetchShoe = async () => {
            try {
                const res = await getSingleProduct(id);
                setShoe(res.data);
            } catch (e) {
                setError("Shoe not found");
            } finally {
                setLoading(false);
            }
        };
        fetchShoe();
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) return;

        const success = await addItemToCart({
            productId: shoe._id,
            productName: shoe.name,
            productImage: shoe.image,
            price: shoe.price,
            quantity: 1,
            selectedSize: `UK ${selectedSize.size}`,
            brand: shoe.brand,
            category: shoe.category
        });

        if (success) {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0f1a] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full border-2 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
            </div>
        </div>
    );

    if (error || !shoe) return (
        <div className="min-h-screen bg-[#0a0f1a] flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-white">
                <p className="text-xl font-bold text-red-400">{error || "Something went wrong"}</p>
                <button onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                    ← Go Back
                </button>
            </div>
            <Footer />
        </div>
    );

    const BASE =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://shoes-website-1.onrender.com/api";
    const toUrl = (path) => path.startsWith("http") ? path : `${BASE}${path}`;

    // Build images array from shoe.images or fall back to shoe.image
    let images = [];
    if (shoe.images && shoe.images.length > 0) {
        images = shoe.images.map(toUrl);
    } else if (shoe.image) {
        images = [toUrl(shoe.image)];
    } else {
        images = ["https://github.com/shoes/shoes4/blob/main/app/orange-shoe.png?raw=true"];
    }

    const totalStock = shoe.sizes?.reduce((sum, s) => sum + (Number(s.stock) || 0), 0) || 0;

    return (
        <div className="relative min-h-screen bg-[#0a0f1a] font-sans text-white flex flex-col">
            {/* Ambient blobs */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-[160px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

            <Navbar />

            <main className="flex-grow pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-[1200px] mx-auto w-full">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-white/30 font-semibold uppercase tracking-widest mb-8">
                    <button onClick={() => navigate(-1)} className="hover:text-white/70 transition-colors flex items-center gap-1.5 group">
                        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                        Shop
                    </button>
                    <ChevronRight size={12} className="text-white/15" />
                    <span className="capitalize text-white/40">{shoe.category}</span>
                    <ChevronRight size={12} className="text-white/15" />
                    <span className="text-white/55">{shoe.name}</span>
                </nav>

                {/* ── Two-column layout ── */}
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                    {/* ── LEFT: Vertical image gallery ── */}
                    <div className="flex-1 flex flex-col gap-4">
                        {images.map((src, i) => (
                            <div
                                key={i}
                                className="w-full rounded-2xl overflow-hidden flex items-center justify-center relative"
                                style={{
                                    background: "linear-gradient(135deg, #131e35 0%, #0d1627 100%)",
                                    border: "1px solid rgba(79,142,247,0.1)",
                                    minHeight: i === 0 ? 400 : 280,
                                }}
                            >
                                {/* Subtle radial glow */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div style={{
                                        width: 260, height: 260, borderRadius: "50%",
                                        background: "radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%)",
                                    }} />
                                </div>
                                <img
                                    src={src}
                                    alt={`${shoe.name} view ${i + 1}`}
                                    className="relative z-10 w-full"
                                    style={{
                                        maxHeight: i === 0 ? 360 : 240,
                                        objectFit: "contain",
                                        padding: "24px 32px",
                                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))",
                                    }}
                                />
                                {/* Top shimmer line */}
                                <div className="absolute top-0 left-0 right-0 h-px"
                                    style={{ background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.4), transparent)" }} />
                            </div>
                        ))}
                    </div>

                    {/* ── RIGHT: Sticky product info ── */}
                    <div
                        className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0"
                        style={{ position: "sticky", top: "100px", alignSelf: "flex-start" }}
                    >
                        <div className="flex flex-col gap-6">

                            {/* Type tag */}
                            {shoe.type && (
                                <span
                                    className="inline-flex items-center gap-2 w-fit text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                                    style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", color: "#4f8ef7" }}
                                >
                                    {shoe.type}
                                </span>
                            )}

                            {/* Brand */}
                            <p className="text-xs font-black tracking-[0.35em] uppercase text-white/35">{shoe.brand}</p>

                            {/* Name */}
                            <h1
                                className="text-2xl md:text-3xl font-black leading-snug"
                                style={{
                                    background: "linear-gradient(135deg, #fff 0%, #c0cfe8 100%)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                }}
                            >
                                {shoe.name}
                            </h1>

                            {/* Price */}
                            <div>
                                <p
                                    className="text-3xl font-black"
                                    style={{
                                        background: "linear-gradient(90deg, #4f8ef7, #9d6fff)",
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    ₹{shoe.price?.toLocaleString("en-IN")}
                                </p>
                                <p className="text-xs text-white/30 mt-1">Prices include GST</p>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(79,142,247,0.2), transparent)" }} />

                            {/* Size selector */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
                                        Size
                                        {selectedSize && (
                                            <span className="ml-2 text-blue-400">— UK {selectedSize.size}</span>
                                        )}
                                    </p>
                                    <button className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors">
                                        Size Guide
                                    </button>
                                </div>

                                {shoe.sizes && shoe.sizes.length > 0 ? (
                                    <div className="grid grid-cols-5 gap-2">
                                        {shoe.sizes.map((s, i) => {
                                            const inStock = Number(s.stock) > 0;
                                            const isSelected = selectedSize?.size === s.size;
                                            return (
                                                <button
                                                    key={i}
                                                    disabled={!inStock}
                                                    onClick={() => setSelectedSize(inStock ? s : null)}
                                                    className="relative flex flex-col items-center justify-center py-3 rounded-xl text-sm font-bold transition-all duration-200"
                                                    style={{
                                                        border: isSelected
                                                            ? "2px solid #4f8ef7"
                                                            : "1px solid rgba(255,255,255,0.1)",
                                                        background: isSelected
                                                            ? "rgba(79,142,247,0.15)"
                                                            : inStock
                                                                ? "rgba(255,255,255,0.03)"
                                                                : "transparent",
                                                        color: !inStock ? "rgba(255,255,255,0.2)" : isSelected ? "#fff" : "rgba(255,255,255,0.7)",
                                                        cursor: inStock ? "pointer" : "not-allowed",
                                                        boxShadow: isSelected ? "0 0 16px rgba(79,142,247,0.25)" : "none",
                                                    }}
                                                >
                                                    <span>UK {s.size}</span>
                                                    {!inStock && (
                                                        <div
                                                            className="absolute inset-0 rounded-xl flex items-center justify-center"
                                                            style={{ background: "rgba(10,15,26,0.4)" }}
                                                        >
                                                            <div style={{
                                                                position: "absolute",
                                                                top: "50%", left: "10%", right: "10%",
                                                                height: "1px",
                                                                background: "rgba(255,60,60,0.4)",
                                                                transform: "rotate(-12deg)",
                                                            }} />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/30">No sizes available</p>
                                )}

                                {/* Stock badge */}
                                <div className="mt-3 flex items-center gap-2">
                                    {totalStock > 0
                                        ? <><CheckCircle size={13} className="text-green-400" /><span className="text-xs text-green-400 font-semibold">{totalStock} units in stock</span></>
                                        : <><XCircle size={13} className="text-red-400" /><span className="text-xs text-red-400 font-semibold">Out of stock</span></>
                                    }
                                </div>
                            </div>

                            {/* Add to Cart + Wishlist */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || totalStock === 0}
                                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white transition-all duration-300"
                                    style={{
                                        background: added
                                            ? "linear-gradient(90deg, #22c55e, #16a34a)"
                                            : selectedSize
                                                ? "linear-gradient(90deg, #4f8ef7, #6d5fff)"
                                                : "rgba(255,255,255,0.06)",
                                        boxShadow: selectedSize && !added
                                            ? "0 8px 30px rgba(79,142,247,0.35)"
                                            : added
                                                ? "0 8px 30px rgba(34,197,94,0.3)"
                                                : "none",
                                        cursor: selectedSize && totalStock > 0 ? "pointer" : "not-allowed",
                                        opacity: !selectedSize || totalStock === 0 ? 0.5 : 1,
                                        transform: selectedSize ? "none" : "none",
                                    }}
                                >
                                    {added
                                        ? <><CheckCircle size={18} /> Added!</>
                                        : !selectedSize
                                            ? <><ShoppingBag size={18} /> Select a Size</>
                                            : <><ShoppingBag size={18} /> Add to Cart</>
                                    }
                                </button>

                                <button
                                    onClick={() => setWishlist(w => !w)}
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0"
                                    style={{
                                        border: wishlist ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                        background: wishlist ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)",
                                        color: wishlist ? "#ef4444" : "rgba(255,255,255,0.4)",
                                    }}
                                >
                                    <Heart size={20} fill={wishlist ? "#ef4444" : "none"} />
                                </button>
                            </div>

                            {/* Select size hint */}
                            {!selectedSize && totalStock > 0 && (
                                <p className="text-xs text-yellow-400/70 font-semibold text-center -mt-2">
                                    ↑ Please select a size to add to cart
                                </p>
                            )}

                            {/* Delivery info */}
                            <div
                                className="rounded-2xl p-4 flex flex-col gap-3"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <div className="flex items-start gap-3">
                                    <Truck size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-white/70">Free Shipping</p>
                                        <p className="text-[11px] text-white/35 mt-0.5">On orders above ₹999</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RotateCcw size={16} className="text-purple-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-white/70">Easy Returns</p>
                                        <p className="text-[11px] text-white/35 mt-0.5">10-day hassle-free return policy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(79,142,247,0.2), transparent)" }} />

                            {/* Description */}
                            {shoe.description && (
                                <div>
                                    <p className="text-xs font-black tracking-[0.2em] uppercase text-white/40 mb-2 flex items-center gap-2">
                                        Description
                                    </p>
                                    <p className="text-sm leading-relaxed text-white/50">{shoe.description}</p>
                                </div>
                            )}

                            {/* Details list */}
                            <div>
                                <p className="text-xs font-black tracking-[0.2em] uppercase text-white/40 mb-3">Details</p>
                                <ul className="text-sm text-white/45 space-y-2">
                                    <li className="flex gap-2">
                                        <Package size={13} className="text-blue-400 shrink-0 mt-0.5" />
                                        <span>Category: <span className="capitalize text-white/65">{shoe.category}</span></span>
                                    </li>
                                    {shoe.type && (
                                        <li className="flex gap-2">
                                            <Package size={13} className="text-purple-400 shrink-0 mt-0.5" />
                                            <span>Type: <span className="text-white/65">{shoe.type}</span></span>
                                        </li>
                                    )}
                                    {shoe.brand && (
                                        <li className="flex gap-2">
                                            <Package size={13} className="text-indigo-400 shrink-0 mt-0.5" />
                                            <span>Brand: <span className="text-white/65">{shoe.brand}</span></span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ShoeDetail;

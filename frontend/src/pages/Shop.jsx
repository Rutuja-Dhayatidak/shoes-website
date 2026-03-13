import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryBanner from "../components/CategoryBanner";
import { getProducts, getShoeTypes, getShoeBrands } from "../api/productApi";

import { getSafeImageUrl } from "../api/axiosInstance";

const PRICE_RANGES = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 – ₹1,000", min: 500, max: 1000 },
    { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
    { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
    { label: "Above ₹5,000", min: 5000, max: Infinity },
];

const Shop = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState("");
    const [shoeTypes, setShoeTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [shoeBrands, setShoeBrands] = useState([]);
    const LIMIT = 12;

    useEffect(() => {
        const fetchShoes = async () => {
            setLoading(true);
            try {
                const response = await getProducts({ category, type: selectedType, page: currentPage, limit: LIMIT });
                const data = response.data;
                if (data.success) {
                    let result = data.data;
                    // Client-side price filter
                    if (selectedPriceRange) {
                        result = result.filter(s =>
                            s.price >= selectedPriceRange.min &&
                            (selectedPriceRange.max === Infinity ? true : s.price < selectedPriceRange.max)
                        );
                    }
                    // Client-side brand filter
                    if (selectedBrand) {
                        result = result.filter(s =>
                            s.brand && s.brand.toLowerCase() === selectedBrand.toLowerCase()
                        );
                    }
                    setShoes(result);
                    setTotalPages(data.totalPages || 1);
                    setTotalCount(data.totalCount || data.count || 0);
                } else {
                    setError("Failed to fetch shoes");
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchShoes();
        }
    }, [category, selectedType, currentPage, selectedPriceRange, selectedBrand]);

    // Reset to page 1 whenever filter or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [category, selectedType, selectedPriceRange, selectedBrand]);

    // Fetch available types from DB whenever category changes
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await getShoeTypes(category);
                if (res.data.success) setShoeTypes(res.data.data);
            } catch (e) {
                setShoeTypes([]);
            }
        };
        if (category) fetchTypes();
    }, [category]);

    // Fetch available brands from DB whenever category changes
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getShoeBrands(category);
                if (res.data.success) setShoeBrands(res.data.data);
            } catch (e) {
                setShoeBrands([]);
            }
        };
        if (category) fetchBrands();
    }, [category]);

    const CARD_BGS = ['#c97a3a', '#3a5f7a', '#9c6b4e', '#4a7c5e', '#7a5c3a', '#4a4c7a'];

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-[#0a0f1a] to-[#0d1627] font-sans text-white flex flex-col">
            <Navbar />

            {/* ── Sidebar styles ── */}
            <style>{`
                .sb-scrollbar::-webkit-scrollbar { width: 6px; }
                .sb-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 99px; }
                .sb-scrollbar::-webkit-scrollbar-thumb { background: rgba(79,142,247,0.45); border-radius: 99px; }
                .sb-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(79,142,247,0.7); }

                .sb-chip {
                    display: flex; align-items: center; justify-content: space-between;
                    width: 100%; text-align: left; padding: 10px 14px; border-radius: 10px;
                    font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
                    cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                    border: 1.5px solid transparent; gap: 6px;
                }
                .sb-chip.active {
                    background: linear-gradient(135deg, rgba(79,142,247,0.22), rgba(109,95,255,0.16));
                    border-color: rgba(79,142,247,0.55);
                    color: #6faaff;
                    box-shadow: 0 0 18px rgba(79,142,247,0.12), inset 0 0 10px rgba(79,142,247,0.05);
                }
                .sb-chip.inactive { background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); }
                .sb-chip.inactive:hover {
                    background: rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.85);
                    border-color: rgba(255,255,255,0.12);
                    transform: translateX(3px);
                }
                .sb-chip .chip-dot {
                    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
                    background: currentColor; opacity: 0.6;
                }
                .sb-chip.active .chip-dot { opacity: 1; box-shadow: 0 0 6px currentColor; }
                .sb-check {
                    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: linear-gradient(135deg, #4f8ef7, #6d5fff);
                    font-size: 10px; font-weight: 900;
                    box-shadow: 0 2px 8px rgba(79,142,247,0.4);
                }
                .sb-section-label {
                    display: flex; align-items: center; gap: 7px;
                    font-size: 9px; font-weight: 900; letter-spacing: 0.25em;
                    text-transform: uppercase; color: rgba(255,255,255,0.28);
                    margin-bottom: 10px;
                }
                .sb-section-label::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
                }
            `}</style>

            <main className="flex-grow pt-32 pb-20 w-full">

                {/* ── HERO BANNER ── */}
                <div className="px-4 md:px-10 mb-10">
                    <CategoryBanner category={category} />
                </div>

                {/* ── MAIN BODY: left sidebar + right content ── */}
                <div className="flex items-start gap-6 px-4 md:px-8 max-w-[1500px] mx-auto">

                    {/* ════ LEFT SIDEBAR ════ */}
                    <aside className="hidden md:flex flex-col flex-shrink-0 sb-scrollbar"
                        style={{
                            width: 240,
                            position: 'sticky',
                            top: 96,
                            maxHeight: 'calc(100vh - 112px)',
                            overflowY: 'auto',
                        }}>
                        <div style={{
                            background: 'linear-gradient(160deg, rgba(13,22,39,0.95) 0%, rgba(10,15,26,0.98) 100%)',
                            border: '1px solid rgba(79,142,247,0.15)',
                            borderRadius: 20,
                            padding: '0 0 28px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                        }}>
                            {/* Gradient header */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(79,142,247,0.2) 0%, rgba(109,95,255,0.15) 100%)',
                                borderBottom: '1px solid rgba(79,142,247,0.2)',
                                padding: '18px 18px 16px',
                                borderRadius: '20px 20px 0 0',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                    <span style={{ fontSize: 16 }}>🗂️</span>
                                    <span style={{ fontWeight: 900, fontSize: 14, background: 'linear-gradient(90deg,#fff,#aac4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        All Categories
                                    </span>
                                </div>
                                {(selectedType || selectedPriceRange || selectedBrand) && (
                                    <button onClick={() => { setSelectedType(''); setSelectedPriceRange(null); setSelectedBrand(''); }}
                                        style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8080', cursor: 'pointer', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        ✕ Reset
                                    </button>
                                )}
                            </div>

                            <div style={{ padding: '16px 14px 0' }}>
                                {/* Type section */}
                                <p className="sb-section-label">
                                    <span style={{ fontSize: 12 }}>👟</span> Type
                                </p>

                                {/* ALL chip */}
                                <button className={`sb-chip ${selectedType === '' ? 'active' : 'inactive'}`}
                                    onClick={() => setSelectedType('')}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="chip-dot" style={{ background: selectedType === '' ? '#4f8ef7' : 'rgba(255,255,255,0.3)' }} />
                                        All Types
                                    </span>
                                    {selectedType === '' && <span className="sb-check">✓</span>}
                                </button>

                                {/* Type chips */}
                                {shoeTypes.map((type, ti) => {
                                    const DOT_COLORS = ['#4f8ef7', '#a78bfa', '#34d399', '#f59e0b', '#f87171', '#38bdf8'];
                                    const dotColor = DOT_COLORS[ti % DOT_COLORS.length];
                                    return (
                                        <button key={type}
                                            className={`sb-chip ${selectedType === type ? 'active' : 'inactive'}`}
                                            onClick={() => setSelectedType(prev => prev === type ? '' : type)}
                                            style={{ marginTop: 4 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span className="chip-dot" style={{ background: dotColor }} />
                                                {type}
                                            </span>
                                            {selectedType === type && <span className="sb-check">✓</span>}
                                        </button>
                                    );
                                })}

                                {/* Price Range section */}
                                <p className="sb-section-label" style={{ marginTop: 20 }}>
                                    <span style={{ fontSize: 12 }}>💰</span> Price
                                </p>

                                {PRICE_RANGES.map((range, i) => {
                                    const isActive = selectedPriceRange?.label === range.label;
                                    const PRICE_ICONS = ['🪙', '💵', '💳', '💎', '👑'];
                                    return (
                                        <button key={i}
                                            className={`sb-chip ${isActive ? 'active' : 'inactive'}`}
                                            onClick={() => setSelectedPriceRange(isActive ? null : range)}
                                            style={{ marginTop: i === 0 ? 0 : 4 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 12, lineHeight: 1 }}>{PRICE_ICONS[i]}</span>
                                                {range.label}
                                            </span>
                                            {isActive && <span className="sb-check">✓</span>}
                                        </button>
                                    );
                                })}

                                {/* Brand section */}
                                {shoeBrands.length > 0 && (
                                    <>
                                        <p className="sb-section-label" style={{ marginTop: 20 }}>
                                            <span style={{ fontSize: 12 }}>🏷️</span> Brand
                                        </p>
                                        {shoeBrands.map((brand, bi) => {
                                            const BRAND_COLORS = ['#f472b6', '#fb923c', '#a3e635', '#22d3ee', '#c084fc', '#f87171'];
                                            const dotColor = BRAND_COLORS[bi % BRAND_COLORS.length];
                                            const isActive = selectedBrand === brand;
                                            return (
                                                <button key={brand}
                                                    className={`sb-chip ${isActive ? 'active' : 'inactive'}`}
                                                    onClick={() => setSelectedBrand(prev => prev === brand ? '' : brand)}
                                                    style={{ marginTop: bi === 0 ? 0 : 4 }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span className="chip-dot" style={{ background: dotColor }} />
                                                        {brand}
                                                    </span>
                                                    {isActive && <span className="sb-check">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* ════ RIGHT CONTENT ════ */}
                    <div className="flex-1 min-w-0">

                        {/* Top bar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <h1 style={{ fontWeight: 900, fontSize: 22, margin: 0 }}>
                                    {selectedType ? selectedType : (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All')} Shoes
                                </h1>
                                {totalCount > 0 && (
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: 3 }}>{totalCount} products</p>
                                )}
                            </div>
                            {/* Mobile filter pills */}
                            <div className="flex md:hidden flex-wrap gap-2">
                                <button onClick={() => setSelectedType('')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${selectedType === '' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10'
                                        }`}>All</button>
                                {shoeTypes.map(type => (
                                    <button key={type} onClick={() => setSelectedType(prev => prev === type ? '' : type)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${selectedType === type ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10'
                                            }`}>{type}</button>
                                ))}
                            </div>
                        </div>

                        {/* Active filter tags */}
                        {(selectedType || selectedPriceRange || selectedBrand) && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                                {selectedType && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(79,142,247,0.14)', border: '1.5px solid rgba(79,142,247,0.45)', color: '#4f8ef7', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                                        {selectedType}
                                        <button onClick={() => setSelectedType('')} style={{ background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', padding: 0, fontWeight: 900, fontSize: 14, lineHeight: 1 }}>✕</button>
                                    </span>
                                )}
                                {selectedPriceRange && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(79,142,247,0.14)', border: '1.5px solid rgba(79,142,247,0.45)', color: '#4f8ef7', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                                        {selectedPriceRange.label}
                                        <button onClick={() => setSelectedPriceRange(null)} style={{ background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', padding: 0, fontWeight: 900, fontSize: 14, lineHeight: 1 }}>✕</button>
                                    </span>
                                )}
                                {selectedBrand && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(244,114,182,0.14)', border: '1.5px solid rgba(244,114,182,0.45)', color: '#f472b6', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                                        🏷️ {selectedBrand}
                                        <button onClick={() => setSelectedBrand('')} style={{ background: 'none', border: 'none', color: '#f472b6', cursor: 'pointer', padding: 0, fontWeight: 900, fontSize: 14, lineHeight: 1 }}>✕</button>
                                    </span>
                                )}
                                <button onClick={() => { setSelectedType(''); setSelectedPriceRange(null); setSelectedBrand(''); }}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: '4px 6px', textDecoration: 'underline' }}>
                                    Clear All
                                </button>
                            </div>
                        )}

                        {/* ── PRODUCTS GRID ── */}
                        <div className="w-full">

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white" />
                                </div>

                            ) : error ? (
                                <div className="text-red-500 text-center py-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                    {error}
                                </div>

                            ) : shoes.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <p className="text-gray-400 tracking-widest uppercase text-sm">
                                        No shoes found in this category.
                                    </p>
                                </div>

                            ) : (
                                <>
                                    <style>{`
                            .shoe-3d-parent {
                                padding: 10px;
                                perspective: 1000px;
                            }
                            .shoe-3d-card {
                                position: relative;
                                padding-top: 50px;
                                border: 3px solid #1a1a1a;
                                transform-style: preserve-3d;
                                background:
                                    linear-gradient(135deg, #0000 18.75%, #1e1e1e 0 31.25%, #0000 0),
                                    repeating-linear-gradient(45deg, #1e1e1e -6.25% 6.25%, #0d0d0d 0 18.75%);
                                background-size: 50px 50px;
                                background-position: 0 0, 0 0;
                                background-color: #0d0d0d;
                                width: 100%;
                                box-shadow: rgba(0,0,0,0.5) 0px 30px 30px -10px;
                                transition: all 0.5s ease-in-out;
                                cursor: pointer;
                            }
                            .shoe-3d-card:hover {
                                background-position: -80px 80px, -80px 80px;
                                transform: rotate3d(0.5, 1, 0, 25deg);
                            }
                            .shoe-3d-content {
                                background: linear-gradient(160deg, #0d1627 0%, #131e35 100%);
                                border-top: 1.5px solid rgba(79,142,247,0.25);
                                transition: all 0.5s ease-in-out;
                                padding: 16px 20px 20px 20px;
                                transform-style: preserve-3d;
                                display: flex;
                                flex-direction: column;
                                gap: 8px;
                            }
                            .shoe-3d-img-wrap {
                                width: 100%;
                                height: 160px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transform: translate3d(0px, 0px, 40px);
                                transition: transform 0.5s ease-in-out;
                            }
                            .shoe-3d-card:hover .shoe-3d-img-wrap {
                                transform: translate3d(0px, 0px, 70px);
                            }
                            .shoe-3d-brand {
                                font-size: 9px;
                                font-weight: 700;
                                color: rgba(255,255,255,0.45);
                                letter-spacing: 0.2em;
                                text-transform: uppercase;
                                transform: translate3d(0px, 0px, 30px);
                                transition: all 0.5s ease-in-out;
                                display: block;
                            }
                            .shoe-3d-name {
                                display: block;
                                color: #e8edf5;
                                font-size: 18px;
                                font-weight: 900;
                                line-height: 1.15;
                                transform: translate3d(0px, 0px, 50px);
                                transition: all 0.5s ease-in-out;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .shoe-3d-card:hover .shoe-3d-name {
                                transform: translate3d(0px, 0px, 65px);
                            }
                            .shoe-3d-btn {
                                cursor: pointer;
                                display: inline-block;
                                font-weight: 900;
                                font-size: 9px;
                                text-transform: uppercase;
                                color: #0d1627;
                                background: linear-gradient(90deg, #4f8ef7, #6d5fff);
                                box-shadow: 0 4px 15px rgba(79,142,247,0.35);
                                padding: 6px 10px;
                                border: none;
                                align-self: flex-start;
                                transform: translate3d(0px, 0px, 20px);
                                transition: all 0.5s ease-in-out;
                                letter-spacing: 0.1em;
                            }
                            .shoe-3d-card:hover .shoe-3d-btn {
                                transform: translate3d(0px, 0px, 60px);
                            }
                            .shoe-3d-price-box {
                                position: absolute;
                                top: 14px;
                                right: 18px;
                                min-width: 60px;
                                background: #141414;
                                border: 1.5px solid rgba(79,142,247,0.6);
                                padding: 8px 10px;
                                text-align: center;
                                transform: translate3d(0px, 0px, 80px);
                                box-shadow: rgba(100,100,111,0.2) 0px 17px 10px -10px;
                                transition: transform 0.5s ease-in-out;
                            }
                            .shoe-3d-card:hover .shoe-3d-price-box {
                                transform: translate3d(0px, 0px, 100px);
                            }
                            .shoe-3d-price-label {
                                display: block;
                                color: rgba(255,255,255,0.6);
                                font-size: 8px;
                                font-weight: 700;
                                letter-spacing: 0.1em;
                                text-transform: uppercase;
                            }
                            .shoe-3d-price-val {
                                display: block;
                                font-size: 15px;
                                font-weight: 900;
                                color: #4f8ef7;
                                white-space: nowrap;
                            }
                        `}</style>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {shoes.map((shoe) => {
                                            const imgSrc = shoe.image
                                                ? getSafeImageUrl(shoe.image)
                                                : 'https://github.com/shoes/shoes4/blob/main/app/orange-shoe.png?raw=true';
                                            return (
                                                <div key={shoe._id} className="shoe-3d-parent">
                                                    <div className="shoe-3d-card">

                                                        {/* Floating price tag (like date-box) */}
                                                        <div className="shoe-3d-price-box">
                                                            <span className="shoe-3d-price-label">Price</span>
                                                            <span className="shoe-3d-price-val">₹{shoe.price}</span>
                                                        </div>

                                                        {/* Content box */}
                                                        <div className="shoe-3d-content">

                                                            {/* Shoe image — floats in 3D */}
                                                            <div className="shoe-3d-img-wrap">
                                                                <img
                                                                    src={imgSrc}
                                                                    alt={shoe.name}
                                                                    style={{
                                                                        width: '100%', height: '100%',
                                                                        objectFit: 'contain',
                                                                        filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.5))',
                                                                    }}
                                                                />
                                                            </div>

                                                            <span className="shoe-3d-brand">
                                                                {shoe.brand || shoe.type || 'BRAND'}
                                                            </span>

                                                            <span className="shoe-3d-name">{shoe.name}</span>

                                                            <button
                                                                className="shoe-3d-btn"
                                                                onClick={() => navigate(`/shoe/${shoe._id}`)}
                                                            >View Details →</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* ── Pagination ── */}
                            {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-4 mt-10">

                                    {/* Info text */}
                                    <p className="text-xs text-white/30 font-semibold tracking-widest uppercase">
                                        Showing {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, totalCount)} of {totalCount} shoes
                                    </p>

                                    {/* Page buttons */}
                                    <div className="flex items-center gap-2 flex-wrap justify-center">

                                        {/* Prev */}
                                        <button
                                            onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200"
                                            style={{
                                                background: currentPage === 1 ? "rgba(255,255,255,0.03)" : "rgba(79,142,247,0.12)",
                                                border: currentPage === 1 ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(79,142,247,0.3)",
                                                color: currentPage === 1 ? "rgba(255,255,255,0.2)" : "#4f8ef7",
                                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            ← Prev
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                            .reduce((acc, p, idx, arr) => {
                                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                                                acc.push(p);
                                                return acc;
                                            }, [])
                                            .map((item, idx) =>
                                                item === "..." ? (
                                                    <span key={`dots-${idx}`} className="text-white/20 px-1 text-sm font-bold">…</span>
                                                ) : (
                                                    <button
                                                        key={item}
                                                        onClick={() => { setCurrentPage(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        className="w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200"
                                                        style={{
                                                            background: currentPage === item ? "linear-gradient(135deg, #4f8ef7, #6d5fff)" : "rgba(255,255,255,0.04)",
                                                            border: currentPage === item ? "none" : "1px solid rgba(255,255,255,0.08)",
                                                            color: currentPage === item ? "#fff" : "rgba(255,255,255,0.45)",
                                                            boxShadow: currentPage === item ? "0 4px 16px rgba(79,142,247,0.35)" : "none",
                                                            transform: currentPage === item ? "scale(1.1)" : "scale(1)",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {item}
                                                    </button>
                                                )
                                            )
                                        }

                                        {/* Next */}
                                        <button
                                            onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200"
                                            style={{
                                                background: currentPage === totalPages ? "rgba(255,255,255,0.03)" : "rgba(79,142,247,0.12)",
                                                border: currentPage === totalPages ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(79,142,247,0.3)",
                                                color: currentPage === totalPages ? "rgba(255,255,255,0.2)" : "#4f8ef7",
                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                        {/* closes right content */}
                    </div>
                    {/* closes main body flex row */}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Shop;

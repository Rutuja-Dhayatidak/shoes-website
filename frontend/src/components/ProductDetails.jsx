import React, { useEffect, useState } from "react";
import { X, Tag, Layers, IndianRupee, Package, FileText, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { IMAGE_BASE_URL } from "../api/axiosInstance";

const ProductDetails = ({ shoe, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const { addItemToCart } = useCart();

    // Animate in
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    // Close with animation
    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            return; // Maybe show a small local error or rely on it being disabled
        }

        setIsAdding(true);
        const success = await addItemToCart({
            productId: shoe._id,
            productName: shoe.name,
            productImage: shoe.image,
            price: shoe.price,
            quantity: 1,
            selectedSize: `UK ${selectedSize}`,
            brand: shoe.brand,
            category: shoe.category
        });
        
        if (success) {
            setTimeout(() => setIsAdding(false), 2000);
        } else {
            setIsAdding(false);
        }
    };

    if (!shoe) return null;

    const imgSrc = shoe.image
        ? (shoe.image.startsWith("http") ? shoe.image : `${IMAGE_BASE_URL}${shoe.image}`)
        : "https://github.com/shoes/shoes4/blob/main/app/orange-shoe.png?raw=true";

    const totalStock = shoe.sizes?.reduce((sum, s) => sum + (Number(s.stock) || 0), 0) || 0;

    return (
        <>
            <style>{`
                @keyframes pdBackdropIn  { from { opacity:0; } to { opacity:1; } }
                @keyframes pdBackdropOut { from { opacity:1; } to { opacity:0; } }
                @keyframes pdSlideIn  { from { opacity:0; transform:translateY(40px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes pdSlideOut { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(40px) scale(0.97); } }

                .pd-backdrop {
                    position: fixed; inset: 0; z-index: 9000;
                    background: rgba(0,0,0,0.75);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 16px;
                    animation: pdBackdropIn 0.25s ease forwards;
                }
                .pd-backdrop.closing { animation: pdBackdropOut 0.25s ease forwards; }

                .pd-modal {
                    position: relative;
                    width: 100%; max-width: 860px;
                    max-height: 90vh;
                    background: linear-gradient(135deg, #0d1627 0%, #0a0f1a 100%);
                    border: 1px solid rgba(79,142,247,0.2);
                    border-radius: 24px;
                    overflow: hidden;
                    display: flex; flex-direction: column;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(79,142,247,0.08);
                    animation: pdSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                .pd-modal.closing { animation: pdSlideOut 0.25s ease forwards; }

                /* Glowing top border line */
                .pd-modal::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(79,142,247,0.7), rgba(109,95,255,0.7), transparent);
                }

                .pd-body {
                    display: flex; flex-direction: row;
                    overflow: hidden; flex:1;
                }

                .pd-image-col {
                    width: 42%; flex-shrink: 0;
                    background: linear-gradient(160deg, #131e35 0%, #0d1627 100%);
                    display: flex; align-items: center; justify-content: center;
                    padding: 32px 24px;
                    position: relative;
                    border-right: 1px solid rgba(79,142,247,0.12);
                }
                .pd-image-col::after {
                    content: '';
                    position: absolute;
                    width: 200px; height: 200px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(79,142,247,0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .pd-info-col {
                    flex: 1;
                    padding: 32px 28px;
                    overflow-y: auto;
                    display: flex; flex-direction: column; gap: 20px;
                }

                /* Scrollbar styling */
                .pd-info-col::-webkit-scrollbar { width: 4px; }
                .pd-info-col::-webkit-scrollbar-track { background: transparent; }
                .pd-info-col::-webkit-scrollbar-thumb { background: rgba(79,142,247,0.3); border-radius: 4px; }

                .pd-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: rgba(79,142,247,0.1);
                    border: 1px solid rgba(79,142,247,0.25);
                    color: #4f8ef7;
                    font-size: 9px; font-weight: 800;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    padding: 4px 10px; border-radius: 999px;
                    width: fit-content;
                }

                .pd-brand {
                    font-size: 10px; font-weight: 800;
                    letter-spacing: 0.3em; text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                }

                .pd-name {
                    font-size: 26px; font-weight: 900; line-height: 1.2;
                    background: linear-gradient(135deg, #fff 0%, #a0b4d0 100%);
                    -webkit-background-clip: text; background-clip: text;
                    color: transparent;
                    margin: 0;
                }

                .pd-price {
                    font-size: 28px; font-weight: 900;
                    background: linear-gradient(90deg, #4f8ef7, #9d6fff);
                    -webkit-background-clip: text; background-clip: text;
                    color: transparent;
                    display: flex; align-items: center; gap: 2px;
                }

                .pd-divider {
                    height: 1px;
                    background: linear-gradient(90deg, rgba(79,142,247,0.2), transparent);
                }

                .pd-label {
                    font-size: 9px; font-weight: 800;
                    letter-spacing: 0.25em; text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    display: flex; align-items: center; gap: 6px;
                    margin-bottom: 8px;
                }

                .pd-description {
                    font-size: 13px; line-height: 1.7;
                    color: rgba(255,255,255,0.55);
                }

                .pd-size-grid {
                    display: flex; flex-wrap: wrap; gap: 8px;
                }

                .pd-size-pill {
                    display: flex; flex-direction: column; align-items: center;
                    padding: 8px 12px; border-radius: 10px; min-width: 52px;
                    border: 1px solid rgba(79,142,247,0.25);
                    background: rgba(79,142,247,0.07);
                    transition: all 0.2s ease;
                }
                .pd-size-pill:hover { background: rgba(79,142,247,0.15); border-color: rgba(79,142,247,0.5); }
                .pd-size-pill.out { border-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); opacity: 0.45; }
                .pd-size-num { font-size: 14px; font-weight: 800; color: #e8edf5; }
                .pd-size-stock { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.35); margin-top: 2px; }
                .pd-size-stock.in { color: #4ade80; }
                .pd-size-stock.out-text { color: rgba(255,80,80,0.7); }

                .pd-close-btn {
                    position: absolute; top: 16px; right: 16px; z-index: 10;
                    width: 36px; height: 36px; border-radius: 50%;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s ease;
                    color: rgba(255,255,255,0.6);
                }
                .pd-close-btn:hover {
                    background: rgba(239,68,68,0.15); color: #ef4444;
                    border-color: rgba(239,68,68,0.3); transform: scale(1.1);
                }

                @media (max-width: 640px) {
                    .pd-body { flex-direction: column; }
                    .pd-image-col { width: 100%; height: 220px; border-right: none; border-bottom: 1px solid rgba(79,142,247,0.12); }
                    .pd-name { font-size: 20px; }
                }

                .pd-add-btn {
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    width: 100%; padding: 16px; border-radius: 16px;
                    background: linear-gradient(135deg, #4f8ef7 0%, #3b82f6 100%);
                    color: white; font-weight: 800; font-size: 14px; letter-spacing: 0.1em;
                    border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 20px rgba(79, 142, 247, 0.3);
                }
                .pd-add-btn:hover:not(.disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(79, 142, 247, 0.4); filter: brightness(1.1); }
                .pd-add-btn:active:not(.disabled) { transform: translateY(0); }
                .pd-add-btn.disabled { opacity: 0.5; cursor: not-allowed; background: #334155; box-shadow: none; }
                .pd-add-btn.adding { background: #22c55e; box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3); }

                .pd-size-pill.selected { border-color: #4f8ef7; background: rgba(79,142,247,0.2); }
            `}</style>

            <div
                className={`pd-backdrop ${!visible ? "closing" : ""}`}
                onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
            >
                <div className={`pd-modal ${!visible ? "closing" : ""}`}>

                    {/* Close button */}
                    <button className="pd-close-btn" onClick={handleClose} title="Close">
                        <X size={16} />
                    </button>

                    <div className="pd-body">

                        {/* ── Left: Image ── */}
                        <div className="pd-image-col">
                            <img
                                src={imgSrc}
                                alt={shoe.name}
                                style={{
                                    maxWidth: "100%", maxHeight: "280px",
                                    objectFit: "contain",
                                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
                                    position: "relative", zIndex: 1,
                                }}
                            />
                        </div>

                        {/* ── Right: Info ── */}
                        <div className="pd-info-col">

                            {/* Type badge + brand */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {shoe.type && (
                                    <span className="pd-badge">
                                        <Layers size={10} /> {shoe.type}
                                    </span>
                                )}
                                <p className="pd-brand">{shoe.brand || "Brand"}</p>
                            </div>

                            {/* Name */}
                            <h2 className="pd-name">{shoe.name}</h2>

                            {/* Price */}
                            <div className="pd-price">
                                <IndianRupee size={22} strokeWidth={3} />
                                {shoe.price?.toLocaleString("en-IN")}
                            </div>

                            <div className="pd-divider" />

                            {/* Description */}
                            {shoe.description && (
                                <div>
                                    <p className="pd-label"><FileText size={11} /> Description</p>
                                    <p className="pd-description">{shoe.description}</p>
                                </div>
                            )}

                            {/* Sizes */}
                            {shoe.sizes && shoe.sizes.length > 0 && (
                                <div>
                                    <p className="pd-label">
                                        <Package size={11} /> Available Sizes
                                        <span style={{ marginLeft: "auto", color: totalStock > 0 ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", gap: 4 }}>
                                            {totalStock > 0
                                                ? <><CheckCircle size={11} /> {totalStock} in stock</>
                                                : <><XCircle size={11} /> Out of stock</>
                                            }
                                        </span>
                                    </p>
                                    <div className="pd-size-grid">
                                        {shoe.sizes.map((s, i) => {
                                            const inStock = Number(s.stock) > 0;
                                            const isSelected = selectedSize === s.size;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`pd-size-pill ${!inStock ? "out" : "cursor-pointer"} ${isSelected ? "selected" : ""}`}
                                                    onClick={() => inStock && setSelectedSize(s.size)}
                                                    style={{
                                                        borderColor: isSelected ? "#4f8ef7" : "",
                                                        background: isSelected ? "rgba(79,142,247,0.2)" : ""
                                                    }}
                                                >
                                                    <span className="pd-size-num">UK {s.size}</span>
                                                    <span className={`pd-size-stock ${inStock ? "in" : "out-text"}`}>
                                                        {inStock ? `${s.stock} left` : "Sold out"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="pd-divider" />

                            {/* Add to Cart Button */}
                            <button
                                className={`pd-add-btn ${!selectedSize ? 'disabled' : ''} ${isAdding ? 'adding' : ''}`}
                                onClick={handleAddToCart}
                                disabled={!selectedSize || isAdding}
                            >
                                {isAdding ? (
                                    <><CheckCircle size={18} /> ADDED!</>
                                ) : (
                                    <><ShoppingCart size={18} /> {selectedSize ? "ADD TO CART" : "SELECT A SIZE"}</>
                                )}
                            </button>

                            {/* Category */}
                            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                <p className="pd-label" style={{ marginBottom: 0 }}>
                                    <Tag size={11} /> Category:
                                    <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: 6, textTransform: "capitalize", letterSpacing: "0.05em" }}>
                                        {shoe.category}
                                    </span>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;

import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
    const { cart, updateItemQuantity, removeItemFromCart, clearUserCart, loading } = useCart();
    const navigate = useNavigate();

    if (loading && cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Continue Shopping</span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">YOUR BAG</h1>
                    </div>
                    {cart.items.length > 0 && (
                        <button
                            onClick={clearUserCart}
                            className="text-red-500/60 hover:text-red-500 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Clear Cart
                        </button>
                    )}
                </div>

                {cart.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={48} className="text-white/20" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-10">
                            Looks like you haven't added anything to your bag yet. Start exploring our latest collections.
                        </p>
                        <Link
                            to="/shop/men"
                            className="bg-white text-[#0a0f1a] px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition-all duration-300"
                        >
                            Explore Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-8">
                            {cart.items.map((item) => (
                                <div key={`${item.productId}-${item.selectedSize}`} className="flex gap-6 pb-8 border-b border-white/5 group">
                                    <div className="w-32 h-32 md:w-40 md:h-40 bg-[#131e35] rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                                        <img
                                            src={item.productImage?.startsWith('http') ? item.productImage : `http://localhost:3000${item.productImage}`}
                                            alt={item.productName}
                                            className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-grow flex flex-col justify-between py-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">{item.brand}</p>
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.productName}</h3>
                                                <p className="text-sm font-bold text-gray-500">{item.selectedSize}</p>
                                            </div>
                                            <p className="text-xl font-black">₹{item.price.toLocaleString('en-IN')}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
                                                <button
                                                    onClick={() => updateItemQuantity(item.productId, item.selectedSize, 'decrease')}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateItemQuantity(item.productId, item.selectedSize, 'increase')}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItemFromCart(item.productId, item.selectedSize)}
                                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 md:p-10 sticky top-32">
                                <h2 className="text-2xl font-bold mb-8">ORDER SUMMARY</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Items ({cart.totalItems})</span>
                                        <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Free</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-6" />
                                    <div className="flex justify-between text-2xl font-black">
                                        <span>TOTAL</span>
                                        <span className="text-blue-400">₹{cart.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-white text-[#0a0f1a] py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all duration-500 shadow-2xl shadow-white/5 group relative overflow-hidden"
                                >
                                    <span className="relative z-10">CHECKOUT NOW</span>
                                    <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>

                                <p className="text-[10px] text-gray-600 text-center mt-6 uppercase tracking-widest font-bold">
                                    Secure payments powered by Razorpay
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;

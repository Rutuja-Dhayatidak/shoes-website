import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { cart } = useCart();

    // Fetch user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location]); // Re-run when location changes (like after login/logout redirects)

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    return (
        <>
            <nav className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-8 bg-transparent">
                {/* Left side menu */}
                <div className="flex items-center space-x-12 lg:space-x-20 z-50">
                    <Link to="/" className="font-extrabold text-2xl tracking-[0.3em] uppercase cursor-pointer text-white">
                        Brand<span className="text-white/40">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex items-center space-x-12 text-[13px] uppercase tracking-[0.25em] font-semibold">
                        <li className={`cursor-pointer relative group transition-colors duration-300 ${location.pathname === '/' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                            <Link to="/">HOME</Link>
                            <span className={`absolute -bottom-2 left-0 h-[2px] bg-white transform origin-left transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </li>
                        <li className={`cursor-pointer relative group transition-colors duration-300 ${location.pathname === '/shop/men' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                            <Link to="/shop/men">MEN</Link>
                            <span className={`absolute -bottom-2 left-0 h-[2px] bg-white transform origin-left transition-all duration-300 ${location.pathname === '/shop/men' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </li>
                        <li className={`cursor-pointer relative group transition-colors duration-300 ${location.pathname === '/shop/women' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                            <Link to="/shop/women">WOMEN</Link>
                            <span className={`absolute -bottom-2 left-0 h-[2px] bg-white transform origin-left transition-all duration-300 ${location.pathname === '/shop/women' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </li>
                        <li className={`cursor-pointer relative group transition-colors duration-300 ${location.pathname === '/shop/kids' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                            <Link to="/shop/kids">KIDS</Link>
                            <span className={`absolute -bottom-2 left-0 h-[2px] bg-white transform origin-left transition-all duration-300 ${location.pathname === '/shop/kids' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </li>
                        <li className="text-gray-500 hover:text-white cursor-pointer transition-colors duration-300">CUSTOMISE</li>
                    </ul>
                </div>

                {/* Right side menu */}
                <div className="flex items-center space-x-6 md:space-x-8 z-50">
                    {/* Auth Area */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-white text-[13px] uppercase tracking-[0.2em] font-semibold">
                                    Welcome, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all duration-300 text-[12px] uppercase tracking-[0.1em] font-bold px-4 py-1.5 rounded-full inline-block"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300 text-[13px] uppercase tracking-[0.2em] font-semibold">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-[13px] uppercase tracking-[0.2em] font-bold px-6 py-2 rounded-full inline-block">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <Link to="/my-orders" className="text-gray-400 hover:text-white transition-colors duration-300 text-[11px] font-bold uppercase tracking-widest hidden lg:block">My Orders</Link>

                    <Link to={user ? "/profile" : "/login"} className="text-gray-400 hover:text-white transition-colors duration-300 hidden md:block">
                        {/* Improved User icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </Link>

                    {/* Cart Icon */}
                    <Link to="/cart" className="text-gray-400 hover:text-white transition-colors duration-300 relative">
                        <ShoppingBag size={24} />
                        {cart?.totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-[#0a0f1a] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0f1a]">
                                {cart.totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Rounded hamburger menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-12 h-12 lg:hidden rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-center items-center space-y-[4px] hover:bg-white/10 transition-colors duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative z-50"
                    >
                        {/* Two lines morph into an X when open */}
                        <span className={`h-[2px] bg-white block rounded-full transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-[3px]' : 'w-5 group-hover:w-6'}`}></span>
                        <span className={`h-[2px] bg-white block rounded-full transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-[3px]' : 'w-5 group-hover:w-4'}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Slide-Out Menu */}
            {/* Background Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide Panel */}
            <div className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#0a0f1a]/95 backdrop-blur-xl border-l border-white/5 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] lg:hidden flex flex-col justify-start pt-16 pb-12 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* User Profile Info on Top */}
                <div className="flex flex-col items-center mb-12 border-b border-white/10 pb-8 mx-8">
                    <Link
                        to={user ? "/profile" : "/login"}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center group"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 border-b-white/30 flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.05)] mb-4 group-hover:bg-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white/80">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-white text-sm tracking-widest uppercase font-bold text-center group-hover:text-gray-300 transition-colors">
                            {user ? `Welcome, ${user.name}` : "Welcome Guest"}
                        </span>
                    </Link>
                </div>

                <ul className="flex flex-col space-y-8 pl-12 text-sm uppercase tracking-[0.3em] font-medium flex-grow">
                    <li className={`cursor-pointer transition-colors duration-300 w-max ${location.pathname === '/' ? 'text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                        <Link to="/">HOME</Link>
                    </li>
                    <li className={`cursor-pointer transition-colors duration-300 w-max ${location.pathname === '/shop/men' ? 'text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                        <Link to="/shop/men">MEN</Link>
                    </li>
                    <li className={`cursor-pointer transition-colors duration-300 w-max ${location.pathname === '/shop/women' ? 'text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                        <Link to="/shop/women">WOMEN</Link>
                    </li>
                    <li className={`cursor-pointer transition-colors duration-300 w-max ${location.pathname === '/shop/kids' ? 'text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                        <Link to="/shop/kids">KIDS</Link>
                    </li>
                    <li className="text-gray-500 hover:text-white cursor-pointer transition-colors duration-300 w-max" onClick={() => setIsMenuOpen(false)}>CUSTOMISE</li>
                </ul>

                {/* Mobile Auth Area */}
                <div className="mt-8 pl-12 flex flex-col space-y-4 pr-12">
                    {user ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="w-full bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm uppercase tracking-[0.2em] font-bold py-3 rounded-full text-center"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full block border border-white/20 text-white hover:bg-white/10 transition-colors duration-300 text-sm uppercase tracking-[0.2em] font-semibold py-3 rounded-full text-center">
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-[0.2em] font-bold py-3 rounded-full text-center block">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;

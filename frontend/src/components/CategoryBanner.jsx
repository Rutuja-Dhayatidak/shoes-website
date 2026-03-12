import React, { useState, useEffect, useRef } from 'react';

const categoryData = {
    men: {
        title: "MEN",
        subtitle: "COLLECTION",
        description: "Elevate your everyday hustle. Discover premium materials and engineered comfort designed for the modern street.",
        accentText: "URBAN UTILITY",
        images: [
            "https://images.unsplash.com/photo-1552346154-21d32810baa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        ],
        themeColor: "from-blue-600/30"
    },
    women: {
        title: "WOMEN",
        subtitle: "COLLECTION",
        description: "Empower your stride. A curated selection of bold silhouettes and timeless elegance, crafted for uncompromising performance.",
        accentText: "FEARLESS GRACE",
        images: [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1515347619362-e68a1835fcab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        themeColor: "from-rose-500/30"
    },
    kids: {
        title: "KIDS",
        subtitle: "COLLECTION",
        description: "Built for boundless energy. Play-ready durability meets vibrant styles to support every jump, run, and adventure.",
        accentText: "ENDLESS PLAY",
        images: [
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        themeColor: "from-emerald-500/30"
    }
};

const CategoryBanner = ({ category }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const bannerRef = useRef(null);

    const activeData = categoryData[category?.toLowerCase()] || categoryData.men;

    // Crossfade Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % activeData.images.length);
        }, 5000); // 5 sec per image
        return () => clearInterval(interval);
    }, [activeData.images.length, category]);

    // Reset animations when category changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [category]);

    // Track mouse for 3D Parallax
    const handleMouseMove = (e) => {
        if (!bannerRef.current) return;
        const rect = bannerRef.current.getBoundingClientRect();
        // Calculate position relative to center [-1, 1]
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMousePos({ x, y });
    };

    return (
        <div
            ref={bannerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 0, y: 0 }); // reset layout smoothly
            }}
            className="relative w-full h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden mb-16 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/5 mx-auto max-w-7xl flex-shrink-0 bg-[#060913] grid grid-cols-1 md:grid-cols-2 group perspective-[1500px]"
        >
            {/* 1. INTERACTIVE MOUSE GLOW */}
            <div
                className={`absolute w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] rounded-full blur-[100px] pointer-events-none z-0 transition-all duration-[800ms] ease-out bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${activeData.themeColor} via-transparent to-transparent mix-blend-screen`}
                style={{
                    top: '50%', left: '50%', marginLeft: '-20vw', marginTop: '-20vw',
                    transform: `translate(${mousePos.x * 300}px, ${mousePos.y * 300}px) scale(${isHovered ? 1.2 : 1})`,
                    opacity: isHovered ? 0.8 : 0.3
                }}
            />

            {/* 2. LEFT SIDE: TYPOGRAPHY (Parallax Layer 1) */}
            <div
                className="relative z-20 flex flex-col justify-center px-10 md:px-16 lg:px-24 h-full order-2 md:order-1 bg-[#060913]/40 backdrop-blur-sm md:backdrop-blur-none md:bg-gradient-to-r from-[#060913] via-[#060913]/90 to-transparent transition-transform duration-[600ms] ease-out will-change-transform"
                style={{
                    transform: `translate(${-mousePos.x * 15}px, ${-mousePos.y * 15}px)`
                }}
            >
                {/* Massive Animated Outline Text */}
                <div className="absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90 origin-center pointer-events-none opacity-[0.04]">
                    <span
                        key={category}
                        className="text-[180px] font-black tracking-tighter uppercase whitespace-nowrap text-transparent bg-clip-text bg-white"
                        style={{ WebkitTextStroke: '2px rgba(255,255,255,1)' }}
                    >
                        {activeData.title}
                    </span>
                </div>

                {/* Staggered Text Animations */}
                <div className="relative animate-fade-in-stagger">
                    <p className="text-gray-400 text-xs md:text-sm tracking-[0.4em] uppercase mb-4 opacity-0 delay-100 fill-mode-forwards">
                        <span className="inline-block w-8 h-[1px] bg-white/30 align-middle mr-4 transition-all duration-700 group-hover:w-16"></span>
                        {activeData.accentText}
                    </p>

                    <h1
                        key={`${category}-title`}
                        className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-widest text-white leading-[0.85] mb-2 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] opacity-0 delay-200 fill-mode-forwards"
                        style={{ animation: 'slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) * 1) forwards', '--delay': '0.1s' }}
                    >
                        {activeData.title}
                    </h1>

                    <h2
                        key={`${category}-subtitle`}
                        className="text-2xl md:text-4xl font-light tracking-[0.2em] text-white/70 mb-8 font-serif italic opacity-0 fill-mode-forwards"
                        style={{ animation: 'slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) * 2) forwards', '--delay': '0.15s' }}
                    >
                        {activeData.subtitle}
                    </h2>

                    <p
                        key={`${category}-desc`}
                        className="text-gray-400 font-light text-sm md:text-base leading-relaxed tracking-wide max-w-sm border-l-2 border-white/20 pl-6 opacity-0 fill-mode-forwards transition-colors duration-500 group-hover:border-white/60"
                        style={{ animation: 'slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) * 3) forwards', '--delay': '0.2s' }}
                    >
                        {activeData.description}
                    </p>

                    <div className="mt-12 opacity-0 fill-mode-forwards" style={{ animation: 'slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) * 4) forwards', '--delay': '0.25s' }}>
                        <span className="text-white text-xs tracking-widest uppercase border-b border-white/30 pb-1 hover:text-white hover:border-white transition-all cursor-pointer relative group/btn">
                            Explore Below
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover/btn:w-full"></span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. RIGHT SIDE: 3D PARALLAX IMAGE WINDOW */}
            <div
                className="relative h-[30vh] md:h-full w-full order-1 md:order-2 overflow-hidden bg-black md:clip-path-diagonal transition-transform duration-[400ms] ease-out will-change-transform z-10"
                style={{
                    transform: `rotateX(${-mousePos.y * 8}deg) rotateY(${mousePos.x * 8}deg) scale(1.05)`
                }}
            >
                {/* Gradient blend */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-[#060913]/30 to-[#060913] z-10 pointer-events-none"></div>

                {/* Crossfading Images */}
                {activeData.images.map((src, idx) => (
                    <img
                        key={`${category}-${idx}`}
                        src={src}
                        alt={`${activeData.title} lifestyle imagery`}
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[2000ms] ease-[cubic-bezier(0.33,1,0.68,1)] ${idx === currentImageIndex
                                ? 'opacity-80 scale-100 blur-0'
                                : 'opacity-0 scale-110 blur-[4px]'
                            }`}
                        style={{
                            /* Extremely subtle ken-burns continuous movement combined with parallax */
                            animation: idx === currentImageIndex ? 'slow-zoom 15s linear forwards' : 'none',
                            transformOrigin: `${50 + (mousePos.x * 10)}% ${50 + (mousePos.y * 10)}%`
                        }}
                    />
                ))}

                {/* Floating Decorative Elements tied to mouse */}
                <div
                    className="absolute top-1/4 left-1/4 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 pointer-events-none z-20 transition-transform duration-700"
                    style={{ transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px) rotate(45deg)` }}
                />

                {/* Slide Indicators */}
                <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 z-20 flex space-x-3">
                    {activeData.images.map((_, idx) => (
                        <span
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`block h-[2px] cursor-pointer transition-all duration-700 ${idx === currentImageIndex ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-4 bg-white/20 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            {/* CSS Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-up-fade {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-stagger > * {
                    /* Initial state handled by inline styles/classes */
                }
                .fill-mode-forwards {
                    animation-fill-mode: forwards !important;
                }
                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.08); }
                }
                @media (min-width: 768px) {
                    .clip-path-diagonal {
                        clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
                    }
                }
            `}} />
        </div>
    );
};

export default CategoryBanner;

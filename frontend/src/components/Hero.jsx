import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Truck, RefreshCcw, Headphones, Database } from 'lucide-react';

const Hero = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const shoes = [
        {
            id: 1,
            name: "AIR MAX",
            subName: "INFINITY",
            image: "https://github.com/shoes/shoes4/blob/main/app/orange-shoe.png?raw=true",
            glowColor: "from-blue-600/30",
            offset: "-translate-y-6"
        },
        {
            id: 2,
            name: "AIR JORDAN",
            subName: "RETRO",
            image: "https://github.com/shoes/shoes4/blob/main/app/grey-shoe.png?raw=true",
            glowColor: "from-red-600/30",
            offset: "-translate-y-2"
        },
        {
            id: 3,
            name: "NIKE DUNK",
            subName: "LOW PANDA",
            image: "https://github.com/shoes/shoes4/blob/main/app/red-shoe.png?raw=true",
            glowColor: "from-gray-400/30",
            offset: "-translate-y-0"
        }
    ];

    const features = [
        { icon: <Truck size={24} />, title: "Free Delivery", desc: "Free Shipping on all order" },
        { icon: <RefreshCcw size={24} />, title: "Return Policy", desc: "Free Shipping on all order" },
        { icon: <Headphones size={24} />, title: "24/7 Support", desc: "Free Shipping on all order" },
        { icon: <Database size={24} />, title: "Secure Payment", desc: "Free Shipping on all order" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % shoes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [shoes.length]);

    const handlers = useSwipeable({
        onSwipedLeft: () => setActiveSlide((prev) => (prev + 1) % shoes.length),
        onSwipedRight: () => setActiveSlide((prev) => (prev - 1 + shoes.length) % shoes.length),
        swipeDuration: 500,
        delta: 20, /* Minimum distance in pixels to count as a swipe */
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    return (
        <div {...handlers} style={{ touchAction: 'pan-y' }} className="relative w-full min-h-screen bg-gradient-to-br from-black via-[#0a0f1a] to-[#0d1627] overflow-hidden font-sans text-white select-none flex flex-col">

            {/* Main Hero Area */}
            <div className="relative w-full h-screen flex-shrink-0">
                {/* Soft spotlight glow behind product */}
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-[2s] ease-in-out bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${shoes[activeSlide].glowColor} via-transparent to-transparent opacity-80 z-0`}
                />

                {/* Large bold typography in background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <h1
                        className="text-[25vw] md:text-[22vw] font-black text-white/5 tracking-tighter whitespace-nowrap transition-all duration-[1.5s] ease-out will-change-transform"
                        key={activeSlide}
                        style={{ animation: 'text-reveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                    >
                        {shoes[activeSlide].name}
                    </h1>
                </div>



                {/* 👟 Hero Section Layout - Center */}
                <div className="relative z-10 w-full h-[90%] flex flex-col justify-center items-center px-4">

                    {/* Floating 3D Shoe Area */}
                    <div className="relative w-full max-w-5xl h-[55vh] flex justify-center items-center perspective-[2000px] mt-10">

                        {/* Circular podium platform */}
                        <div className="absolute bottom-4 md:bottom-12 w-[280px] h-[280px] md:w-[450px] md:h-[450px] border border-white/5 rounded-full flex items-center justify-center pointer-events-none">
                            {/* Inner rings */}
                            <div className="w-[85%] h-[85%] border border-white/5 rounded-full flex items-center justify-center">
                                <div className="w-[85%] h-[85%] border border-white/5 rounded-full"></div>
                            </div>
                            {/* Soft shadow under shoe placed on the floor */}
                            <div className="absolute -bottom-8 md:-bottom-4 w-[60%] h-10 bg-black/80 rounded-[100%] blur-xl shadow-[0_0_60px_rgba(255,255,255,0.05)]"></div>
                        </div>

                        {/* Animated Slider Render */}
                        {shoes.map((shoe, idx) => (
                            <div
                                key={shoe.id}
                                className={`absolute top-1/2 left-1/2 flex justify-center items-center w-full transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] ${idx === activeSlide
                                    ? 'opacity-100 scale-100 z-20 ' + shoe.offset
                                    : 'opacity-0 scale-75 z-10'
                                    }`}
                                style={{
                                    transform: idx === activeSlide
                                        ? 'translate(-50%, -50%) rotate(0deg)'
                                        : (idx < activeSlide ? 'translate(-80%, -40%) rotate(-15deg)' : 'translate(-20%, -60%) rotate(15deg)')
                                }}
                            >
                                {/* Large floating sneaker (3D effect) */}
                                <img
                                    src={shoe.image}
                                    alt={shoe.name}
                                    className={`w-[90%] md:w-[70%] lg:w-[60%] object-contain drop-shadow-[0_45px_35px_rgba(0,0,0,0.6)] ${idx === activeSlide ? 'animate-custom-float' : ''}`}
                                    style={{ transform: 'rotate(-25deg) scale(1.1)' }}
                                />
                            </div>
                        ))}

                        {/* Luxury Text Info Overlays near shoe */}
                        <div className="absolute top-10 right-10 hidden md:block text-right pointer-events-none">
                            <p className="text-gray-400 text-[10px] tracking-[0.4em] uppercase mb-1">Edition</p>
                            <p className="text-xl tracking-[0.3em] font-light text-white/90">{shoes[activeSlide].subName}</p>
                        </div>
                        <div className="absolute bottom-10 left-10 hidden md:block text-left pointer-events-none">
                            <p className="text-gray-400 text-[10px] tracking-[0.4em] uppercase mb-1">Status</p>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-sm tracking-[0.2em] font-light text-white/90">AVAILABLE</p>
                            </div>
                        </div>

                    </div>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
                        {shoes.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                                className={`h-[3px] rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-4 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* 📌 Info Sections - Left Bottom & Right Bottom */}
                <div className="absolute bottom-6 left-0 w-full px-8 md:px-16 flex justify-between items-end z-40">
                    {/* Left Bottom Info Section */}
                    <div className="flex items-center space-x-5 group cursor-pointer glassmorphism-box p-4 rounded-3xl md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none transition-transform hover:-translate-y-1 duration-500">
                        {/* Small icon */}
                        <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex flex-shrink-0 items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        {/* Text */}
                        <div className="hidden md:flex flex-col text-sm">
                            <span className="text-white/90 font-medium uppercase tracking-widest text-[10px] mb-1 group-hover:text-white transition-colors">
                                Check out discounts at offline stores
                            </span>
                            <span className="text-gray-500 font-light tracking-wide text-[11px]">
                                New releases available
                            </span>
                        </div>
                    </div>

                    {/* Right Bottom Info Section */}
                    <div className="flex items-center space-x-5 group cursor-pointer glassmorphism-box p-4 rounded-3xl md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none transition-transform hover:-translate-y-1 duration-500 text-right">
                        {/* Text */}
                        <div className="hidden md:flex flex-col text-sm mr-2">
                            <span className="text-white/90 font-medium uppercase tracking-widest text-[10px] mb-1 group-hover:text-white transition-colors">
                                3187 Mars Avenue, CA
                            </span>
                            <span className="text-gray-500 font-light tracking-wide text-[11px]">
                                5 minutes from IKEA Store
                            </span>
                        </div>
                        {/* Small icon */}
                        <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex flex-shrink-0 items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 Animated Features Section */}
            <div className="relative z-40 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-16 glassmorphism-box text-white mb-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-fade-in-up border border-white/5 mx-4 md:mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center text-center px-6 py-8 group cursor-pointer bg-white/5 rounded-3xl hover:bg-white/10 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] border border-transparent hover:border-white/10 z-10"
                            style={{ animation: `fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(idx + 1) * 0.15}s both` }}
                        >
                            {/* Animated Icon Container */}
                            <div className="relative w-16 h-16 mb-5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-700 group-hover:scale-[1.15] group-hover:rotate-[360deg] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                                {/* Glow reflection behind icon inside the circle */}
                                <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-700 blur-[4px]"></div>
                                <div className="z-10 relative">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-[15px] font-bold tracking-[0.15em] text-white/90 mb-2 uppercase group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                            <p className="text-xs text-gray-500 font-light tracking-wide group-hover:text-gray-300 transition-colors duration-300">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Embedded Styles for custom animations and glassmorphism */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes custom-float {
          0%, 100% { transform: scale(1.1) rotate(-25deg) translateY(0px); }
          50% { transform: scale(1.1) rotate(-22deg) translateY(-25px); }
        }
        .animate-custom-float {
          animation: custom-float 6s ease-in-out infinite;
        }
        @keyframes text-reveal {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); filter: blur(0px); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .perspective-\\[2000px\\] {
          perspective: 2000px;
        }
        .glassmorphism-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        /* Ensures smooth scroll snap behavior for mobile if needed */
        html { scroll-behavior: smooth; }
      `}} />
        </div>
    );
};

export default Hero;

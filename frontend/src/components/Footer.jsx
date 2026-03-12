import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#0a0f1a] text-white pt-10 pb-10 border-t border-white/10 relative z-50 overflow-hidden">

            {/* Animated Marquee Tape */}
            <div className="w-full overflow-hidden border-y border-white/5 bg-white/[0.02] py-4 mb-20 relative flex items-center shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                {/* Fade edges to smooth the start/end of the marquee visually */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0f1a] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0f1a] to-transparent z-10 pointer-events-none"></div>

                <div className="flex animate-marquee whitespace-nowrap text-white/30 text-[10px] md:text-sm font-black tracking-[0.4em] uppercase w-max">
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Elevate Your Game</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Step Into The Future</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Premium Collection</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Elevate Your Game</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Step Into The Future</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Premium Collection</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Elevate Your Game</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Step Into The Future</span>
                    <span className="mx-8 text-white/10">•</span>
                    <span className="mx-8 hover:text-white transition-colors duration-300 cursor-default">Premium Collection</span>
                    <span className="mx-8 text-white/10">•</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-start gap-12">

                {/* Brand & About */}
                <div className="w-full md:w-1/3 flex flex-col space-y-6">
                    <div className="font-extrabold text-3xl tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white animate-shimmer bg-[length:200%_auto] cursor-pointer inline-block w-max">
                        Brand<span className="text-white/40">.</span>
                    </div>
                    <p className="text-gray-400 font-light text-sm leading-relaxed max-w-sm group">
                        <span className="group-hover:text-white/80 transition-colors duration-500">Elevate your game with our premium collection of innovative footwear.</span> Engineered for peak performance and unparalleled style.
                    </p>
                    {/* Social Icons */}
                    <div className="flex items-center space-x-5 pt-2">
                        {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
                            <a key={idx} href="#" className="relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-500 group overflow-hidden bg-white/5">
                                {/* Glow element behind icon */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-500 ease-out rounded-full blur-md"></div>
                                <div className="absolute inset-0 border border-white/50 rounded-full scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
                                <Icon size={18} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="w-full md:w-1/6 flex flex-col space-y-4">
                    <h4 className="text-white uppercase tracking-widest font-semibold text-sm mb-2 opacity-80">Shop</h4>
                    <ul className="flex flex-col space-y-4 text-sm text-gray-400 font-light">
                        {['New Arrivals', "Men's Shoes", "Women's Shoes", "Kids Collection", "Customise"].map((link, i) => (
                            <li key={i}>
                                <a href="#" className="relative inline-block hover:text-white transition-colors duration-300 group pb-1">
                                    {link}
                                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full md:w-1/6 flex flex-col space-y-4">
                    <h4 className="text-white uppercase tracking-widest font-semibold text-sm mb-2 opacity-80">Support</h4>
                    <ul className="flex flex-col space-y-4 text-sm text-gray-400 font-light">
                        {['Order Status', 'Shipping & Delivery', 'Returns', 'Payment Options', 'Contact Us'].map((link, i) => (
                            <li key={i}>
                                <a href="#" className="relative inline-block hover:text-white transition-colors duration-300 group pb-1">
                                    {link}
                                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Store Location */}
                <div className="w-full md:w-1/4 flex flex-col space-y-4">
                    <h4 className="text-white uppercase tracking-widest font-semibold text-sm mb-2 opacity-80">Find a Store</h4>
                    <div className="glassmorphism-box p-6 rounded-2xl flex items-start space-x-4 group hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-pointer border border-white/5 hover:border-white/20 hover:-translate-y-1">
                        <div className="mt-1 text-gray-400 group-hover:text-white group-hover:animate-bounce transition-colors duration-300">
                            <MapPin size={22} />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <span className="text-white font-medium text-sm tracking-wide group-hover:text-white transition-colors">Main Flagship Store</span>
                            <span className="text-gray-400 font-light text-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                                3187 Mars Avenue,<br />
                                California, CA 90210
                            </span>
                            <a href="#" className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 group-hover:text-white mt-3 relative inline-block w-max transition-all font-semibold before:absolute before:left-0 before:bottom-[-2px] before:w-full before:h-[1px] before:bg-white/30 group-hover:before:bg-white">
                                Get Directions <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">→</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="max-w-7xl mx-auto px-8 md:px-16 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-[0.2em]">
                <p className="hover:text-white transition-colors duration-500 cursor-pointer">&copy; {new Date().getFullYear()} Brand Inc. All Rights Reserved.</p>
                <div className="flex space-x-8 mt-6 md:mt-0">
                    <a href="#" className="hover:text-white relative group transition-colors duration-300">Privacy Policy
                        <span className="absolute left-1/2 -bottom-2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    </a>
                    <a href="#" className="hover:text-white relative group transition-colors duration-300">Terms of Use
                        <span className="absolute left-1/2 -bottom-2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    </a>
                </div>
            </div>

            {/* Embedded Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .glassmorphism-box {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-shimmer {
          animation: shimmer 4s linear infinite;
        }
      `}} />
        </footer>
    );
};

export default Footer;

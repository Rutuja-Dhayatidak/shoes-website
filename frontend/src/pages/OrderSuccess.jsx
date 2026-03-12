import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
  const { id } = useParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6 pt-32">
        <div className={`max-w-lg w-full text-center transition-all duration-1000 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-20 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <CheckCircle size={64} className="text-green-500" />
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-4">ORDER PLACED!</h1>
          <p className="text-xl text-gray-400 mb-8 font-medium">Thank you for your purchase. We've received your order and are processing it.</p>

          <div className="bg-white/5 rounded-[32px] p-6 mb-12 border border-white/5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-sm font-mono text-blue-400 break-all">{id}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile" className="flex-1 flex items-center justify-center gap-2 bg-blue-500 py-5 rounded-3xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-blue-500/20">
              <Package size={20} /> VIEW ORDERS
            </Link>
            <Link to="/shop/men" className="flex-1 flex items-center justify-center gap-2 bg-white/5 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
              <ShoppingBag size={20} /> SHOP MORE <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;

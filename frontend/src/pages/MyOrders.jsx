import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../services/checkoutService';
import { Package, ChevronRight, Clock, MapPin, CheckCircle, Truck, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:3000";
  const toUrl = (path) => path && (path.startsWith("http") ? path : `${BASE}${path}`);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      if (res.success) setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-400 bg-green-400/10';
      case 'Shipped': return 'text-blue-400 bg-blue-400/10';
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'Cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-white/5';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 lg:px-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-black mb-12 tracking-tight">ORDER HISTORY</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/5">
            <Package size={64} className="mx-auto text-gray-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Ready to start your collection?</p>
            <a href="/shop/men" className="bg-white text-[#0a0f1a] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-all">Shop Now</a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-500">
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-white/5">
                  <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                      <Package size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Order Date</p>
                      <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-mono text-sm text-blue-400">{order._id}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-xl font-black">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid gap-6">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img src={toUrl(item.image)} className="w-12 h-12 rounded-lg object-contain bg-[#131e35] p-1" alt="" />
                      <div className="flex-grow">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-black">{item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] p-6 px-8 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus === 'Delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {order.orderStatus}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-gray-500">
                      <MapPin size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </div>
                  </div>
                  <button className="text-xs font-bold uppercase tracking-widest text-blue-500 flex items-center gap-1 hover:gap-2 transition-all">
                    Track Order <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;

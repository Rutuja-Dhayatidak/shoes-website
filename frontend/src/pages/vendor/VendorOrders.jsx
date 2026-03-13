import React, { useState, useEffect } from 'react';
import { getVendorOrders } from '../../api/vendorApi';
import { ShoppingBag, Calendar, User, MapPin, Package, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { getSafeImageUrl } from '../../api/axiosInstance';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const toUrl = (path) => getSafeImageUrl(path);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getVendorOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Fetching Your Orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
        <p className="text-gray-500">When customers buy your products, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Recent Orders <span className="text-cyan-500 text-sm ml-2">({orders.length})</span></h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {orders.map((order) => (
          <div key={order._id} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all group">
            <div className="p-6 sm:p-8">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl shrink-0">
                    <ShoppingBag className="text-cyan-400" size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Order ID</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-white font-mono text-sm truncate">#{order._id.slice(-8).toUpperCase()}</p>
                      <Link to={`/vendor/order/${order._id}`} className="text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                        <ExternalLink size={12} /> Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Date</p>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Calendar size={14} className="text-cyan-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status</p>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-500'
                      }`}>
                      {order.orderStatus === 'Delivered' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {order.orderStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Product Info */}
                <div className="space-y-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Ordered Items</p>
                  {order.vendorProducts.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group/item">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={toUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm tracking-wide truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.1em]">Q: {item.quantity} | Size: {item.size}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-black">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Shipping & Customer Info */}
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-[24px] border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                      <User size={14} className="text-cyan-500" />
                      Customer
                    </div>
                    <p className="text-white font-bold tracking-wide">{order.shippingAddress.name}</p>
                    <p className="text-gray-400 text-sm mt-1">{order.shippingAddress.phone}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-[24px] border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                      <MapPin size={14} className="text-cyan-500" />
                      Address
                    </div>
                    <p className="text-white text-sm leading-relaxed tracking-wide">
                      {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-white/5 px-8 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Payment:</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
                  {order.paymentMethod} • {order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Your Revenue:</span>
                <span className="text-2xl font-black text-cyan-400 tracking-tighter">
                  ₹{order.vendorProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrders;

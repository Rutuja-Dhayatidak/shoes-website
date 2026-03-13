import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorOrderDetails, updateVendorOrderStatus, updateVendorPaymentStatus } from '../../api/vendorApi';
import {
  ShoppingBag, Calendar, User, MapPin, Package, CheckCircle, Clock,
  ArrowLeft, Truck, Box, CheckSquare, XCircle, CreditCard
} from 'lucide-react';
import { toast } from 'react-toastify';

import { IMAGE_BASE_URL } from '../../api/axiosInstance';

const VendorOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const toUrl = (path) => path && (path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await getVendorOrderDetails(orderId);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
      navigate('/vendor-dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = async (nextStatus) => {
    try {
      setActionLoading(true);
      const res = await updateVendorOrderStatus(orderId, nextStatus);
      if (res.success) {
        toast.success(`Order marked as ${nextStatus}`);
        setOrder(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      setActionLoading(true);
      const res = await updateVendorPaymentStatus(orderId);
      if (res.success) {
        toast.success("Payment marked as received");
        setOrder(res.data);
      }
    } catch (error) {
      toast.error("Failed to update payment");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const getActionConfig = () => {
    switch (order.orderStatus) {
      case 'Pending': return { next: 'Confirmed', label: 'Confirm Order', icon: <CheckCircle /> };
      case 'Confirmed': return { next: 'Packed', label: 'Pack Order', icon: <Box /> };
      case 'Packed': return { next: 'Shipped', label: 'Ship Order', icon: <Truck /> };
      case 'Shipped': return { next: 'OutForDelivery', label: 'Out For Delivery', icon: <Package /> };
      case 'OutForDelivery': return { next: 'Delivered', label: 'Mark Delivered', icon: <CheckSquare /> };
      default: return null;
    }
  };

  const action = getActionConfig();
  const timelineSteps = ["Pending", "Confirmed", "Packed", "Shipped", "OutForDelivery", "Delivered"];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-10 font-sans">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-8 uppercase tracking-widest text-xs font-bold">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px]">
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="text-cyan-500" size={20} />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter uppercase text-white">ORDER DETAILS</h1>
            </div>
            <p className="text-gray-500 font-mono text-xs sm:text-sm">#{order._id.toUpperCase()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
              <button
                onClick={() => handleStatusUpdate('Cancelled')}
                disabled={actionLoading}
                className="flex-1 lg:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                Cancel Order
              </button>
            )}
            {action && (
              <button
                onClick={() => handleStatusUpdate(action.next)}
                disabled={actionLoading}
                className="flex-[2] lg:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 text-[#0a0f1a] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                {actionLoading ? <div className="h-4 w-4 border-2 border-t-transparent border-[#0a0f1a] rounded-full animate-spin" /> : <>{action.icon} {action.label}</>}
              </button>
            )}
            {order.orderStatus === 'Delivered' && order.paymentMethod === 'COD' && order.paymentStatus === 'Pending' && (
              <button
                onClick={handlePaymentUpdate}
                disabled={actionLoading}
                className="w-full lg:w-auto px-6 py-4 bg-green-500 text-[#0a0f1a] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                <CreditCard size={16} /> MARK PAYMENT RECEIVED
              </button>
            )}
          </div>
        </div>

        {/* Timeline UI */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-[32px] sm:rounded-[40px]">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 text-center">Execution Roadmap</h3>

          <div className="hidden md:flex justify-between items-center max-w-4xl mx-auto relative px-4">
            <div className="absolute h-0.5 bg-white/10 left-0 right-0 top-1/2 -translate-y-1/2 -z-10" />
            {timelineSteps.map((step, idx) => {
              const currentIdx = timelineSteps.indexOf(order.orderStatus);
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              const history = order.statusHistory?.find(h => h.status === step);

              return (
                <div key={idx} className="flex flex-col items-center gap-3 bg-[#0a0f1a] px-2 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-cyan-500 text-[#0a0f1a]' : 'bg-white/5 text-gray-700'}`}>
                    {isCompleted ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-white' : 'text-gray-600'}`}>
                    {step}
                  </p>
                  {history && <p className="absolute -bottom-6 text-[8px] text-gray-500 whitespace-nowrap">{new Date(history.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                </div>
              );
            })}
          </div>

          <div className="md:hidden space-y-6 max-w-xs mx-auto">
            {timelineSteps.map((step, idx) => {
              const currentIdx = timelineSteps.indexOf(order.orderStatus);
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              const history = order.statusHistory?.find(h => h.status === step);

              return (
                <div key={idx} className="flex items-center gap-4 relative">
                  {idx !== timelineSteps.length - 1 && (
                    <div className={`absolute left-4 top-10 w-0.5 h-6 -z-10 ${isCompleted ? 'bg-cyan-500/30' : 'bg-white/5'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-cyan-500 text-[#0a0f1a]' : 'bg-white/5 text-gray-700'}`}>
                    {isCompleted ? <CheckCircle size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-white' : 'text-gray-600'}`}>
                      {step}
                    </p>
                    {history && <p className="text-[8px] text-gray-500 mt-1">{new Date(history.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px]">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-500">
                <Package className="text-cyan-500" size={16} /> Items Overview
              </h3>
              <div className="space-y-4">
                {order.vendorProducts?.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white/5 rounded-[24px] sm:rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                      <img src={toUrl(p.image)} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm sm:text-lg text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Size: {p.size} | Qty: {p.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base sm:text-xl font-black text-cyan-400">₹{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px]">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-gray-500">Customer Intelligence</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 shrink-0"><User size={20} /></div>
                <div className="min-w-0">
                  <p className="font-bold text-white tracking-wide truncate">{order.shippingAddress.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px]">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-gray-500">Delivery Vector</h3>
              <div className="flex gap-4">
                <MapPin className="text-cyan-500 shrink-0 mt-1" size={18} />
                <p className="text-gray-400 text-sm leading-relaxed tracking-wide">
                  {order.shippingAddress.address},<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
              <div className="mt-6">
                <span className="px-3 py-1.5 bg-cyan-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-500 border border-cyan-500/20">
                  {order.shippingAddress.type} Location
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-white/10 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-all py-10" />
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50 relative z-10">Net Revenue</h3>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter relative z-10">
                ₹{order.vendorProducts?.reduce((s, p) => s + (p.price * p.quantity), 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-6 text-[10px] font-bold text-cyan-400 uppercase tracking-widest relative z-10">
                <CreditCard size={14} /> {order.paymentMethod} • {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOrderDetails;

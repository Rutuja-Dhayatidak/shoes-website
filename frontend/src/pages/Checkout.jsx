import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, Plus, Trash2, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { getAddresses, addAddress, createOrder, createRazorpayOrder, verifyPayment } from '../services/checkoutService';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const { cart, clearUserCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'Razorpay' or 'COD'
  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', pincode: '', state: '', city: '', address: '', type: 'Home'
  });

  useEffect(() => {
    fetchAddresses();
    if (cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart]);

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      if (res.success) setAddresses(res.data);
    } catch (e) { console.error(e); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addAddress(newAddress);
      if (res.success) {
        toast.success("Address added");
        setAddresses([...addresses, res.data]);
        setShowAddressForm(false);
        setNewAddress({ name: '', phone: '', pincode: '', state: '', city: '', address: '', type: 'Home' });
      }
    } catch (e) { toast.error("Failed to add address"); }
    finally { setLoading(false); }
  };

  const handleCODOrder = async () => {
    try {
      setLoading(true);
      const res = await createOrder({
        products: cart.items.map(item => ({
          productId: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          image: item.productImage
        })),
        shippingAddress: selectedAddress,
        paymentMethod: 'COD',
        totalAmount: cart.totalAmount
      });

      if (res.success) {
        toast.success("Order Placed Successfully!");
        clearUserCart();
        navigate(`/order-success/${res.data._id}`);
      }
    } catch (e) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // 1. Create Internal Order
      const orderRes = await createOrder({
        products: cart.items.map(item => ({
          productId: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          image: item.productImage
        })),
        shippingAddress: selectedAddress,
        paymentMethod: 'Razorpay',
        totalAmount: cart.totalAmount
      });

      if (!orderRes.success) throw new Error("Order creation failed");
      const dbOrder = orderRes.data;

      // 2. Create Razorpay Order
      const rzpRes = await createRazorpayOrder(cart.totalAmount);
      if (!rzpRes.success) throw new Error("Razorpay order failed");

      // 3. Load SDK and Open
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key: 'rzp_test_placeholder', // Should come from env in production
        amount: rzpRes.data.amount,
        currency: 'INR',
        name: 'Brand.',
        description: 'Order Payment',
        order_id: rzpRes.data.razorpayOrderId,
        handler: async (response) => {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: dbOrder._id
          };
          const verifyRes = await verifyPayment(verifyData);
          if (verifyRes.success) {
            toast.success("Payment Successful!");
            clearUserCart();
            navigate(`/order-success/${dbOrder._id}`);
          }
        },
        prefill: {
          name: selectedAddress.name,
          contact: selectedAddress.phone
        },
        theme: { color: '#4f8ef7' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (e) {
      toast.error(e.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white pt-32 pb-20 px-4 md:px-8 lg:px-16">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-16 gap-4">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= i ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(79,142,247,0.4)]' : 'bg-white/5 text-gray-500'}`}>
                {step > i ? <CheckCircle size={20} /> : i}
              </div>
              {i < 3 && <div className={`h-1 w-20 rounded-full transition-all duration-500 ${step > i ? 'bg-blue-500' : 'bg-white/5'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black tracking-tight">Select Address</h2>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all">
                    {showAddressForm ? <ArrowLeft size={14} /> : <Plus size={14} />} {showAddressForm ? 'Back' : 'New Address'}
                  </button>
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="bg-white/5 p-8 rounded-[32px] border border-white/5 grid grid-cols-2 gap-4">
                    <input className="col-span-2 bg-transparent border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Full Name" required value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
                    <input className="bg-transparent border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Phone Number" required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                    <input className="bg-transparent border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Pincode" required value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                    <input className="bg-transparent border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                    <input className="bg-transparent border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="State" required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                    <textarea className="col-span-2 bg-transparent border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Complete Address" rows="3" required value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
                    <div className="col-span-2 flex gap-4">
                      {['Home', 'Work'].map(t => (
                        <button key={t} type="button" onClick={() => setNewAddress({ ...newAddress, type: t })} className={`px-6 py-2 rounded-xl text-xs font-bold border transition-all ${newAddress.type === t ? 'bg-blue-500 border-blue-500' : 'border-white/10'}`}>{t}</button>
                      ))}
                    </div>
                    <button type="submit" className="col-span-2 bg-white text-[#0a0f1a] py-4 rounded-2xl font-black mt-4 hover:bg-gray-200 transition-colors">SAVE ADDRESS</button>
                  </form>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map(addr => (
                      <div key={addr._id} onClick={() => setSelectedAddress(addr)} className={`p-6 rounded-[28px] border transition-all cursor-pointer relative group ${selectedAddress?._id === addr._id ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_30px_rgba(79,142,247,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-gray-400 font-bold mb-2 inline-block uppercase">{addr.type}</span>
                            <p className="font-bold text-lg mb-1">{addr.name}</p>
                            <p className="text-gray-400 text-sm mb-1">{addr.phone}</p>
                            <p className="text-gray-400 text-sm leading-relaxed">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                          {selectedAddress?._id === addr._id && <CheckCircle className="text-blue-500" />}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => selectedAddress ? setStep(2) : toast.info("Select an address")} className="mt-8 bg-blue-500 py-5 rounded-[24px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/20">CONTINUE TO SUMMARY</button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black mb-8">Order Summary</h2>
                <div className="bg-white/5 rounded-[40px] border border-white/5 p-8 mb-8">
                  {cart.items.map(item => (
                    <div key={item.productId} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                      <img src={item.productImage} className="w-16 h-16 rounded-xl object-contain bg-[#131e35] p-2" />
                      <div className="flex-grow">
                        <p className="font-bold">{item.productName}</p>
                        <p className="text-xs text-gray-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-500/5 p-6 rounded-[24px] border border-blue-500/20 flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Selected Address</p>
                    <p className="text-sm font-bold">{selectedAddress?.name}</p>
                    <p className="text-xs text-gray-500">{selectedAddress?.address}, {selectedAddress?.city}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-blue-500 text-xs font-bold uppercase underline">Change</button>
                </div>
                <button onClick={() => setStep(3)} className="w-full bg-blue-500 py-5 rounded-[24px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/20">PROCEED TO PAYMENT</button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-8">
                  <CreditCard size={48} className="text-blue-500" />
                </div>
                <h2 className="text-4xl font-black mb-4">Payment Method</h2>
                <p className="text-gray-500 mb-12 max-w-sm">Select how you'd like to pay for your order.</p>

                <div className="w-full max-w-sm space-y-4">
                  <button onClick={() => setPaymentMethod('Razorpay')} className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between ${paymentMethod === 'Razorpay' ? 'bg-blue-500/10 border-blue-500' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <CreditCard className={paymentMethod === 'Razorpay' ? 'text-blue-500' : 'text-gray-500'} />
                      <span className="font-bold">Razorpay (Online)</span>
                    </div>
                    {paymentMethod === 'Razorpay' && <CheckCircle className="text-blue-500" />}
                  </button>

                  <button onClick={() => setPaymentMethod('COD')} className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between ${paymentMethod === 'COD' ? 'bg-blue-500/10 border-blue-500' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <ShoppingBag className={paymentMethod === 'COD' ? 'text-blue-500' : 'text-gray-500'} />
                      <span className="font-bold">Cash on Delivery</span>
                    </div>
                    {paymentMethod === 'COD' && <CheckCircle className="text-blue-500" />}
                  </button>

                  <button onClick={paymentMethod === 'COD' ? handleCODOrder : handlePayment} disabled={loading || !paymentMethod} className="w-full bg-blue-500 py-5 rounded-[24px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 mt-8">
                    {loading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" /> : <><CheckCircle /> PLACE ORDER</>}
                  </button>
                  <button onClick={() => setStep(2)} className="w-full text-gray-500 font-bold uppercase text-xs tracking-widest">Back to summary</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><ShoppingBag size={20} /> PRICE DETAILS</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-400"><span>Price ({cart.totalItems} items)</span><span>₹{cart.totalAmount.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>Shipping</span><span className="text-green-400 font-bold">FREE</span></div>
                <div className="h-px bg-white/5 my-4"></div>
                <div className="flex justify-between text-2xl font-black"><span>Total</span><span className="text-blue-500">₹{cart.totalAmount.toLocaleString()}</span></div>
              </div>
              <div className="mt-8 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl text-[10px] text-green-400 font-bold text-center uppercase tracking-widest">
                You're saving ₹0 on this order
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { addOrder } from '../store/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { Order, DeliveryMode } from '../types';

const Checkout: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery_partner');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fee calculation logic
  const subtotal = cart.total;
  const tax = Math.round(subtotal * 0.05); // 5% platform fee/tax
  const deliveryFee = deliveryMode === 'self_pickup' ? 0 : 40;
  const grandTotal = subtotal + tax + deliveryFee;

  const handlePlaceOrder = () => {
    if (!user) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: 'ord-' + Math.random().toString(36).substr(2, 9),
        customerName: user.name,
        kitchenName: cart.kitchenName || 'Unknown Kitchen',
        items: cart.items,
        deliveryMode: deliveryMode,
        subscriptionType: 'none',
        pricingBreakdown: {
          itemTotal: subtotal,
          tax: tax,
          deliveryFee: deliveryFee,
          finalTotal: grandTotal
        },
        status: 'placed',
        date: new Date().toISOString(),
        address: 'Hostel 7, Room 302, Sector 15'
      };

      dispatch(addOrder(newOrder));
      dispatch(clearCart());
      setIsProcessing(false);
      navigate('/dashboard');
      alert('Order placed! View your receipt in the Orders tab.');
    }, 1500);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <span className="text-8xl mb-8 animate-pulse">🍜</span>
        <h2 className="text-3xl font-black font-brand">Your Bag is Empty</h2>
        <p className="text-gray-500 mt-2 mb-10 max-w-xs text-center">Fuel your body with home-cooked goodness. Discover Aunties nearby!</p>
        <button onClick={() => navigate('/dashboard')} className="bg-orange-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-100 transform active:scale-95">Discover Food</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-black mb-12 font-brand text-gray-900 tracking-tight">Checkout</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Delivery Mode Toggle */}
          <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-xl mb-6">How will you get your food?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setDeliveryMode('delivery_partner')}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${deliveryMode === 'delivery_partner' ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
              >
                <span className="text-2xl">🚴</span>
                <span className="font-bold text-sm">Delivery to Me</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">+₹40 FEE</span>
              </button>
              <button 
                onClick={() => setDeliveryMode('self_pickup')}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${deliveryMode === 'self_pickup' ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
              >
                <span className="text-2xl">🏃</span>
                <span className="font-bold text-sm">Self Pickup</span>
                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">FREE</span>
              </button>
            </div>
          </section>

          {/* Item Review */}
          <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-xl mb-6">Review Items from {cart.kitchenName}</h3>
            <div className="space-y-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-black text-gray-900">{item.name}</p>
                    <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-lg font-bold">Qty: {item.qty}</span>
                        {item.calories && <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-lg font-bold">{item.calories} KCAL</span>}
                    </div>
                  </div>
                  <p className="font-black text-gray-900 text-lg">₹{item.qty * item.price}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bill Summary Sticky Sidebar */}
        <div className="relative">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl lg:sticky lg:top-24">
            <h4 className="font-black text-xl mb-8">Bill Summary</h4>
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-gray-500 font-bold text-sm">
                <span>Items Subtotal</span>
                <span className="text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-sm">
                <span>Platform Fee & Taxes</span>
                <span className="text-gray-900">₹{tax}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-sm">
                <span>Delivery Charge</span>
                <span className={deliveryFee === 0 ? "text-green-600" : "text-gray-900"}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="font-black text-lg">Total Amount</span>
                <span className="font-black text-3xl text-orange-600">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full bg-orange-600 text-white font-black py-6 rounded-[2rem] transition-all shadow-xl shadow-orange-100 flex items-center justify-center transform active:scale-95 group ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-700 hover:shadow-2xl'}`}
            >
              {isProcessing ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="uppercase tracking-[0.2em] text-xs">Confirm & Pay</span>
              )}
            </button>
            
            <p className="text-[9px] text-center mt-6 text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              Secured with 256-bit SSL encryption. <br /> Trusted by 5000+ Students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

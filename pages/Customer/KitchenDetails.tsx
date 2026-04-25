
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';

const KitchenDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mock data for the specific kitchen
  const kitchen = {
    id: id,
    name: 'Sharmaji Ki Kitchen',
    rating: 4.8,
    reviews: 128,
    image: 'https://picsum.photos/seed/kitchen1/1200/400',
    todayMenu: {
      type: 'Lunch',
      items: ['Paneer Butter Masala', 'Yellow Dal Tadka', 'Jeera Rice', '4 Butter Rotis', 'Salad & Achar'],
      price: 150,
      stock: 12
    }
  };

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // FIX: Added required 'category' property to the OrderItem object
    dispatch(addToCart({
      kitchenId: kitchen.id || '',
      kitchenName: kitchen.name,
      item: {
        id: 'menu-1',
        name: `Today's ${kitchen.todayMenu.type} Special`,
        qty: quantity,
        price: kitchen.todayMenu.price,
        category: 'Standard Thali'
      }
    }));
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="h-64 md:h-80 relative">
        <img src={kitchen.image} alt={kitchen.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{kitchen.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-orange-600 px-3 py-1 rounded-lg font-bold">⭐ {kitchen.rating}</span>
            <span className="text-sm font-medium">{kitchen.reviews} Ratings</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              Today's Menu <span className="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-wider">Freshly Made</span>
            </h2>
            
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{kitchen.todayMenu.type} Thali</h3>
                  <p className="text-orange-600 font-bold text-2xl mt-1">₹{kitchen.todayMenu.price}</p>
                </div>
                <span className="text-xs bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-bold">Only {kitchen.todayMenu.stock} Left!</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {kitchen.todayMenu.items.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="mr-3 text-orange-400">●</span> {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-white border rounded-2xl p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:text-orange-600">-</button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:text-orange-600">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition"
                >
                  Add to Cart • ₹{kitchen.todayMenu.price * quantity}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:border-orange-300 transition cursor-pointer group">
                <p className="font-bold text-lg mb-1 group-hover:text-orange-600 transition">Weekly Tiffin</p>
                <p className="text-sm text-gray-500">6 Days a week (Lunch + Dinner)</p>
                <p className="mt-4 font-bold text-xl text-gray-900">₹1,800 <span className="text-xs text-gray-400 line-through">₹2,100</span></p>
              </div>
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:border-orange-300 transition cursor-pointer group">
                <p className="font-bold text-lg mb-1 group-hover:text-orange-600 transition">Monthly Tiffin</p>
                <p className="text-sm text-gray-500">24 Days (Best Value)</p>
                <p className="mt-4 font-bold text-xl text-gray-900">₹6,500 <span className="text-xs text-gray-400 line-through">₹7,500</span></p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-3xl">
            <h4 className="font-bold mb-4">Safety & Hygiene</h4>
            <div className="space-y-4">
              <HygieneItem text="FSSAI Registered Kitchen" />
              <HygieneItem text="Daily Temperature Checks" />
              <HygieneItem text="Eco-friendly Packaging" />
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl">
            <h4 className="font-bold text-orange-800 mb-2">Location</h4>
            <p className="text-sm text-orange-700">Sector 14, Near Housing Board, Gurgaon</p>
            <div className="mt-4 h-32 bg-gray-200 rounded-xl overflow-hidden grayscale">
              <img src="https://picsum.photos/seed/map/400/200" alt="map" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HygieneItem = ({ text }: { text: string }) => (
  <div className="flex items-center text-sm text-gray-600">
    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
    {text}
  </div>
);

export default KitchenDetails;

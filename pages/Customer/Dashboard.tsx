
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { createTicket, addMessage } from '../../store/supportSlice';
import { CookProfile, Category, ChatMessage, SupportTicket } from '../../types';

const CATEGORIES: { label: Category; icon: string; color: string }[] = [
  { label: 'Standard Thali', icon: '🍱', color: 'orange' },
  { label: 'Keto/Gym', icon: '💪', color: 'teal' },
  { label: 'School Tiffin', icon: '🎒', color: 'blue' },
  { label: 'Fruit/Salad Bowl', icon: '🥗', color: 'green' },
  { label: 'Smoothies', icon: '🥤', color: 'purple' },
];

const MOCK_KITCHENS: CookProfile[] = [
  {
    id: 'k1',
    userId: 'u1',
    kitchenName: 'Sharmaji Ki Kitchen',
    description: 'Purely Vegetarian North Indian Thalis. Specialized in Dal Makhani.',
    isVerified: true,
    location: { type: 'Point', coordinates: [77.0266, 28.4595] },
    kitchenImages: [],
    categories: ['Standard Thali', 'Keto/Gym'],
    onboardingStatus: 'active',
    printerSettings: { hasThermalPrinter: true },
    serviceRadiusKm: 5,
    foodType: 'veg',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/kitchen1/600/400'
  },
  {
    id: 'k2',
    userId: 'u2',
    kitchenName: 'The Fit Spoon',
    description: 'High Protein meals for gym enthusiasts. Low carb, high taste.',
    isVerified: true,
    location: { type: 'Point', coordinates: [77.0299, 28.4601] },
    kitchenImages: [],
    categories: ['Keto/Gym'],
    onboardingStatus: 'active',
    printerSettings: { hasThermalPrinter: false },
    serviceRadiusKm: 3,
    foodType: 'veg',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/gym/600/400'
  },
  {
    id: 'k3',
    userId: 'u3',
    kitchenName: 'Mom\'s School Box',
    description: 'Healthy snacks and tiffins for school kids. Nutrient dense.',
    isVerified: true,
    location: { type: 'Point', coordinates: [77.0244, 28.4555] },
    kitchenImages: [],
    categories: ['School Tiffin', 'Fruit/Salad Bowl'],
    onboardingStatus: 'active',
    printerSettings: { hasThermalPrinter: true },
    serviceRadiusKm: 4,
    foodType: 'veg',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/seed/school/600/400'
  }
];

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kitchens' | 'orders' | 'help'>('kitchens');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [helpInput, setHelpInput] = useState('');
  
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const user = useSelector((state: RootState) => state.auth.user);
  const tickets = useSelector((state: RootState) => state.support.tickets);
  
  const myTicket = tickets.find(t => t.userId === user?.id);

  const filteredKitchens = MOCK_KITCHENS.filter(k => 
    selectedCategory === 'All' || k.categories.includes(selectedCategory as Category)
  );

  const handleStartSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpInput.trim() || !user) return;

    if (!myTicket) {
      const newTicket: SupportTicket = {
        id: 't-' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        userRole: 'customer',
        subject: 'General Inquiry',
        status: 'open',
        lastMessageAt: new Date().toISOString(),
        messages: [{
          id: 'm-1',
          senderId: user.id,
          senderName: user.name,
          senderRole: 'customer',
          text: helpInput,
          timestamp: new Date().toISOString()
        }]
      };
      dispatch(createTicket(newTicket));
    } else {
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: user.id,
        senderName: user.name,
        senderRole: 'customer',
        text: helpInput,
        timestamp: new Date().toISOString()
      };
      dispatch(addMessage({ ticketId: myTicket.id, message: newMessage }));
    }
    setHelpInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-brand">Nearby Home Cooks</h2>
          <p className="text-gray-600 mt-1">Ghar ka swad, customized for your needs.</p>
        </div>
        <div className="flex bg-white rounded-2xl p-1 border shadow-sm">
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-500'}`}>List</button>
          <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${viewMode === 'map' ? 'bg-orange-600 text-white' : 'text-gray-500'}`}>Map</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-white/80 backdrop-blur-md border rounded-[2rem] p-1 w-fit mb-8 shadow-sm">
        <TabBtn active={activeTab === 'kitchens'} onClick={() => setActiveTab('kitchens')} label="Kitchens" />
        <TabBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" />
        <TabBtn active={activeTab === 'help'} onClick={() => setActiveTab('help')} label="Help Desk" />
      </div>

      {activeTab === 'kitchens' && (
        <>
          {/* Categories */}
          <div className="flex space-x-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
            <button onClick={() => setSelectedCategory('All')} className={`flex flex-col items-center min-w-[80px] p-4 rounded-3xl transition-all border ${selectedCategory === 'All' ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105' : 'bg-white'}`}><span className="text-2xl mb-2">🍽️</span><span className="text-[10px] font-bold uppercase tracking-widest">All</span></button>
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => setSelectedCategory(cat.label)} className={`flex flex-col items-center min-w-[100px] p-4 rounded-3xl transition-all border ${selectedCategory === cat.label ? 'bg-teal-600 text-white shadow-lg scale-105' : 'bg-white'}`}><span className="text-2xl mb-2">{cat.icon}</span><span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{cat.label}</span></button>
            ))}
          </div>

          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredKitchens.map(kitchen => (
                <Link to={`/kitchen/${kitchen.id}`} key={kitchen.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img src={kitchen.imageUrl} alt={kitchen.kitchenName} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {kitchen.categories.map(c => <span key={c} className="bg-white/90 backdrop-blur-sm text-[9px] px-2 py-1 rounded-full font-black uppercase text-gray-800">{c}</span>)}
                    </div>
                  </div>
                  <div className="p-7 flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{kitchen.kitchenName}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{kitchen.description}</p>
                    <div className="mt-auto flex justify-between items-center"><span className="text-xs text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full uppercase">Nearby</span><span className="text-green-500 font-bold">⭐ {kitchen.rating}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-[3rem] h-[500px] flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden">
                <img src="https://picsum.photos/seed/mapplace/1200/800" className="w-full h-full object-cover grayscale opacity-40" alt="map" />
                <div className="relative z-10 text-center bg-white/80 backdrop-blur p-8 rounded-[2rem] shadow-xl"><p className="font-black uppercase tracking-widest text-xs">Finding nearest Aunties...</p></div>
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? <p className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found.</p> : orders.map(order => (
            <div key={order.id} className="bg-white p-8 rounded-[3rem] border shadow-sm flex justify-between items-center">
                <div>
                    <h4 className="font-black text-xl">{order.kitchenName}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="font-black text-xl text-orange-600">₹{order.pricingBreakdown.finalTotal}</p>
                    <span className="text-[10px] font-black uppercase bg-green-50 text-green-600 px-3 py-1 rounded-full">{order.status}</span>
                </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'help' && (
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-8 border-b bg-orange-50/50">
            <h3 className="text-2xl font-black font-brand">24/7 Support Desk</h3>
            <p className="text-gray-500 font-bold text-sm">How can we help you today?</p>
          </div>
          
          <div className="flex-grow p-8 overflow-y-auto space-y-4">
            {myTicket ? myTicket.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-[1.5rem] font-medium shadow-sm ${msg.senderRole === 'admin' ? 'bg-gray-100 text-gray-800' : 'bg-orange-600 text-white'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[8px] mt-2 uppercase tracking-widest font-black ${msg.senderRole === 'admin' ? 'text-gray-400' : 'text-orange-200'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
                <span className="text-6xl">👋</span>
                <p className="mt-4 font-black uppercase tracking-widest text-xs">Start a conversation with our support team</p>
              </div>
            )}
          </div>

          <form onSubmit={handleStartSupport} className="p-6 border-t flex gap-4">
            <input 
              type="text" 
              value={helpInput}
              onChange={(e) => setHelpInput(e.target.value)}
              placeholder="Ask us anything..."
              className="flex-grow p-4 bg-gray-50 border rounded-2xl outline-none font-bold focus:ring-4 ring-orange-50"
            />
            <button type="submit" className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 hover:bg-orange-700 transition transform active:scale-95">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
);

export default CustomerDashboard;

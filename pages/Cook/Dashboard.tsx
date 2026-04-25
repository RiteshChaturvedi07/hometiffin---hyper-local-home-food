
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateOrderStatus } from '../../store/ordersSlice';
import { createTicket, addMessage } from '../../store/supportSlice';
import { Order, Category, ChatMessage, SupportTicket } from '../../types';

const CookDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'settings' | 'menu' | 'help'>('incoming');
  const [kitchenCategories, setKitchenCategories] = useState<Category[]>(['Standard Thali', 'Keto/Gym']);
  const [helpInput, setHelpInput] = useState('');
  
  const dispatch = useDispatch();
  const allOrders = useSelector((state: RootState) => state.orders.orders);
  const user = useSelector((state: RootState) => state.auth.user);
  const tickets = useSelector((state: RootState) => state.support.tickets);
  
  const activeOrders = allOrders.filter(o => o.status !== 'delivered');
  const myTicket = tickets.find(t => t.userId === user?.id);

  const handleStatusChange = (orderId: string, currentStatus: Order['status']) => {
    const nextStatus = currentStatus === 'placed' ? 'preparing' : 'delivered';
    dispatch(updateOrderStatus({ id: orderId, status: nextStatus }));
  };

  const handleSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpInput.trim() || !user) return;

    if (!myTicket) {
      const newTicket: SupportTicket = {
        id: 't-cook-' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        userRole: 'cook',
        subject: 'Kitchen Support',
        status: 'open',
        lastMessageAt: new Date().toISOString(),
        messages: [{
          id: 'm-cook-1',
          senderId: user.id,
          senderName: user.name,
          senderRole: 'cook',
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
        senderRole: 'cook',
        text: helpInput,
        timestamp: new Date().toISOString()
      };
      dispatch(addMessage({ ticketId: myTicket.id, message: newMessage }));
    }
    setHelpInput('');
  };

  const handlePrintKOT = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      const receiptHTML = `
        <html>
          <head>
            <title>KOT - ${order.id}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 20px; font-weight: bold; }
              .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .footer { border-top: 2px dashed #000; margin-top: 20px; padding-top: 10px; font-size: 12px; }
              @media print { button { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h2 style="margin:0">KITCHEN TICKET</h2>
              <div>Order ID: ${order.id}</div>
              <div>Mode: ${order.deliveryMode.toUpperCase()}</div>
            </div>
            <div>CUSTOMER: ${order.customerName.toUpperCase()}</div>
            <div>ADDRESS: ${order.address || 'N/A'}</div>
            <div style="margin-top:20px; font-size: 18px;">ITEMS:</div>
            ${order.items.map(i => `<div class="item"><span>${i.qty}x ${i.name}</span></div>`).join('')}
            <div class="footer">
              Printed on: ${new Date().toLocaleString()}
              <br/>HomeTiffin Cook Dashboard
            </div>
            <script>window.print(); setTimeout(() => window.close(), 500);</script>
          </body>
        </html>
      `;
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black font-brand text-gray-900">Order Command Center</h2>
          <p className="text-gray-500 font-bold">Managing Sharmaji Ki Kitchen</p>
        </div>
        
        <div className="bg-white p-2 rounded-[2rem] border shadow-sm flex items-center gap-4 pr-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {isOpen ? '🔥' : '❄️'}
            </div>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-green-600' : 'text-gray-400'}`}>Kitchen is {isOpen ? 'Accepting' : 'Closed'}</p>
                <button onClick={() => setIsOpen(!isOpen)} className="text-sm font-black underline underline-offset-4 decoration-2 decoration-orange-200">
                    {isOpen ? 'Go Offline' : 'Go Online'}
                </button>
            </div>
        </div>
      </header>

      {/* Modern Tabs */}
      <div className="flex bg-gray-100/50 p-1.5 rounded-[2rem] border mb-10 w-fit overflow-x-auto scrollbar-hide">
        <TabBtn active={activeTab === 'incoming'} onClick={() => setActiveTab('incoming')} label={`Active (${activeOrders.length})`} />
        <TabBtn active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} label="Menu" />
        <TabBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Settings" />
        <TabBtn active={activeTab === 'help'} onClick={() => setActiveTab('help')} label="Support" />
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'incoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <span className="text-6xl grayscale opacity-30">😴</span>
                    <p className="text-gray-400 font-black mt-4 uppercase tracking-widest text-xs">No orders yet.</p>
                </div>
            ) : (
                activeOrders.map(order => (
                    <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-black text-xl text-gray-900">{order.customerName}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order #{order.id.split('-')[1]}</p>
                            </div>
                            <button onClick={() => handlePrintKOT(order)} className="bg-gray-100 p-3 rounded-2xl hover:bg-orange-100 hover:text-orange-600 transition group-hover:scale-110">🖨️</button>
                        </div>
                        <div className="space-y-3 mb-8 flex-grow">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl">
                                    <span className="font-bold text-sm text-gray-700">{item.qty}x {item.name}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleStatusChange(order.id, order.status)} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition shadow-lg ${order.status === 'placed' ? 'bg-orange-600 text-white' : 'bg-teal-600 text-white'}`}>
                            {order.status === 'placed' ? 'Start Preparing' : 'Ready'}
                        </button>
                    </div>
                ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <section className="bg-white p-10 rounded-[3rem] border shadow-sm">
                <h3 className="font-black text-2xl mb-8">Kitchen Categories</h3>
                <div className="flex flex-wrap gap-4">
                    {(["Standard Thali", "Keto/Gym", "School Tiffin", "Fruit/Salad Bowl", "Smoothies"] as Category[]).map(cat => (
                        <button key={cat} onClick={() => kitchenCategories.includes(cat) ? setKitchenCategories(kitchenCategories.filter(c => c !== cat)) : setKitchenCategories([...kitchenCategories, cat])} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${kitchenCategories.includes(cat) ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </section>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="max-w-2xl mx-auto bg-white rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-8 border-b bg-orange-50/50">
              <h3 className="text-2xl font-black font-brand">Merchant Help Desk</h3>
              <p className="text-gray-500 font-bold text-sm">Need help with an order or your kitchen settings?</p>
            </div>
            <div className="flex-grow p-8 overflow-y-auto space-y-4">
              {myTicket ? myTicket.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-4 rounded-[1.5rem] font-medium shadow-sm ${msg.senderRole === 'admin' ? 'bg-gray-100 text-gray-800' : 'bg-orange-600 text-white'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[8px] mt-2 uppercase tracking-widest font-black ${msg.senderRole === 'admin' ? 'text-gray-400' : 'text-orange-200'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale"><span className="text-6xl">🥘</span><p className="mt-4 font-black uppercase tracking-widest text-xs">Aunty, we're here to help you grow your business!</p></div>
              )}
            </div>
            <form onSubmit={handleSupportMessage} className="p-6 border-t flex gap-4">
              <input type="text" value={helpInput} onChange={(e) => setHelpInput(e.target.value)} placeholder="Type your message..." className="flex-grow p-4 bg-gray-50 border rounded-2xl outline-none font-bold" />
              <button type="submit" className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
);

export default CookDashboard;

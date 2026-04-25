
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { addMessage, closeTicket } from '../../store/supportSlice';
import { ChatMessage, SupportTicket } from '../../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'helpdesk'>('overview');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const dispatch = useDispatch();
  const tickets = useSelector((state: RootState) => state.support.tickets);
  const user = useSelector((state: RootState) => state.auth.user);
  const orders = useSelector((state: RootState) => state.orders.orders);
  
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId || !user) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: 'Support Agent',
      senderRole: 'admin',
      text: replyText,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage({ ticketId: selectedTicketId, message: newMessage }));
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-black text-orange-600 tracking-tighter">ADMIN PANEL</h1>
        </div>
        <nav className="p-4 space-y-2 flex-grow">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="📊" label="Overview" />
          <SidebarLink active={activeTab === 'verifications'} onClick={() => setActiveTab('verifications')} icon="🛡️" label="Verifications" />
          <SidebarLink active={activeTab === 'helpdesk'} onClick={() => setActiveTab('helpdesk')} icon="💬" label="Help Desk" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex overflow-x-auto space-x-4 mb-6 pb-2 border-b">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 font-black text-xs uppercase tracking-widest ${activeTab === 'overview' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'}`}>Overview</button>
          <button onClick={() => setActiveTab('verifications')} className={`px-4 py-2 font-black text-xs uppercase tracking-widest ${activeTab === 'verifications' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'}`}>Verifications</button>
          <button onClick={() => setActiveTab('helpdesk')} className={`px-4 py-2 font-black text-xs uppercase tracking-widest ${activeTab === 'helpdesk' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'}`}>HelpDesk</button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black font-brand">Platform Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Orders" value={orders.length.toString()} color="blue" />
              <StatCard label="Active Cooks" value="42" color="orange" />
              <StatCard label="Registered Customers" value="1,284" color="teal" />
              <StatCard label="Revenue Today" value="₹12,450" color="green" />
            </div>

            <div className="bg-white p-8 rounded-[3rem] border">
              <h3 className="font-black text-xl mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="flex justify-between items-center py-4 border-b last:border-0">
                    <div>
                      <p className="font-bold">{o.customerName} → {o.kitchenName}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{new Date(o.date).toLocaleTimeString()}</p>
                    </div>
                    <span className="font-black text-gray-900">₹{o.pricingBreakdown.finalTotal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black font-brand">Pending Verifications</h2>
            <div className="grid gap-6">
              <VerificationCard name="Mrs. Gupta's Kitchen" location="New Delhi" documents={['FSSAI', 'Aadhaar']} />
              <VerificationCard name="Mom's Flavors" location="Mumbai" documents={['FSSAI']} />
              <VerificationCard name="Village Spice" location="Pune" documents={['FSSAI', 'Aadhaar', 'GST']} />
            </div>
          </div>
        )}

        {activeTab === 'helpdesk' && (
          <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[3rem] border overflow-hidden shadow-2xl">
            {/* Ticket List */}
            <div className="w-1/3 border-r overflow-y-auto">
              <div className="p-6 border-b bg-gray-50/50">
                <h3 className="font-black text-sm uppercase tracking-widest">Active Tickets</h3>
              </div>
              {tickets.map(ticket => (
                <button 
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full p-6 text-left border-b hover:bg-orange-50 transition-all ${selectedTicketId === ticket.id ? 'bg-orange-100/50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-black text-gray-900">{ticket.userName}</span>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold mb-2">{ticket.subject}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Last: {new Date(ticket.lastMessageAt).toLocaleTimeString()}</p>
                </button>
              ))}
            </div>

            {/* Chat Panel */}
            <div className="flex-grow flex flex-col">
              {selectedTicket ? (
                <>
                  <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h4 className="font-black text-lg">{selectedTicket.userName}</h4>
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">{selectedTicket.userRole}</p>
                    </div>
                    <button onClick={() => dispatch(closeTicket(selectedTicket.id))} className="text-xs font-black uppercase text-gray-400 hover:text-red-600">Close Ticket</button>
                  </div>
                  <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-orange-50/20">
                    {selectedTicket.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-3xl font-medium shadow-sm ${msg.senderRole === 'admin' ? 'bg-orange-600 text-white' : 'bg-white text-gray-800'}`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[8px] mt-2 uppercase tracking-widest font-black ${msg.senderRole === 'admin' ? 'text-orange-200' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendReply} className="p-6 border-t bg-white flex gap-4">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-grow p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 ring-orange-100 font-bold"
                    />
                    <button type="submit" className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 hover:bg-orange-700 transition transform active:scale-95">
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center grayscale opacity-20">
                  <span className="text-8xl">💬</span>
                  <p className="mt-4 font-black uppercase tracking-widest">Select a ticket to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SidebarLink = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
    <span>{icon}</span>
    {label}
  </button>
);

const StatCard = ({ label, value, color }: any) => {
  const colors: any = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <div className={`p-6 rounded-[2.5rem] border ${colors[color]} shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
};

const VerificationCard = ({ name, location, documents }: any) => (
  <div className="bg-white p-8 rounded-[3rem] border flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-xl transition-all">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all">👩‍🍳</div>
      <div>
        <h4 className="text-xl font-black text-gray-900">{name}</h4>
        <p className="text-sm text-gray-400 font-bold">{location}</p>
      </div>
    </div>
    <div className="flex gap-2">
      {documents.map((d: string) => <span key={d} className="text-[8px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-[0.2em]">{d}</span>)}
    </div>
    <div className="flex gap-3">
      <button className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-100 hover:bg-green-700 transition">Approve</button>
      <button className="bg-red-50 text-red-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition">Reject</button>
    </div>
  </div>
);

export default AdminDashboard;

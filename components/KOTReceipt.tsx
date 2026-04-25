
import React from 'react';
import { Order } from '../types';

interface Props {
  order: Order;
}

const KOTReceipt: React.FC<Props> = ({ order }) => {
  return (
    <div className="bg-white p-6 max-w-[300px] border-2 border-black font-mono text-black print:block hidden">
      <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
        <h2 className="text-xl font-bold uppercase tracking-tighter">Kitchen Ticket</h2>
        <p className="text-[10px] font-bold">#{order.id.slice(-6)}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Customer</p>
        <p className="font-bold text-lg">{order.customerName}</p>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Items</p>
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between font-bold text-sm">
              <span>{item.qty}x {item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-dashed border-black pt-4 text-[9px] font-bold italic">
        <p>Delivery: {order.deliveryMode.replace('_', ' ')}</p>
        <p>Date: {new Date(order.date).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default KOTReceipt;

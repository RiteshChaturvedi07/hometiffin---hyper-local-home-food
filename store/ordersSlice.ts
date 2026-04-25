
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../types';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [
    {
      id: 'o-prev-1',
      customerName: 'Rahul Kumar',
      kitchenName: 'Sharmaji Ki Kitchen',
      // Fix: Added missing 'category' property to satisfy OrderItem type requirements
      items: [{ id: 'm1', name: 'Lunch Thali', qty: 1, price: 150, category: 'Standard Thali' }],
      // Fix: Added missing required properties for the Order interface to satisfy TypeScript
      deliveryMode: 'delivery_partner',
      subscriptionType: 'none',
      pricingBreakdown: {
        itemTotal: 150,
        tax: 0,
        deliveryFee: 0,
        finalTotal: 150
      },
      status: 'delivered',
      date: '2024-05-18'
    }
  ],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      // FIX: Accessed id and status through action.payload
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../types';

interface CartState {
  kitchenId: string | null;
  kitchenName: string | null;
  items: OrderItem[];
  total: number;
}

const initialState: CartState = {
  kitchenId: null,
  kitchenName: null,
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ kitchenId: string; kitchenName: string; item: OrderItem }>) => {
      const { kitchenId, kitchenName, item } = action.payload;
      
      // Clear cart if adding from a different kitchen
      if (state.kitchenId && state.kitchenId !== kitchenId) {
        state.items = [];
      }
      
      state.kitchenId = kitchenId;
      state.kitchenName = kitchenName;
      
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        state.items.push(item);
      }
      
      state.total = state.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.kitchenId = null;
      state.kitchenName = null;
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

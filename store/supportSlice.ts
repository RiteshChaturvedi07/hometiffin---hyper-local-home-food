
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportTicket, ChatMessage } from '../types';

interface SupportState {
  tickets: SupportTicket[];
}

const initialState: SupportState = {
  tickets: [
    {
      id: 't1',
      userId: 'u1',
      userName: 'Rahul Kumar',
      userRole: 'customer',
      subject: 'Order delayed',
      status: 'open',
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          id: 'm1',
          senderId: 'u1',
          senderName: 'Rahul Kumar',
          senderRole: 'customer',
          text: 'My order is 20 mins late, can you check?',
          timestamp: new Date().toISOString(),
        }
      ]
    }
  ],
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    createTicket: (state, action: PayloadAction<SupportTicket>) => {
      state.tickets.unshift(action.payload);
    },
    addMessage: (state, action: PayloadAction<{ ticketId: string; message: ChatMessage }>) => {
      const ticket = state.tickets.find(t => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.messages.push(action.payload.message);
        ticket.lastMessageAt = action.payload.message.timestamp;
      }
    },
    closeTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.tickets.find(t => t.id === action.payload);
      if (ticket) {
        ticket.status = 'closed';
      }
    }
  },
});

export const { createTicket, addMessage, closeTicket } = supportSlice.actions;
export default supportSlice.reducer;

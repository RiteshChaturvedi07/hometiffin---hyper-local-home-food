
export type Role = 'customer' | 'cook' | 'admin';
export type Category = 'Standard Thali' | 'Keto/Gym' | 'School Tiffin' | 'Fruit/Salad Bowl' | 'Smoothies';
export type DeliveryMode = 'self_pickup' | 'delivery_partner';
export type SubscriptionType = 'none' | 'weekly' | 'monthly';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  walletBalance: number;
  dietaryPreferences: string[];
  savedAddresses: Array<{
    lat: number;
    lng: number;
    label: string;
  }>;
}

export interface CookProfile {
  id: string;
  userId: string;
  kitchenName: string;
  description: string;
  isVerified: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  kitchenImages: string[];
  categories: Category[];
  onboardingStatus: 'pending_details' | 'pending_verification' | 'active';
  printerSettings: {
    hasThermalPrinter: boolean;
  };
  serviceRadiusKm: number;
  foodType: 'veg' | 'non-veg' | 'both';
  rating: number;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  category: Category;
  calories?: number;
}

export interface Order {
  id: string;
  customerName: string;
  kitchenName: string;
  items: OrderItem[];
  deliveryMode: DeliveryMode;
  subscriptionType: SubscriptionType;
  pricingBreakdown: {
    itemTotal: number;
    tax: number;
    deliveryFee: number;
    finalTotal: number;
  };
  status: 'placed' | 'preparing' | 'delivered';
  date: string;
  address?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  subject: string;
  status: 'open' | 'closed';
  messages: ChatMessage[];
  lastMessageAt: string;
}

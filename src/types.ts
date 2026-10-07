export interface Category {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  imageUrl?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect?: number;
  options: ProductOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isPopular?: boolean;
  optionGroups?: OptionGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  categories: string[];
  logo: string;
  banner: string;
  rating: number;
  ratingCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrder: number;
  isPromo?: boolean;
  promoText?: string;
  isOpen: boolean;
  address: string;
  distanceKm: number;
  menu: MenuItem[];
}

export interface CartItemOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string;
  product: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedOptions: CartItemOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface UserAddress {
  id: string;
  title: string; // e.g. "Casa", "Trabajo", "Pareja"
  fullAddress: string;
  details?: string; // "Apto 402, Torre B"
  deliveryInstructions?: string;
  isDefault: boolean;
  tag: 'home' | 'work' | 'favorite' | 'other';
}

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderDriver {
  name: string;
  photo: string;
  vehicle: string;
  plate: string;
  rating: number;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  restaurant: {
    id: string;
    name: string;
    logo: string;
    address: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    optionsSummary?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  tip: number;
  total: number;
  address: UserAddress;
  status: OrderStatus;
  statusText: string;
  estimatedDeliveryTime: string;
  paymentMethod: string;
  driver?: OrderDriver;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
  orderId?: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

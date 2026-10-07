import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Restaurant, 
  MenuItem, 
  CartItem, 
  UserAddress, 
  Order, 
  AppNotification, 
  UserProfileData,
  OrderStatus 
} from '../types';
import { 
  RESTAURANTS, 
  INITIAL_ADDRESSES, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { webAlerts } from '../utils/webAlerts';

export type ActiveTab = 'home' | 'explore' | 'orders' | 'profile';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  
  // Customizer modal
  customizingProduct: MenuItem | null;
  openCustomizeProduct: (product: MenuItem) => void;
  closeCustomizeProduct: () => void;

  // Cart
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  addToCart: (item: CartItem) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Cart Switch dialog
  pendingCartItem: CartItem | null;
  setPendingCartItem: (item: CartItem | null) => void;
  confirmCartSwitch: () => void;
  cancelCartSwitch: () => void;

  // Checkout modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  appliedPromoCode: string | null;
  setAppliedPromoCode: (code: string | null) => void;
  placeOrder: (paymentMethod: string, tip: number, deliveryMethod: 'delivery' | 'pickup') => Promise<void>;

  // Addresses
  addresses: UserAddress[];
  selectedAddress: UserAddress;
  setSelectedAddress: (address: UserAddress) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (address: UserAddress) => void;
  deleteAddress: (id: string) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  viewingOrder: Order | null;
  setViewingOrder: (order: Order | null) => void;
  reorder: (order: Order) => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  activeFilter: 'all' | 'free_delivery' | 'top_rated' | 'fast' | 'promo';
  setActiveFilter: (filter: 'all' | 'free_delivery' | 'top_rated' | 'fast' | 'promo') => void;

  // Profile & User
  userProfile: UserProfileData;
  updateUserProfile: (data: Partial<UserProfileData>) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotifsCount: number;
  isNotifCenterOpen: boolean;
  setIsNotifCenterOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Secondary Landing Page Access Modals
  partnerModalType: 'restaurant' | 'courier' | null;
  setPartnerModalType: (type: 'restaurant' | 'courier' | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Customizer modal
  const [customizingProduct, setCustomizingProduct] = useState<MenuItem | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<CartItem | null>(null);

  // Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(INITIAL_ADDRESSES[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free_delivery' | 'top_rated' | 'fast' | 'promo'>('all');

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Andrés Felipe Gómez',
    email: 'andres.gomez@directaurante.com',
    phone: '+57 310 492 8821',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    notificationsEnabled: true,
    soundEnabled: true,
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);

  // Modals for Partner Landing Page Access
  const [partnerModalType, setPartnerModalType] = useState<'restaurant' | 'courier' | null>(null);

  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || null;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Customizer helpers
  const openCustomizeProduct = (product: MenuItem) => {
    setCustomizingProduct(product);
  };

  const closeCustomizeProduct = () => {
    setCustomizingProduct(null);
  };

  // Add to cart with restaurant conflict handling
  const addToCart = (newItem: CartItem) => {
    // If cart is not empty and from a different restaurant
    if (cart.length > 0 && cartRestaurant && cartRestaurant.id !== newItem.restaurantId) {
      setPendingCartItem(newItem);
      return;
    }

    // Set restaurant
    if (cart.length === 0) {
      const rest = RESTAURANTS.find(r => r.id === newItem.restaurantId) || null;
      setCartRestaurant(rest);
    }

    setCart(prev => {
      // Check if identical item already exists (same product and same options)
      const existingIndex = prev.findIndex(item => {
        if (item.product.id !== newItem.product.id) return false;
        if (item.specialInstructions !== newItem.specialInstructions) return false;
        if (item.selectedOptions.length !== newItem.selectedOptions.length) return false;
        return item.selectedOptions.every(opt => 
          newItem.selectedOptions.some(o => o.optionId === opt.optionId)
        );
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty,
        };
        return updated;
      }

      return [...prev, newItem];
    });

    webAlerts.success('¡Agregado al carrito!', `${newItem.quantity}x ${newItem.product.name}`);
  };

  const confirmCartSwitch = () => {
    if (pendingCartItem) {
      const rest = RESTAURANTS.find(r => r.id === pendingCartItem.restaurantId) || null;
      setCartRestaurant(rest);
      setCart([pendingCartItem]);
      setPendingCartItem(null);
      webAlerts.info('Carrito actualizado', `Nuevo pedido en ${rest?.name || 'este restaurante'}`);
    }
  };

  const cancelCartSwitch = () => {
    setPendingCartItem(null);
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        setCartRestaurant(null);
      }
      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.cartItemId !== cartItemId);
      if (updated.length === 0) {
        setCartRestaurant(null);
      }
      return updated;
    });
    webAlerts.info('Producto eliminado', 'El producto se quitó de tu carrito.');
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
  };

  // Place order
  const placeOrder = async (paymentMethod: string, tip: number, deliveryMethod: 'delivery' | 'pickup') => {
    if (!cartRestaurant || cart.length === 0) return;

    const subtotal = cart.reduce((s, i) => s + i.totalPrice, 0);
    const deliveryFee = deliveryMethod === 'delivery' && appliedPromoCode !== 'ENVIOGRATIS' ? cartRestaurant.deliveryFee : 0;
    const serviceFee = Math.min(2.0, Math.max(0.5, subtotal * 0.05));
    const discount = appliedPromoCode === 'DIRECT10' ? 2.0 : appliedPromoCode === 'PIZZA2X1' ? 3.5 : 0;
    const total = Math.max(0, subtotal + deliveryFee + serviceFee + tip - discount);

    const newOrderId = 'ord-' + Date.now();
    const orderNumber = '#DIR-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      createdAt: 'Hace un momento',
      restaurant: {
        id: cartRestaurant.id,
        name: cartRestaurant.name,
        logo: cartRestaurant.logo,
        address: cartRestaurant.address,
        phone: '+57 300 123 4567',
      },
      items: cart.map(i => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.unitPrice,
        optionsSummary: i.selectedOptions.map(o => o.optionName).join(', ') || undefined,
      })),
      subtotal,
      deliveryFee,
      serviceFee,
      discount,
      tip,
      total,
      address: selectedAddress,
      status: 'received',
      statusText: 'Pedido confirmado y enviado al restaurante',
      estimatedDeliveryTime: `${cartRestaurant.deliveryTimeMin} - ${cartRestaurant.deliveryTimeMax} min`,
      paymentMethod,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveTab('orders');
    setViewingOrder(newOrder);

    // Trigger in-app order notification
    webAlerts.order(
      '¡Pedido Confirmado! 🎉',
      `Tu orden ${orderNumber} en ${newOrder.restaurant.name} ha sido enviada al restaurante.`
    );

    // Add to notifications list
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: `Pedido ${orderNumber} recibido`,
        message: `${newOrder.restaurant.name} está revisando tu orden.`,
        timestamp: 'Ahora',
        read: false,
        type: 'order',
        orderId: newOrderId,
      },
      ...prev,
    ]);
  };

  // Reorder
  const reorder = (order: Order) => {
    const rest = RESTAURANTS.find(r => r.id === order.restaurant.id);
    if (!rest) {
      webAlerts.error('Restaurante no disponible', 'Este restaurante no se encuentra en servicio.');
      return;
    }
    // Set restaurant and cart items
    setSelectedRestaurant(rest);
    setCartRestaurant(rest);
    const newItems: CartItem[] = order.items.map((item, idx) => {
      const matchProduct = rest.menu.find(m => m.name === item.name) || rest.menu[0];
      return {
        cartItemId: 'reorder-' + idx + '-' + Date.now(),
        product: matchProduct,
        restaurantId: rest.id,
        restaurantName: rest.name,
        quantity: item.quantity,
        selectedOptions: [],
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      };
    });
    setCart(newItems);
    setIsCartOpen(true);
    webAlerts.success('¡Pedido cargado!', 'Los productos se han añadido al carrito.');
  };

  // Address CRUD
  const addAddress = (newAddr: Omit<UserAddress, 'id'>) => {
    const id = 'addr-' + Date.now();
    const created: UserAddress = { ...newAddr, id };
    setAddresses(prev => {
      let list = [...prev];
      if (created.isDefault) {
        list = list.map(a => ({ ...a, isDefault: false }));
      }
      return [created, ...list];
    });
    if (created.isDefault) {
      setSelectedAddress(created);
    }
    webAlerts.success('Dirección guardada', 'Tu nueva dirección fue agregada correctamente.');
  };

  const updateAddress = (updated: UserAddress) => {
    setAddresses(prev => {
      let list = prev.map(a => a.id === updated.id ? updated : a);
      if (updated.isDefault) {
        list = list.map(a => a.id === updated.id ? a : { ...a, isDefault: false });
      }
      return list;
    });
    if (selectedAddress.id === updated.id) {
      setSelectedAddress(updated);
    }
    webAlerts.info('Dirección actualizada', 'Cambios guardados con éxito.');
  };

  const deleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      webAlerts.warning('Atención', 'Debes conservar al menos una dirección registrada.');
      return;
    }
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (selectedAddress.id === id) {
        setSelectedAddress(filtered[0]);
      }
      return filtered;
    });
    webAlerts.info('Dirección eliminada', 'La dirección se ha removido.');
  };

  const updateUserProfile = (data: Partial<UserProfileData>) => {
    setUserProfile(prev => ({ ...prev, ...data }));
    webAlerts.success('Perfil actualizado', 'Tus datos fueron guardados.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    webAlerts.info('Notificaciones', 'Todas las notificaciones marcadas como leídas.');
  };

  // Simulation: update active order status every 45s to demonstrate real delivery flow
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => {
        return prev.map(order => {
          if (order.status === 'received') {
            webAlerts.order(
              '¡Están preparando tu comida! 👨‍🍳',
              `${order.restaurant.name} comenzó a preparar tu pedido ${order.orderNumber}.`
            );
            return {
              ...order,
              status: 'preparing' as OrderStatus,
              statusText: 'El restaurante está preparando tus platillos',
            };
          } else if (order.status === 'preparing') {
            webAlerts.order(
              '¡Repartidor en camino! 🛵',
              `Carlos Mendoza recogió tu pedido en ${order.restaurant.name}.`
            );
            return {
              ...order,
              status: 'on_the_way' as OrderStatus,
              statusText: 'Carlos Mendoza va en camino con tu entrega',
              driver: {
                name: 'Carlos Mendoza',
                photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                vehicle: 'Motocicleta Yamaha FZ 150',
                plate: 'ABC-89F',
                rating: 4.95,
                phone: '+57 312 899 4321',
              },
            };
          }
          return order;
        });
      });
    }, 55000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRestaurant,
        setSelectedRestaurant,
        customizingProduct,
        openCustomizeProduct,
        closeCustomizeProduct,
        cart,
        cartRestaurant,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        pendingCartItem,
        setPendingCartItem,
        confirmCartSwitch,
        cancelCartSwitch,
        isCheckoutOpen,
        setIsCheckoutOpen,
        appliedPromoCode,
        setAppliedPromoCode,
        placeOrder,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        orders,
        activeOrder,
        viewingOrder,
        setViewingOrder,
        reorder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeFilter,
        setActiveFilter,
        userProfile,
        updateUserProfile,
        notifications,
        unreadNotifsCount,
        isNotifCenterOpen,
        setIsNotifCenterOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        partnerModalType,
        setPartnerModalType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

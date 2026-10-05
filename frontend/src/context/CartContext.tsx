import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Food } from '../types/food';
import { CartItem, CartTotals } from '../types/cart';

export interface CartContextType {
  items: CartItem[];
  addItem: (food: Food, restaurant: { _id: string; name: string; deliveryFee: number }) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  totals: CartTotals;
  currentRestaurantId: string | null;
  currentRestaurantName: string | null;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'biteflow_cart_items';
const PLATFORM_FEE = 10;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to storage', err);
    }
  }, [items]);

  const currentRestaurantId = items.length > 0 ? items[0].restaurantId : null;
  const currentRestaurantName = items.length > 0 ? items[0].restaurantName : null;

  const addItem = (food: Food, restaurant: { _id: string; name: string; deliveryFee: number }) => {
    setItems((prevItems) => {
      // If adding from a different restaurant, reset cart for clean restaurant order flow
      const isDifferentRestaurant =
        prevItems.length > 0 && prevItems[0].restaurantId !== restaurant._id;

      const baseItems = isDifferentRestaurant ? [] : [...prevItems];
      const existingIndex = baseItems.findIndex((item) => item.food._id === food._id);

      if (existingIndex > -1) {
        const updated = [...baseItems];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...baseItems,
          {
            food,
            quantity: 1,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name,
            deliveryFee: restaurant.deliveryFee,
          },
        ];
      }
    });
  };

  const removeItem = (foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food._id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.food._id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totals: CartTotals = useMemo(() => {
    const itemTotal = items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = items.length > 0 ? items[0].deliveryFee : 0;
    const platformFee = items.length > 0 ? PLATFORM_FEE : 0;
    const grandTotal = itemTotal + deliveryFee + platformFee;

    return {
      itemTotal,
      deliveryFee,
      platformFee,
      grandTotal,
      itemCount,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totals,
        currentRestaurantId,
        currentRestaurantName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

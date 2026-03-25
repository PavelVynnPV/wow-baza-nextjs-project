"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CartItem {
  id: number;
  product_id: number;
  title: string;
  image_url: string;
  price: number;
  amount: string;
  nickname: string;
  faction: string;
  server_id: number;
  game_slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");

      if (data) setItems(data as CartItem[]);
    };

    fetchCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  const addItem = async (item: Omit<CartItem, "id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("cart")
      .insert({ ...item, user_id: user.id })
      .select()
      .single();

    if (data) setItems((prev) => [...prev, data as CartItem]);
  };

  const removeItem = async (id: number) => {
    await supabase.from("cart").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("cart").delete().eq("user_id", user.id);
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
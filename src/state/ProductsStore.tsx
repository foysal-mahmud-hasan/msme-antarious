import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Product = {
  id: string;
  emoji: string;
  name: string;
  price: number;
  stock: number;
  lowThreshold: number;
};

const seed: Product[] = [
  { id: 'p-fan-usb', emoji: '🌀', name: 'মিনি ইউএসবি ফ্যান', price: 850, stock: 8, lowThreshold: 10 },
  { id: 'p-fan-hand', emoji: '💡', name: 'রিচার্জেবল হ্যান্ড ফ্যান', price: 480, stock: 23, lowThreshold: 10 },
  { id: 'p-bottle', emoji: '🧴', name: 'কুলিং বোতল', price: 350, stock: 14, lowThreshold: 8 },
  { id: 'p-cushion', emoji: '👜', name: 'কুলিং কুশন', price: 280, stock: 12, lowThreshold: 6 },
  { id: 'p-box', emoji: '📦', name: 'প্লাস্টিক বক্স', price: 220, stock: 31, lowThreshold: 10 },
  { id: 'p-umb', emoji: '☂️', name: 'ছাতা', price: 450, stock: 6, lowThreshold: 8 },
  { id: 'p-clip', emoji: '💇', name: 'চুলের ক্লিপ', price: 120, stock: 45, lowThreshold: 12 },
  { id: 'p-oil', emoji: '🛢️', name: 'নারিকেল তেল', price: 180, stock: 22, lowThreshold: 10 },
];

type Ctx = {
  products: Product[];
  lowCount: number;
  addProduct: (p: Omit<Product, 'id'>) => Product;
  adjustStock: (id: string, delta: number) => void;
};

const ProductsCtx = createContext<Ctx | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seed);

  const addProduct: Ctx['addProduct'] = useCallback((p) => {
    const next: Product = { id: 'p-' + Date.now(), ...p };
    setProducts((prev) => [next, ...prev]);
    return next;
  }, []);

  const adjustStock: Ctx['adjustStock'] = useCallback((id, delta) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  }, []);

  const value = useMemo<Ctx>(() => {
    const lowCount = products.filter((p) => p.stock <= p.lowThreshold).length;
    return { products, lowCount, addProduct, adjustStock };
  }, [products, addProduct, adjustStock]);

  return <ProductsCtx.Provider value={value}>{children}</ProductsCtx.Provider>;
}

export function useProducts(): Ctx {
  const ctx = useContext(ProductsCtx);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}

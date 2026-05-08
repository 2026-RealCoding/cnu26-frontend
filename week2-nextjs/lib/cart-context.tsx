'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

// ─── 타입 정의 ──────────────────────────────────────────────
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

// ─── Context 생성 ───────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  // [수정] 초기값은 항상 빈 배열로 시작하여 서버/클라이언트 불일치 방지
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // [실습 8-a 수정] 마운트된 직후(클라이언트)에만 localStorage에서 데이터를 가져옴
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cart');
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch (error) {
        console.error("장바구니 복원 실패:", error);
      } finally {
        setIsHydrated(true); // 하이드레이션 완료 표시
      }
    }
  }, []);

  // [실습 8-b 수정] 하이드레이션이 완료된 이후에만 로컬스토리지에 저장
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // ─── 장바구니 조작 로직 ──────────────────────────────────
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ─── 파생 값 계산 ─────────────────────────────────────
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── 커스텀 훅 ───────────────────────────────────────────────
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart는 CartProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
}
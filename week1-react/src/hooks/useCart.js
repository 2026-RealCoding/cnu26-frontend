import { useState, useEffect } from 'react';

export function useCart() {
  // 과제 1: localStorage에서 장바구니 초기값 불러오기
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 과제 3: 상품 추가 (이미 있으면 수량 증가)
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.productId === product.productId);
      if (exists) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId: product.productId, name: product.title, price: product.lprice, quantity: 1 }];
    });
  };

  // 과제 4: 상품 삭제
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // 과제 5: 수량 변경
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // 과제 6: 전체 비우기
  const clearCart = () => {
    setCart([]);
  };

  // 과제 2: cart 변경 시 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

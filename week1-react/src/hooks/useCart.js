import { useState, useEffect } from 'react';

// ============================================================
// useCart — 장바구니 커스텀 훅
//
// 장바구니 아이템 구조:
// {
//   productId: string,   // 상품 고유 ID
//   title:     string,   // 상품명
//   image:     string,   // 상품 이미지 URL
//   price:     number,   // 최저가 (lprice)
//   quantity:  number,   // 수량
// }
// ============================================================

export function useCart() {
  // [과제 1] localStorage에서 초기값 복원
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // [과제 2] cart 변경 시 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // [과제 3] 상품 추가 — 이미 있으면 수량 +1, 없으면 quantity:1로 추가
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.productId === product.productId);
      if (exists) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // [과제 4] 특정 상품 삭제
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // [과제 5] 수량 변경 (1 미만이면 무시)
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // [과제 6] 전체 비우기
  const clearCart = () => {
    setCart([]);
  };

  // 파생 값 — 직접 수정하지 마세요
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice };
}

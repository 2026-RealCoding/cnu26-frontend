import { useState, useEffect } from 'react';

// ============================================================
// [과제] useCart — 장바구니 커스텀 훅
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
  // 과제 1: localStorage의 'cart' 키에서 초기값 불러오기
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 과제 2: cart가 바뀔 때마다 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 과제 3: 장바구니에 상품 추가 (이미 있으면 수량 증가)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 과제 4: 장바구니에서 특정 상품 삭제
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // 과제 5: 수량 변경 (1 미만이면 무시)
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // 과제 6: 장바구니 전체 비우기
  const clearCart = () => {
    setCart([]);
  };

  // 파생 값 — 직접 수정하지 마세요
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice };
}

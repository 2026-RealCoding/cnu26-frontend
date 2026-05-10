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
  // ============================================================
  // [과제 1] cart 상태를 선언하세요
  //
  // 조건:
  //   - 앱을 새로고침해도 장바구니가 유지되어야 합니다
  //   - localStorage의 'cart' 키에서 초기값을 불러오세요
  //   - 저장된 값이 없으면 빈 배열 []을 초기값으로 사용하세요
  //
  // 참고: localStorage에는 문자열만 저장할 수 있어서
  //       저장 시 JSON.stringify, 읽기 시 JSON.parse가 필요합니다
  // ============================================================
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
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
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // 파생 값 — 직접 수정하지 마세요
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice };
}

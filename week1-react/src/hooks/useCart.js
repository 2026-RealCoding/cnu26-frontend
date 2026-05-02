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
    // localStorage에서 'cart' 키로 저장된 데이터를 읽어옵니다.
    const savedCart = localStorage.getItem('cart');
    // 데이터가 존재하면 객체로 변환하고, 없으면 빈 배열을 반환합니다.
    return savedCart ? JSON.parse(savedCart) : [];
  }); // TODO

  // ============================================================
  // [과제 2] cart가 바뀔 때마다 localStorage에 저장하세요
  //
  // 조건:
  //   - cart 상태가 바뀔 때마다 자동으로 localStorage에 반영되어야 합니다
  //   - useEffect와 의존성 배열을 활용하세요
  // ============================================================
  // TODO
  useEffect(() => {
    // cart 배열이 변할 때마다 문자열로 변환하여 로컬 스토리지에 저장합니다.
    // 자동 채점을 위해 키 이름은 반드시 'cart'여야 합니다.
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ============================================================
  // [과제 3] 장바구니에 상품 추가
  //
  // 조건:
  //   - 이미 담긴 상품(productId 동일)이면 → quantity만 1 증가
  //   - 새 상품이면 → quantity: 1 로 추가
  // ============================================================
  const addToCart = (product) => {
    setCart((prevCart) => {
      // 1. 이미 장바구니에 같은 상품이 있는지 확인합니다.[cite: 1]
      const isExist = prevCart.find((item) => item.productId === product.productId);

      if (isExist) {
        // 2. 이미 있다면: 해당 상품의 quantity만 1 증가시킨 새 배열을 반환합니다.[cite: 1]
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 3. 새로 담는 상품이라면: 기존 배열에 수량 1을 추가하여 새 배열을 만듭니다.[cite: 1]
      return [...prevCart, { ...product, quantity: 1 }];
    });// TODO
  };

  // ============================================================
  // [과제 4] 장바구니에서 특정 상품 삭제
  //
  // 조건: productId가 일치하는 아이템만 제거하세요
  // ============================================================
  const removeFromCart = (productId) => {
    // filter를 사용해 클릭한 ID와 일치하지 않는 아이템들만 남긴 새 배열을 만듭니다.
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  // ============================================================
  // [과제 5] 수량 변경
  //
  // 조건: quantity가 1 미만이면 아무것도 하지 않습니다 (0개 방지)
  // ============================================================
  const updateQuantity = (productId, newQuantity) => {
    // 0개 방지 로직: 수량이 1보다 작으면 함수를 종료합니다.
    if (newQuantity < 1) return;

    // map을 사용해 해당 상품의 수량만 업데이트한 새 배열을 반환합니다.
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // ============================================================
  // [과제 6] 장바구니 전체 비우기
  // ============================================================
  const clearCart = () => {
    // 상태를 빈 배열([])로 초기화하여 전체를 비웁니다.
    setCart([]);
  };
  
  // 파생 값 — 직접 수정하지 마세요
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice };
}

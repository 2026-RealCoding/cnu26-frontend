import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';

const PRODUCT_A = { productId: 'p1', title: '상품A', image: '', price: 10000 };
const PRODUCT_B = { productId: 'p2', title: '상품B', image: '', price: 20000 };

describe('과제 1: localStorage 초기값', () => {
  beforeEach(() => localStorage.clear());

  test('저장된 값이 없으면 빈 배열로 시작한다', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cart).toEqual([]);
  });

  test('localStorage에 저장된 cart를 초기값으로 불러온다', () => {
    const saved = [{ ...PRODUCT_A, quantity: 3 }];
    localStorage.setItem('cart', JSON.stringify(saved));
    const { result } = renderHook(() => useCart());
    expect(result.current.cart).toEqual(saved);
  });
});

describe('과제 2: cart 변경 시 localStorage 자동 저장', () => {
  beforeEach(() => localStorage.clear());

  test('상품 추가 후 localStorage에 반영된다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    const stored = JSON.parse(localStorage.getItem('cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe('p1');
  });
});

describe('과제 3: addToCart', () => {
  beforeEach(() => localStorage.clear());

  test('새 상품을 quantity 1로 추가한다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(1);
  });

  test('이미 있는 상품은 quantity를 1 증가시킨다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.addToCart(PRODUCT_A));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  test('다른 상품은 별도 아이템으로 추가된다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.addToCart(PRODUCT_B));
    expect(result.current.cart).toHaveLength(2);
  });
});

describe('과제 4: removeFromCart', () => {
  beforeEach(() => localStorage.clear());

  test('productId가 일치하는 상품을 삭제한다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.addToCart(PRODUCT_B));
    act(() => result.current.removeFromCart('p1'));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].productId).toBe('p2');
  });

  test('없는 productId를 삭제해도 오류가 없다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.removeFromCart('없는id'));
    expect(result.current.cart).toHaveLength(1);
  });
});

describe('과제 5: updateQuantity', () => {
  beforeEach(() => localStorage.clear());

  test('수량을 지정한 값으로 변경한다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.updateQuantity('p1', 5));
    expect(result.current.cart[0].quantity).toBe(5);
  });

  test('quantity가 1 미만이면 변경하지 않는다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.updateQuantity('p1', 0));
    expect(result.current.cart[0].quantity).toBe(1);
  });
});

describe('과제 6: clearCart', () => {
  beforeEach(() => localStorage.clear());

  test('cart를 빈 배열로 만든다', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(PRODUCT_A));
    act(() => result.current.addToCart(PRODUCT_B));
    act(() => result.current.clearCart());
    expect(result.current.cart).toEqual([]);
  });
});

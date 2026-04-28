import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartView from '../components/CartView';

const SAMPLE_CART = [
  { productId: 'p1', title: '상품A', image: '', price: 10000, quantity: 2 },
  { productId: 'p2', title: '상품B', image: '', price: 5000, quantity: 1 },
];

const DEFAULT_PROPS = {
  cart: SAMPLE_CART,
  totalPrice: 25000,
  onRemove: vi.fn(),
  onUpdateQty: vi.fn(),
  onClear: vi.fn(),
  onClose: vi.fn(),
};

describe('과제 7: 빈 장바구니 처리', () => {
  test('cart가 비어있으면 "장바구니가 비어있습니다" 메시지를 보여준다', () => {
    render(<CartView {...DEFAULT_PROPS} cart={[]} totalPrice={0} />);
    expect(screen.getByText(/장바구니가 비어있습니다/)).toBeInTheDocument();
  });

  test('cart에 상품이 있으면 상품 목록이 보인다', () => {
    render(<CartView {...DEFAULT_PROPS} />);
    expect(screen.getByText('상품A')).toBeInTheDocument();
  });
});

describe('과제 8: 수량 +/- 버튼 연결', () => {
  test('+ 버튼 클릭 시 onUpdateQty(productId, quantity+1)가 호출된다', async () => {
    const onUpdateQty = vi.fn();
    render(<CartView {...DEFAULT_PROPS} onUpdateQty={onUpdateQty} />);

    const plusButtons = screen.getAllByText('+');
    await userEvent.click(plusButtons[0]);

    expect(onUpdateQty).toHaveBeenCalledWith('p1', 3);
  });

  test('- 버튼 클릭 시 onUpdateQty(productId, quantity-1)가 호출된다', async () => {
    const onUpdateQty = vi.fn();
    const cartWith3 = [{ ...SAMPLE_CART[0], quantity: 3 }];
    render(<CartView {...DEFAULT_PROPS} cart={cartWith3} onUpdateQty={onUpdateQty} />);

    const minusButton = screen.getByText('-');
    await userEvent.click(minusButton);

    expect(onUpdateQty).toHaveBeenCalledWith('p1', 2);
  });
});

describe('과제 9: 삭제 버튼 연결', () => {
  test('✕ 버튼 클릭 시 onRemove(productId)가 호출된다', async () => {
    const onRemove = vi.fn();
    render(<CartView {...DEFAULT_PROPS} onRemove={onRemove} />);

    const removeButtons = screen.getAllByText('✕');
    await userEvent.click(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith('p1');
  });
});

describe('과제 10 (심화): 결제하기 버튼', () => {
  test('결제하기 버튼 클릭 시 onClear가 호출된다', async () => {
    const onClear = vi.fn();
    render(<CartView {...DEFAULT_PROPS} onClear={onClear} />);

    const checkoutBtn = screen.getByText(/결제하기/);
    await userEvent.click(checkoutBtn);

    expect(onClear).toHaveBeenCalled();
  });

  test('결제하기 버튼 클릭 후 완료 메시지가 표시된다', async () => {
    render(<CartView {...DEFAULT_PROPS} />);

    const checkoutBtn = screen.getByText(/결제하기/);
    await userEvent.click(checkoutBtn);

    expect(
      screen.getByText(/완료|감사|결제.*완료|주문.*완료/i)
    ).toBeInTheDocument();
  });
});

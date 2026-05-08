'use client';

// ============================================================
// 장바구니 페이지 — Client Component
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ============================================================
  // [수정된 결제 핸들러] 
  // 백엔드 OrderController는 한 번에 하나의 아이템 정보를 받으므로 
  // 장바구니의 모든 아이템을 병렬로 각각 요청 보냅니다.
  // ============================================================
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. 장바구니의 모든 아이템에 대해 각각 POST /api/orders 요청 생성
      const promises = cart.map((item) =>
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          }),
        })
      );

      // 2. 모든 요청이 완료될 때까지 대기
      const results = await Promise.all(promises);

      // 3. 모든 응답이 성공(ok)인지 확인
      const allSuccess = results.every((res) => res.ok);

      if (allSuccess) {
        // 4. 성공 시 클라이언트 장바구니 비우기 및 이동
        clearCart();
        router.push('/orders');
      } else {
        throw new Error('일부 주문 처리 중 오류가 발생했습니다. 네트워크 상태를 확인하세요.');
      }
    } catch (err) {
      console.error('결제 에러:', err);
      setError(err instanceof Error ? err.message : '결제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 빈 장바구니 상태 처리
  if (cart.length === 0) {
    return (
      <div className="main">
        <div className="cart-header">
          <h2 className="page-title">장바구니</h2>
          <Link href="/shop" className="btn-primary">쇼핑 계속하기</Link>
        </div>
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <p>장바구니가 비어있습니다</p>
          <Link href="/shop" className="btn-primary">상품 보러가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="cart-header">
        <h2 className="page-title">장바구니 ({cart.length}종)</h2>
        <Link href="/shop" className="btn-back">← 쇼핑 계속하기</Link>
      </div>

      <div className="cart-list">
        {cart.map((item) => (
          <div key={item.productId} className="cart-item">
            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.productName} className="cart-item-image" />
            )}

            <div className="cart-item-info">
              <p className="cart-item-name">{item.productName}</p>
              <p className="cart-item-price">{Number(item.price).toLocaleString()}원</p>
            </div>

            <div className="cart-item-quantity">
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >-</button>
              <span className="qty-value">{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >+</button>
            </div>

            <p className="cart-item-subtotal">{(item.price * item.quantity).toLocaleString()}원</p>

            <button className="btn-remove" onClick={() => removeFromCart(item.productId)}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>총 결제 금액</span>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>

        {error && <p className="error-msg" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <div className="cart-actions">
          <button className="btn-clear" onClick={clearCart} disabled={loading}>전체 삭제</button>
          <button className="btn-checkout" onClick={handleCheckout} disabled={loading}>
            {loading ? '결제 처리 중...' : `${totalPrice.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}
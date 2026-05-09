import { useState } from 'react';

// ============================================================
// [과제] CartView — 장바구니 화면 컴포넌트
//
// App.jsx에서 아래 props를 받아 사용합니다:
//   cart         : 장바구니 아이템 배열
//   totalPrice   : 총 결제 금액
//   onRemove     : (productId) => void  — 상품 삭제
//   onUpdateQty  : (productId, quantity) => void  — 수량 변경
//   onClear      : () => void  — 전체 비우기
//   onClose      : () => void  — 장바구니 닫기
// ============================================================

export default function CartView({
  cart,
  totalPrice,
  onRemove,
  onUpdateQty,
  onClear,
  onClose,
}) {
  const [checkoutMessage, setCheckoutMessage] = useState('');

  // ============================================================
  // [과제 7] 빈 장바구니 처리
  //
  // cart 배열이 비어있으면 "장바구니가 비어있습니다" 메시지를 보여주세요
  // ============================================================
  const isEmpty = cart.length === 0;

  return (
    <div className="cart-view">
      {/* 헤더 */}
      <div className="cart-header">
        <h2 className="cart-title">장바구니 ({cart.length}종)</h2>
        <button onClick={onClose} className="btn-close">닫기</button>
      </div>

      {checkoutMessage && <p className="status-msg">{checkoutMessage}</p>}

      {isEmpty ? (
        <p className="status-msg">장바구니가 비어있습니다</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.productId} className="cart-item">
                {item.image && (
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                )}

                <div className="cart-item-info">
                  <p className="cart-item-name">{item.title}</p>
                  <p className="cart-item-price">
                    {Number(item.price).toLocaleString()}원
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-subtotal">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>

                <button
                  className="btn-remove"
                  onClick={() => onRemove(item.productId)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-total">
              <span>총 결제 금액</span>
              <strong>{totalPrice.toLocaleString()}원</strong>
            </div>

            <div className="cart-actions">
              <button className="btn-clear" onClick={onClear}>
                전체 삭제
              </button>
              <button
                className="btn-checkout"
                onClick={() => {
                  onClear();
                  setCheckoutMessage('결제가 완료되었습니다');
                }}
              >
                {totalPrice.toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

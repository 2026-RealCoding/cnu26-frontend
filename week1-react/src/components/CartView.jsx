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
  const [ordered, setOrdered] = useState(false);

  const handleCheckout = () => {
    onClear();
    setOrdered(true);
  };

  // ============================================================
  // [과제 7] 빈 장바구니 처리
  //
  // cart 배열이 비어있으면 "장바구니가 비어있습니다" 메시지를 보여주세요
  // ============================================================
  if (cart.length === 0 && !ordered) {
    return (
      <div className="cart-view">
        <div className="cart-header">
          <h2 className="cart-title">장바구니</h2>
          <button onClick={onClose} className="btn-close">닫기</button>
        </div>
        <p className="cart-empty">장바구니가 비어있습니다</p>
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="cart-view">
        <div className="cart-header">
          <h2 className="cart-title">장바구니</h2>
          <button onClick={onClose} className="btn-close">닫기</button>
        </div>
        <p className="cart-empty">결제 완료! 감사합니다 🎉</p>
      </div>
    );
  }

  return (
    <div className="cart-view">
      {/* 헤더 */}
      <div className="cart-header">
        <h2 className="cart-title">장바구니 ({cart.length}종)</h2>
        <button onClick={onClose} className="btn-close">닫기</button>
      </div>

      {/* 상품 목록 */}
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

            {/* ============================================================
                [과제 8] 수량 조절 버튼의 onClick을 연결하세요
                - "-" 버튼: 현재 수량에서 1을 뺀 값으로 onUpdateQty 호출
                - "+" 버튼: 현재 수량에서 1을 더한 값으로 onUpdateQty 호출
                ============================================================ */}
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

            {/* ============================================================
                [과제 9] 삭제 버튼의 onClick을 연결하세요
                ============================================================ */}
            <button
              className="btn-remove"
              onClick={() => onRemove(item.productId)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* 합계 & 결제 */}
      <div className="cart-summary">
        <div className="cart-total">
          <span>총 결제 금액</span>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>

        <div className="cart-actions">
          <button className="btn-clear" onClick={onClear}>
            전체 삭제
          </button>
          {/* ============================================================
              [과제 10 - 심화] 결제하기 버튼을 완성하세요
              - 클릭 시 장바구니를 비우고 완료 메시지를 표시하세요
              ============================================================ */}
          <button
            className="btn-checkout"
            onClick={handleCheckout}
          >
            {totalPrice.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

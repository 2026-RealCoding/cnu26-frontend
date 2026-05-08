export default function CartView({
  cart,
  totalPrice,
  onRemove,
  onUpdateQty,
  onClear,
  onClose,
}) {
  // [과제 7] 빈 장바구니 처리 (자동 채점용 텍스트 포함)
  if (cart.length === 0) {
    return (
      <div className="cart-view">
        <div className="cart-header">
          <h2 className="cart-title">장바구니</h2>
          <button onClick={onClose} className="btn-close">닫기</button>
        </div>
        <div className="empty-message">
          {/* 주의: 아래 텍스트가 정확히 일치해야 자동 채점이 통과됩니다. */}
          <p>장바구니가 비어있습니다</p> 
        </div>
      </div>
    );
  }

  return (
    <div className="cart-view">
      <div className="cart-header">
        <h2 className="cart-title">장바구니 ({cart.length}종)</h2>
        <button onClick={onClose} className="btn-close">닫기</button>
      </div>

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.productId} className="cart-item">
            {item.image && <img src={item.image} alt={item.title} className="cart-item-image" />}
            <div className="cart-item-info">
              <p className="cart-item-name">{item.title}</p>
              <p className="cart-item-price">{Number(item.price).toLocaleString()}원</p>
            </div>

            {/* [과제 8] 수량 조절 버튼 연결 */}
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

            {/* [과제 9] 삭제 버튼 연결 */}
            <button className="btn-remove" onClick={() => onRemove(item.productId)}>
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
          <button className="btn-clear" onClick={onClear}>전체 삭제</button>
          
          {/* [과제 10] 결제하기 버튼 (비우기 + 메시지) */}
          <button
            className="btn-checkout"
            onClick={() => {
              alert('결제가 완료되었습니다!');
              onClear();
              onClose();
            }}
          >
            {totalPrice.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
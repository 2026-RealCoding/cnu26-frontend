export default function CartView({ cart, onUpdateQty, onRemove, onClear }) {
  // 과제 7: 빈 장바구니 처리
  if (cart.length === 0) {
    return <p>장바구니가 비어있습니다</p>;
  }

  return (
    <div className="cart-view">
      <ul>
        {cart.map((item) => (
          <li key={item.productId}>
            <span>{item.name}</span>
            <span>{Number(item.price).toLocaleString()}원</span>
            <div>
              {/* 과제 8: 수량 +/- 버튼 연결 */}
              <button onClick={() => onUpdateQty(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onUpdateQty(item.productId, item.quantity + 1)}>+</button>
            </div>
            {/* 과제 9: 삭제 버튼 연결 */}
            <button onClick={() => onRemove(item.productId)}>✕</button>
          </li>
        ))}
      </ul>
      {/* 과제 10: 결제하기 버튼 */}
      <button onClick={() => { onClear(); alert('주문이 완료되었습니다!'); }}>
        결제하기
      </button>
    </div>
  );
}

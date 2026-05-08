// ============================================================
// [과제] "담기" 버튼을 장바구니와 연결
// ============================================================

export default function ProductCard({ product, onAddToCart }) { // [1] props에 onAddToCart 추가
  // HTML 태그 제거 (<b>맥북</b> → 맥북)
  const cleanTitle = product.title.replace(/<[^>]+>/g, '');
  const priceDisplay = product.lprice
    ? `${Number(product.lprice).toLocaleString()}원`
    : '가격 정보 없음';

  return (
    <div className="product-card">
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        {product.image && (
          <img
            src={product.image}
            alt={cleanTitle}
            className="product-image"
            loading="lazy"
          />
        )}
      </a>
      <div className="product-info">
        <h3 className="product-title">{cleanTitle}</h3>
        <p className="product-price">{priceDisplay}</p>
        {product.brand && (
          <p className="product-brand">브랜드: {product.brand}</p>
        )}
        {product.mallName && (
          <p className="product-mall">{product.mallName}</p>
        )}
        
        {/* [2] onClick에 onAddToCart 호출 코드 연결 */}
        <button
          className="btn-add-cart"
          onClick={() => {
            onAddToCart({
              productId: product.productId,
              title: cleanTitle,
              image: product.image,
              price: Number(product.lprice), // 수치 계산을 위해 숫자로 변환하여 전달
            });
          }}
        >
          🛒 담기
        </button>
      </div>
    </div>
  );
}
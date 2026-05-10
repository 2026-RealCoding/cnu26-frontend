// BE ShoppingItem 구조:
// { title, link, image, lprice, hprice, mallName, productId, brand, maker, category1..4 }

// ============================================================
// [과제] "담기" 버튼을 장바구니와 연결하세요
//
// 1. props에 onAddToCart를 추가합니다
//
// 2. 버튼 클릭 시 onAddToCart를 호출합니다
//    장바구니에 필요한 정보만 골라서 넘기면 됩니다
//    (productId, title, image, price)
// ============================================================

export default function ProductCard({ product, onAddToCart }) { // TODO: onAddToCart prop 추가
  // HTML 태그 제거 (<b>맥북</b> → 맥북)
  const cleanTitle = product.title.replace(/<[^>]+>/g, '');
  const price = product.lprice
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
        <p className="product-price">{price}</p>
        {product.brand && (
          <p className="product-brand">브랜드: {product.brand}</p>
        )}
        {product.mallName && (
          <p className="product-mall">{product.mallName}</p>
        )}
        {/* TODO: onClick에 onAddToCart 호출 코드를 연결하세요 */}
        <button
          className="btn-add-cart"
          onClick={() => {
            // 장바구니에 필요한 정보만 골라서 객체로 넘겨줍니다
            onAddToCart({
              productId: product.productId,
              title: cleanTitle,
              image: product.image,
              price: Number(product.lprice) // 계산을 위해 숫자로 변환해서 넘깁니다
            });
          }}
        >
          🛒 담기
        </button>
      </div>
    </div>
  );
}

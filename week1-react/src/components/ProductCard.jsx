// BE ShoppingItem 구조:
// { title, link, image, lprice, hprice, mallName, productId, brand, maker, category1..4 }

export default function ProductCard({ product, onAddToCart }) {
  // HTML 태그 제거 (<b>맥북</b> → 맥북)
  const cleanTitle = product.title.replace(/<[^>]+>/g, '');
  const price = product.lprice
    ? `${Number(product.lprice).toLocaleString()}원`
    : '가격 정보 없음';

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.productId,
      title: cleanTitle,
      image: product.image,
      price: Number(product.lprice),
    });
  };

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
        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
        >
          🛒 담기
        </button>
      </div>
    </div>
  );
}
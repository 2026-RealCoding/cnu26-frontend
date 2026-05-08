import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
// [과제] useCart와 CartView를 import
import { useCart } from './hooks/useCart';
import CartView from './components/CartView';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import './index.css';

export default function App() {
  const { user, isLoggedIn, login, logout } = useAuth();

  // ============================================================
  // [과제] useCart 훅을 연결
  // ============================================================
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalCount, 
    totalPrice 
  } = useCart();

  // 장바구니 열림/닫힘 상태
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <h1>CNU 쇼핑몰</h1>
        {isLoggedIn && (
          <div className="header-user">
            <span>안녕하세요, {user.name}님!</span>
            {/* ============================================================
                [과제] 장바구니 버튼 - 클릭 시 열기 & totalCount 표시
                ============================================================ */}
            <button className="btn-cart" onClick={() => setCartOpen(true)}>
              🛒 {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </button>
            <button onClick={logout} className="btn-logout">
              로그아웃
            </button>
          </div>
        )}
      </header>

      <main className="main">
        {isLoggedIn ? (
          // ============================================================
          // [과제] ProductList에 onAddToCart prop 전달
          // ============================================================
          <ProductList onAddToCart={addToCart} />
        ) : (
          <LoginForm onLogin={login} />
        )}
      </main>

      {/* ============================================================
          [과제] cartOpen이 true일 때 CartView를 렌더링
          ============================================================ */}
      {cartOpen && (
        <CartView 
          cart={cart}
          totalPrice={totalPrice}
          onRemove={removeFromCart}
          onUpdateQty={updateQuantity}
          onClear={clearCart}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
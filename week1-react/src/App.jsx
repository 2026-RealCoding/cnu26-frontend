import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
// TODO: useCart와 CartView를 import하세요
import { useCart } from './hooks/useCart';
import CartView from './components/CartView';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import './index.css';

export default function App() {
  const { user, isLoggedIn, login, logout } = useAuth();

  // ============================================================
  // [과제] useCart 훅을 연결하세요
  //
  // useCart()에서 필요한 값들을 꺼내 아래에서 사용하세요
  // ============================================================
  // TODO: const { ... } = useCart();

  const{cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice} 
  = useCart();

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
                [과제] 장바구니 버튼
                - 클릭 시 장바구니 패널이 열려야 합니다
                - 담긴 상품 수(totalCount)를 뱃지로 표시하세요
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
          // [과제] ProductList에 onAddToCart prop을 전달하세요
          //
          // ProductList → ProductCard 순서로 함수가 전달됩니다
          // ============================================================
          <ProductList onAddToCart = {addToCart}/>
        ) : (
          <LoginForm onLogin={login} />
        )}
      </main>

      {/* ============================================================
          [과제] cartOpen이 true일 때 CartView를 렌더링하세요
          CartView에 필요한 props: cart, totalPrice, onRemove, onUpdateQty, onClear, onClose
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

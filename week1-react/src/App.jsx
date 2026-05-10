import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import './index.css';

export default function App() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <h1>CNU 쇼핑몰</h1>
        {isLoggedIn && (
          <div className="header-user">
            <span>안녕하세요, {user.name}님!</span>
            <button onClick={() => setCartOpen(true)} className="btn-cart">
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
          <ProductList onAddToCart={addToCart} />
        ) : (
          <LoginForm onLogin={login} />
        )}
      </main>

      {cartOpen && (
        <div className="cart-overlay">
          <CartView
            cart={cart}
            totalPrice={totalPrice}
            onRemove={removeFromCart}
            onUpdateQty={updateQuantity}
            onClear={clearCart}
            onClose={() => setCartOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [giftAdded, setGiftAdded] = useState(false);

  const subtotal = cart
    .filter((item) => item.id !== FREE_GIFT.id)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const hasGift = cart.some((item) => item.id === FREE_GIFT.id);
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setGiftAdded(true);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart((prev) => prev.filter((item) => item.id !== FREE_GIFT.id));
      setGiftAdded(false);
    }
  }, [subtotal, cart]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[productId] || 1) + delta, 1);
      return { ...prev, [productId]: newQty };
    });
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    if (productId === FREE_GIFT.id) return;
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <div className="App">
      <h1 className="shopping-heading">🛒 Shopping Cart</h1>

      <div className="products">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product">
            <p>
              {product.name} - ₹{product.price}
            </p>
            <div className="quantity-controls">
              <button
                className="plus-minus"
                onClick={() => handleQuantityChange(product.id, -1)}
              >
                -
              </button>
              <span>{quantities[product.id] || 1}</span>
              <button
                className="plus-minus"
                onClick={() => handleQuantityChange(product.id, 1)}
              >
                +
              </button>
            </div>
            <button className="sisindri" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h2>Progress to Free Gift</h2>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${Math.min((subtotal / THRESHOLD) * 100, 100)}%`,
          }}
        ></div>
      </div>
      <p>
        {subtotal >= THRESHOLD
          ? "🎁 You've earned the free gift!"
          : `Add ₹${THRESHOLD - subtotal} more to unlock your free gift!`}
      </p>

      {giftAdded && (
        <div className="gift-msg">🎉 Free gift added to your cart!</div>
      )}

      <h2>🛍️ Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="carts">
          {cart.map((item) => (
            <div key={item.id} className="cart-items">
              <p>
                {item.name} - ₹{item.price} x {item.quantity}
              </p>
              {item.id !== FREE_GIFT.id && (
                <div>
                  <button
                    className="red"
                    onClick={() => updateCartQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="green"
                    onClick={() => updateCartQuantity(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="sisindri"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          <h3>Total: ₹{subtotal}</h3>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import './cart.css';
import { Clerk } from '@clerk/clerk-js';

const key = process.env.REACT_APP_PUBLISH_KEY;

const CartPage = () => {
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    calculateTotalAmount(storedCartItems);
  }, []);

  const calculateTotalAmount = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setTotalAmount(total);
  };

  const buyFunction = async () => {
    try {
      // Get the token from Clerk

      const clerk = new Clerk(key);
      await clerk.load();

      // console.log(clerk.user.emailAddresses[0].emailAddress);

      const email = clerk.user.emailAddresses[0].emailAddress;
      console.log(email);


      // Make the API call with the token in the headers
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/payment` ,
        { totalAmount , email },
        {
          headers: {
            'Content-Type': 'application/json',// Include the token here
          },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem('cartItems');
        window.location.href = response.data.url;
        console.log(response.data.url);
      }

          const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/order`,
          { cartItems, totalAmount, email },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(res.data.message);
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle the error (e.g., show an error message to the user)
    }
   

  };

  const handleQuantityChange = (id, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === id) {
        const newQuantity = (item.quantity || 1) + change;
        if (newQuantity > 0) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    setCartItems(updatedItems);
    calculateTotalAmount(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Update localStorage
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedItems);
    calculateTotalAmount(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Update localStorage
  };

  return (
    <section className="h-100 gradient-custom">
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Cart - {cartItems.length} items</h5>
              </div>
              <div className="card-body">
                {cartItems.map((item) => (
                  <div key={item._id}>
                    <div className="row">
                      <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                        <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                          <img src={item.imageUrl} className="w-100" alt={item.name} />
                          <a href="#!">
                            <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
                          </a>
                        </div>
                      </div>
                      <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                        <p>
                          <strong>{item.name}</strong>
                        </p>
                        <p>Per Kg</p>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm me-1 mb-2"
                          data-mdb-tooltip="true"
                          title="Remove item"
                          onClick={() => handleRemoveItem(item._id)} // Call handleRemoveItem on click
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 pl-2">
                        <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>
                          <button
                            className="btn btn-warning px-2 me-2"
                            style={{
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0',
                            }}
                            onClick={() => handleQuantityChange(item._id, -1)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <div className="form-outline">
                            <input
                              id="form1"
                              min="0"
                              name="quantity"
                              value={item.quantity || 1}
                              type="number"
                              className="form-control"
                              readOnly
                            />
                            <label className="form-label" htmlFor="form1">
                              Quantity
                            </label>
                          </div>
                          <button
                            className="btn btn-warning px-2 ms-2"
                            style={{
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0',
                            }}
                            onClick={() => handleQuantityChange(item._id, 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <p className="text-start text-md-center">
                          <strong>₹{item.price.toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-4 mb-lg-0">
              <div className="card-body">
                <p>
                  <strong>We accept</strong>
                </p>
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                  alt="Visa"
                />
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                  alt="American Express"
                />
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                  alt="Mastercard"
                />
                <img
                  className="me-2"
                  width="45px"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWjHVQbSNU0dwOGF5iuSO2xNAVfJXaZ8TlRg&s"
                  alt="PayPal acceptance mark"
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Products
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping
                    <span>Gratis</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Total amount</strong>
                      <strong>
                        <p className="mb-0">(including VAT)</p>
                      </strong>
                    </div>
                    <span>
                      <strong>₹{totalAmount.toFixed(2)}</strong>
                    </span>
                  </li>
                </ul>
                <button type="button" className="btn btn-warning btn-lg btn-block" onClick={buyFunction}>
                  Go to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;

import React, { useEffect, useState } from 'react';



const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch product data from backend
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/product`);
        const data = await response.json();
        // console.log('Products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    // Get existing cart items from localStorage or initialize as an empty array
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the product already exists in the cart
    const foundItem = existingCartItems.find((item) => item._id === product._id);

    if (foundItem) {
      // If found, increase the quantity
      foundItem.quantity = (foundItem.quantity || 1) + 1;
    } else {
      // If not found, add the product to cart with initial quantity 1
      existingCartItems.push({ ...product, quantity: 1 });
    }

    // Save updated cart items back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    alert('Product added to cart!');
  };

  return (
    <div className="container-fluid justify-content-center" style={{ marginTop: '90px' }}>
      <center>
        <h1>
          <span style={{ color: 'orange' }}>Our </span> Product
        </h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore ut quibusdam rem eum?</p>
      </center>
      <div className="container mt-5 p-0">
        <div className="row mt-5 justify-content-center p-1">
          {products.map((product) => (
            <div key={product._id} className="col-12 col-md-12 col-sm-12 col-xl-3 col-lg-3 mt-4 p-1">
              <div className="card text-center">
                <img src={product.imageUrl} alt={product.name} style={{ height: '330px' }} />
                <div className="card-body card-button">
                  <h4 className="card-title pt-0">{product.name}</h4>
                  <p className="card-text pt-0">Per Kg</p>
                  <h3 className="card-text pt-0">
                    <b>₹{product.price}</b>
                  </h3>
                  <button onClick={() => addToCart(product)}>
                    <i className="fa-solid fa-cart-shopping pr-1"></i>Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;

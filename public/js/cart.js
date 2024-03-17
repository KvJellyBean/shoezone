import CartService from "./cartService.js";

// Define Product class
class Product {
  constructor(name, price, description, image) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}

// Cart class definition

class Cart {
  constructor() {
    this.cart = [];
    this.totalItems = 0;
    this.totalPrice = 0;
  }

  addToCart(product) {
    this.cart.push(product);

    this.updateTotals();
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);

    this.updateTotals();
  }

  clearCart() {
    this.cart = [];

    this.updateTotals();
  }

  updateTotals() {
    this.totalItems = this.cart.length;

    this.totalPrice = this.cart.reduce(
      (total, product) => total + product.price,
      0
    );
  }

  getCart() {
    return this.cart;
  }
}

// // Create instance of CartService

const cartService = new CartService();

// Function to render cart items

function renderCartItems() {
  const cartContainer = document.getElementById("cartItems");

  cartContainer.innerHTML = "";

  cartService.getCart().forEach((product, index) => {
    const item = `

            <div class="row align-items-center justify-content-center">

                <div class="col-md-6">

                    <div class="content">

                        <h3 class="product-name">${product.name}</h3>

                        <br />

                        <span class="product-price">$ ${product.price}</span>

                        <p class="product-description">${product.description}</p>

                        <button class="removeButton btn remove-btn btn-outline" onclick="removeFromCart(${index})">Remove</button>

                    </div>

                </div>

                <div class="col-md-6">

                    <div class="picsum-img-wrapper">

                        <img src="${product.image}" alt="${product.name}" />

                    </div>

                </div>

            </div>

        `;

    cartContainer.innerHTML += item;
  });
}

// Function to render purchase history

function renderPurchaseHistory() {
  const purchaseHistoryContainer = document.getElementById("purchaseHistory");

  purchaseHistoryContainer.innerHTML = "";

  cartService.purchaseHistory.forEach((product) => {
    const item = `

            <div class="swiper-slide">

                <div class="purchase-item">

                    <img src="${product.image}" alt="${product.name}" class="purchase-image" />

                    <div class="purchase-details">

                        <span class="purchase-name">${product.name}</span><br />

                        <span class="purchase-price">${product.price}</span>

                    </div>

                </div>

            </div>

        `;

    purchaseHistoryContainer.innerHTML += item;
  });
}

// Function to update totals

function updateTotals() {
  cartService.updateTotals();

  document.getElementById("totalItems").textContent = cartService.totalItems;

  document.getElementById("totalPrice").textContent =
    cartService.totalPrice.toFixed(2);
}

// Function to remove item from cart

function removeFromCart(index) {
  cartService.removeFromCart(index);

  renderCartItems();

  updateTotals();
}

// Function to handle checkout

function checkout() {
  cartService.clearCart();

  renderCartItems();

  updateTotals();
}

// Event listeners

document.getElementById("checkoutBtn").addEventListener("click", checkout);

// Initial setup

renderCartItems();

updateTotals();

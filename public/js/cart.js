import CartService from "./cartService.js";

// Create instance of CartService
const cartService = new CartService();

function renderCartItems() {
  const cartContainer = document.getElementById("cartItems");
  const cartSection = document.getElementById("cartContainer");
  const emptyCart = document.getElementById("emptyCart");
  const goToShopBtn = document.getElementById("goToShopBtn");

  // Clear the cart container
  cartContainer.innerHTML = "";

  // Get the cart
  const cart = cartService.getCart();

  if (cart.length === 0) {
    // If the cart is empty, hide the cart section and show the "Cart is empty" section
    cartSection.style.display = "none";
    emptyCart.style.display = "flex";
    goToShopBtn.style.display = "block";
  } else {
    // If the cart is not empty, show the cart section and hide the "Cart is empty" section
    cartSection.style.display = "flex";
    emptyCart.style.display = "none";
    goToShopBtn.style.display = "none";

    // Render the cart items
    cart.forEach((product) => {
      const item = `
            <div class="row align-items-center justify-content-center">
                <div class="col-md-6">
                    <div class="content">
                        <h3 class="product-name">${product.name}</h3>
                        <br />
                        <span class="product-price">$ ${product.price}</span>
                        <p class="product-description">${product.description}</p>
                        <button class="removeButton btn remove-btn btn-outline">Remove</button>
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

    // Attach event listeners to the remove buttons
    document.querySelectorAll(".removeButton").forEach((button, index) => {
      button.addEventListener("click", () => removeFromCart(index));
    });
  }
}

// Function to render purchase history
function renderPurchaseHistory() {
  const purchaseHistoryContainer = document.getElementById("purchaseHistory");
  const emptyText = document.getElementById("emptyTextPurchaseHistory");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  // Clear the purchase history container
  purchaseHistoryContainer.innerHTML = "";

  // Get the purchase history
  const purchaseHistory = cartService.getPurchaseHistory();

  if (purchaseHistory.length === 0) {
    // If the purchase history is empty, hide the "Clear Purchase History" button and show the "empty" text
    clearHistoryBtn.style.display = "none";
    emptyText.style.display = "block";
  } else {
    // If the purchase history is not empty, show the "Clear Purchase History" button and hide the "empty" text
    clearHistoryBtn.style.display = "block";
    emptyText.style.display = "none";

    // Render the purchase history items
    purchaseHistory.forEach((product) => {
      const item = `
                <div class="purchase-item">
                    <img src="${product.image}" alt="${product.name}" class="purchase-image" />
                    <div class="purchase-details">
                        <span class="purchase-name">${product.name}</span><br />
                        <span class="purchase-price">$${product.price}</span>
                    </div>
                </div>
            </div>
        `;

      purchaseHistoryContainer.innerHTML += item;
    });
  }
}

function clearPurchaseHistory() {
  cartService.clearPurchaseHistory();
  renderPurchaseHistory();
}

document
  .getElementById("clearHistoryBtn")
  .addEventListener("click", clearPurchaseHistory);

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
  // Add the current cart items to the purchase history before clearing the cart
  cartService.getCart().forEach((product) => {
    cartService.addToPurchaseHistory(product);
  });

  // Save the updated purchase history to local storage
  localStorage.setItem(
    "purchaseHistory",
    JSON.stringify(cartService.purchaseHistory)
  );

  cartService.clearCart();
  renderCartItems();
  renderPurchaseHistory();
  updateTotals();
}

// Event listeners
document.getElementById("checkoutBtn").addEventListener("click", checkout);

// Load cart data and purchase history from local storage
const loadedCart = localStorage.getItem("cart");
if (loadedCart) {
  cartService.cart = JSON.parse(loadedCart);
}

const loadedPurchaseHistory = localStorage.getItem("purchaseHistory");
if (loadedPurchaseHistory) {
  cartService.purchaseHistory = JSON.parse(loadedPurchaseHistory);
}

// Render cart items and purchase history
renderCartItems();
renderPurchaseHistory();

// Update totals
updateTotals();

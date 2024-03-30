let cart = [];
let purchaseHistory = [];

const CartService = (() => {
  let totalItems = 0;
  let totalPrice = 0;
  function addToCart(product) {
    console.log("Adding product to cart:", product);

    // Push the product to the cart
    cart.push(product);
    console.log("Cart now contains:", cart);

    // Update the total items and price
    CartService.updateTotals();
  }

  function removeFromCart(index) {
    if (index > -1) {
      let product = cart[index];
      cart.splice(index, 1);
      CartService.updateTotals();

      fetch(`/api/carts/${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Product removed from cart:", data);
          totalItems -= 1;
          totalPrice -= product.price;
          document.getElementById("totalItems").textContent = totalItems;
          document.getElementById("totalPrice").textContent =
            totalPrice.toFixed(2);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle the error or display an error message to the user
        });
    }
    CartService.renderCartItems();
  }

  function updateTotals() {
    cart.forEach((product) => {
      totalItems += 1;
      totalPrice += Number(product.price);
    });

    totalItems = totalItems;
    totalPrice = totalPrice;

    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
    return { totalItems, totalPrice };
  }

  function getCart() {
    console.log(cart);
    return cart;
  }

  function getPurchaseHistory() {
    return purchaseHistory;
  }

  function clearCart() {
    cart = [];
    CartService.updateTotals();
    // Save the updated cart to local storage
    // localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  function addToPurchaseHistory(product) {
    // Add the product to the front of the purchase history
    purchaseHistory.unshift(product);

    // If the purchase history exceeds 5 items, remove the oldest item
    if (purchaseHistory.length > 10) {
      purchaseHistory.pop();
    }

    // Save the updated purchase history to local storage
    // localStorage.setItem(
    //   "purchaseHistory",
    //   JSON.stringify(purchaseHistory)
    // );
  }

  function clearPurchaseHistory() {
    purchaseHistory = [];
    // Save the updated purchase history to local storage
    // localStorage.setItem(
    //   "purchaseHistory",
    //   JSON.stringify(purchaseHistory)
    // );
    CartService.renderPurchaseHistory();
  }

  // Render the cart items
  function renderCartItems() {
    const cartContainer = document.getElementById("cartItems");
    const cartSection = document.getElementById("cartContainer");
    const emptyCart = document.getElementById("emptyCart");
    const goToShopBtn = document.getElementById("goToShopBtn");

    // Clear the cart container
    cartContainer.innerHTML = "";

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

  // Function to handle checkout
  function checkout() {
    // Add the current cart items to the purchase history before clearing the cart
    CartService.getCart().forEach((product) => {
      CartService.addToPurchaseHistory(product);

      // Add data tadi di puchase history
      fetch("/api/purchaseHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Product added to history:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // Hapus data di cart
      fetch("/api/carts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Product deleted from cart:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    // Save the updated purchase history to local storage
    // localStorage.setItem(
    //   "purchaseHistory",
    //   JSON.stringify(CartService.purchaseHistory)
    // );

    CartService.clearCart();
    CartService.renderCartItems();
    CartService.renderPurchaseHistory();
    CartService.updateTotals();
  }
  return {
    addToCart,
    removeFromCart,
    updateTotals,
    getCart,
    getPurchaseHistory,
    clearCart,
    addToPurchaseHistory,
    clearPurchaseHistory,
    //
    renderCartItems,
    renderPurchaseHistory,
    checkout,
  };
})();

// Fetch products from API
async function fetchCarts() {
  try {
    const response = await fetch("/api/carts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    cart = await response.json();
    console.log(cart);
    CartService.renderCartItems();
    CartService.updateTotals();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function fetchPurchaseHistory() {
  try {
    const response = await fetch("/api/purchaseHistory");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    purchaseHistory = await response.json();
    console.log(purchaseHistory);
    CartService.renderPurchaseHistory();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Render products when the page loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchCarts();
  fetchPurchaseHistory();
  CartService.updateTotals();
});

// Event listnere for checkout button
document
  .getElementById("checkoutBtn")
  .addEventListener("click", CartService.checkout);

document
  .getElementById("clearHistoryBtn")
  .addEventListener("click", CartService.clearPurchaseHistory);

CartService.updateTotals();
export default CartService;
export { cart, purchaseHistory };

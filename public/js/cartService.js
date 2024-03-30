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
      const confirmation = window.confirm(
        "Are you sure you want to remove this item from the cart?"
      );

      if (confirmation) {
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
            // Reload the page to reflect the changes
            window.location.reload();
            console.log("Product removed from cart:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle the error or display an error message to the user
          });
      }
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

  async function addToPurchaseHistory(product) {
    // Add the product to the front of the purchase history
    purchaseHistory.unshift(product);

    // If the purchase history exceeds 10 items, remove the oldest item
    if (purchaseHistory.length > 10) {
      purchaseHistory.pop();
    }

    try {
      // Add the product to the purchase history
      const response = await fetch("/api/purchaseHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to purchase history");
      }

      const data = await response.json();
      console.log("Product added to history:", data);
    } catch (error) {
      console.error("Error adding product to history:", error);
    }
  }

  async function clearPurchaseHistory() {
    try {
      const response = await fetch("/api/purchaseHistory", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to clear purchase history");
      }
      // Reload the page to reflect the changes
      window.location.reload();
      console.log("Products removed from Purchase History");
    } catch (error) {
      console.error("Error clearing purchase history:", error);
      // Handle error if necessary
    }
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
    // Iterate over each product in the cart
    CartService.getCart().forEach((product) => {
      // Add the product to the purchase history
      CartService.addToPurchaseHistory(product)
        .then(() => {
          // If adding to purchase history is successful, delete the product from the cart
          return fetch(`/api/carts/${product._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete product from cart");
          }
          // Reload the page to reflect the changes if necessary
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error checking out:", error);
          // Handle error if necessary
        });
    });

    // Clear the cart after processing all items
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

// Event listener for checkout button
document
  .getElementById("checkoutBtn")
  .addEventListener("click", CartService.checkout);

document
  .getElementById("clearHistoryBtn")
  .addEventListener("click", CartService.clearPurchaseHistory);

CartService.updateTotals();
export default CartService;
export { cart, purchaseHistory };

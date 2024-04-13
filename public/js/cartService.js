let cart = [];
let purchaseHistory = [];

const CartService = (() => {
  let totalItems = 0;
  let totalPrice = 0;

  function removeFromCart(index) {
    if (index > -1) {
      let product = cart[index];
      const confirmation = window.confirm(
        "Are you sure you want to remove this item from the cart?"
      );

      if (confirmation) {
        // Trigger confirmation only for cart removal
        const removeFromCartConfirmation = window.confirm(
          "This will remove the item from the cart. Are you sure you want to proceed?"
        );

        if (removeFromCartConfirmation) {
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
              // Update the cart after successful deletion
              fetchCarts();
              console.log("Product removed from cart:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
              // Handle the error or display an error message to the user
            });
        }
      }
    }
    CartService.renderCartItems();
  }

  function updateTotals() {
    totalItems = 0;
    totalPrice = 0;
    cart.forEach((product) => {
      totalItems += product.quantity;
      totalPrice += product.price * product.quantity;
    });

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

  //  Add item to cart and save it to the database
  async function addToPurchaseHistory(product) {
    // Add the total price to the product
    product.totalPrice = product.price * product.quantity;

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

  function removeFromPurchaseHistory(index) {
    if (index > -1) {
      let product = purchaseHistory[index];
      const confirmation = window.confirm(
        "Are you sure you want to remove this item from the purchase history?"
      );

      if (confirmation) {
        // Trigger confirmation only for purchase history removal
        const removeFromPurchaseConfirmation = window.confirm(
          "This will remove the item from the purchase history. Are you sure you want to proceed?"
        );

        if (removeFromPurchaseConfirmation) {
          purchaseHistory.splice(index, 1);

          fetch(`/api/purchaseHistory/${product._id}`, {
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
              // Update the purchase history after successful deletion
              fetchPurchaseHistory();
              console.log("Product removed from purchase history:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
              // Handle the error or display an error message to the user
            });
        }
      }
    }
    CartService.renderPurchaseHistory();
  }

  async function clearPurchaseHistory() {
    const confirmation = window.confirm(
      "Are you sure you want to remove all things in purchase history?"
    );

    if (confirmation) {
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
      cart.forEach((product, index) => {
        const item = `
            <div class="product">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" />
                </div>
                <div class="product-details">
                    <div class="product-title">${product.name}</div>
                </div>
                <div class="product-price">
                    <span class="price-label">Price</span>
                    <span class="price-value">${product.price}</span>
                </div>
                <div class="product-quantity">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <input type="number" value="${
                      product.quantity
                    }" min="1" id="quantity-${index}">
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
                <div class="product-removal">
                    <button class="remove-product-cart" data-index="${index}">Remove</button>
                </div>
                <div class="product-line-price">
                    <span class="total-price-label">Total Price</span>
                    <span class="total-price-value">${
                      product.price * product.quantity
                    }</span>
                </div>
            </div>
        `;

        cartContainer.innerHTML += item;
      });

      // Attach event listeners to the remove buttons and quantity inputs
      document.querySelectorAll(".remove-product-cart").forEach((button) => {
        button.addEventListener("click", () =>
          removeFromCart(button.dataset.index)
        );
      });
      document.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", () =>
          increaseQuantity(button.dataset.index)
        );
      });
      document.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", () =>
          decreaseQuantity(button.dataset.index)
        );
      });
      document.querySelectorAll(".product-quantity input").forEach((input) => {
        input.addEventListener("change", () =>
          updateQuantity(input.id.split("-")[1])
        );
      });
    }
  }

  // Function to increase quantity
  async function increaseQuantity(index) {
    cart[index].quantity++;
    await updateQuantityAndTotalPriceOnServer(index, cart[index].quantity);
    renderCartItems();
    updateTotals();
  }
  // Function to decrease quantity
  async function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      await updateQuantityAndTotalPriceOnServer(index, cart[index].quantity);
      renderCartItems();
      updateTotals();
    }
  }

  // Function to update quantity
  async function updateQuantity(index) {
    const input = document.getElementById(`quantity-${index}`);
    const newQuantity = parseInt(input.value);
    if (newQuantity > 0 && newQuantity !== cart[index].quantity) {
      cart[index].quantity = newQuantity;
      await updateQuantityAndTotalPriceOnServer(index, newQuantity);
      renderCartItems();
      updateTotals();
    }
  }

  // Function to update quantity on server
  async function updateQuantityAndTotalPriceOnServer(index, quantity) {
    const product = cart[index];
    const totalPrice = product.price * quantity;
    try {
      const response = await fetch(`/api/carts/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity, totalPrice }),
      });
      if (!response.ok) {
        throw new Error("Failed to update quantity and total price on server");
      }
      console.log(
        "Quantity and total price updated on server:",
        await response.json()
      );
    } catch (error) {
      console.error(
        "Error updating quantity and total price on server:",
        error
      );
      // Handle error if necessary
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
            <div class="product">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" />
                </div>
                <div class="product-details">
                    <div class="product-title">${product.name}</div>
                </div>
                <div class="product-quantity">
                    <span class="quantity-label">Quantity</span>
                    <span class="quantity-value">${product.quantity}</span> 
                </div>
                <div class="product-removal">
                    <button class="remove-product-history">Remove</button>
                </div>
                <div class="product-line-price">
                    <span class="total-price-title">Total Price</span>
                    <span class="total-price-value">${product.totalPrice}</span> 
                </div>
            </div>
        `;

        purchaseHistoryContainer.innerHTML += item;
      });
      // Attach event listeners to the remove buttons
      document
        .querySelectorAll(".remove-product-history")
        .forEach((button, index) => {
          button.addEventListener("click", () =>
            removeFromPurchaseHistory(index)
          );
        });
    }
  }

  // Function to handle checkout
  async function checkout() {
    const confirmation = window.confirm("Are you sure you want to checkout?");

    if (confirmation) {
      // Iterate over each product in the cart
      for (let product of CartService.getCart()) {
        try {
          // Add the product to the purchase history
          await CartService.addToPurchaseHistory(product);

          // If adding to purchase history is successful, delete the product from the cart
          const response = await fetch(`/api/carts/${product._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to delete product from cart");
          }
        } catch (error) {
          console.error("Error checking out:", error);
        }
      }

      // Clear the cart after processing all items
      CartService.clearCart();
      CartService.renderCartItems();
      CartService.renderPurchaseHistory();
      CartService.updateTotals();
    }
  }

  return {
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

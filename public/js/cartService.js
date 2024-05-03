/**
 * Variables for managing data related to carts and purchase histories
 */
let cart = [];
let purchaseHistory = [];
let userId = document.querySelector("#logoutBtn.userData").dataset.userId;

/**
 * CartService module manages the user's cart and purchase history.
 * It provides functions for adding, removing, and updating items in the cart and purchase history.
 * This module is implemented using the module pattern with an Immediately Invoked Function Expression (IIFE).
 */
const CartService = (() => {
  /**
   * Retrieves the user's cart.
   * @returns {Array} The user's cart items.
   */
  function getCart() {
    return cart;
  }

  /**
   * Retrieves the user's purchase history.
   * @returns {Array} The user's purchase history.
   */
  function getPurchaseHistory() {
    return purchaseHistory;
  }

  /**
   * Clears the user's cart.
   */
  function clearCart() {
    cart = [];
    CartService.updateTotals();
  }

  /**
   * Removes a specific item from the user's cart.
   * @param {number} index - The index of the item to be removed from the cart.
   * @param {boolean} isCheckout - Flag indicating whether the item is being removed during checkout.
   */
  function removeFromCart(index, isCheckout = false) {
    if (index > -1) {
      let product = cart[index];

      if (isCheckout) {
        alert(`You have successfully checked out ${product.name}!`);
      } else {
        alert(`You have successfully removed ${product.name} from the cart!`);
      }

      fetch(`/api/carts/${userId}/${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          fetchCarts();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    CartService.renderCartItems();
  }

  /**
   * Updates the total number of items and total price in the cart.
   * @returns {Object} An object containing the total number of items and total price.
   */
  function updateTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    // Loop through each product in the cart
    cart.forEach((product, index) => {
      const checkbox = document.getElementById(`checkout-${index}`);

      // If the checkbox is checked, include the product in the total calculation
      if (checkbox.checked) {
        totalItems += product.quantity; // Add the quantity of the product
        totalPrice += product.price * product.quantity; // Add the total price of the product considering its quantity
      }
    });

    // Update the total items and total price displayed on the page
    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
    return { totalItems, totalPrice };
  }

  /**
   * Adds an item to the user's purchase history.
   * @param {Object} product - The product to be added to the purchase history.
   */
  async function addToPurchaseHistory(product) {
    // Add the total price to the product
    product.totalPrice = product.price * product.quantity;
    product.checkoutTime = new Date();

    // Add the product to the front of the purchase history
    purchaseHistory.unshift(product);

    // If the purchase history exceeds 10 items, remove the oldest item
    if (purchaseHistory.length > 10) {
      purchaseHistory.pop();
    }

    // Save the product to the database
    const response = await fetch(`/api/purchaseHistory/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to purchase history");
    }
  }

  /**
   * Removes a specific item from the user's purchase history.
   * @param {number} index - The index of the item to be removed from the purchase history.
   */
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

          fetch(`/api/purchaseHistory/${userId}/${product._id}`, {
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
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    }
    CartService.renderPurchaseHistory();
  }

  /**
   * Clears the user's purchase history.
   */
  async function clearPurchaseHistory() {
    const confirmation = window.confirm(
      "Are you sure you want to remove all things in purchase history?"
    );

    if (confirmation) {
      try {
        const response = await fetch(`/api/purchaseHistory/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to clear purchase history");
        }
        // Reload the page to reflect the changes
        window.location.reload();
      } catch (error) {
        console.error("Error clearing purchase history:", error);
      }
    }
  }

  /**
   * Renders the items in the user's cart.
   */
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
          <div class="product" data-aos="fade-up">
            <div class="product-checkout checkbox-wrapper-26">
              <input type="checkbox" id="checkout-${index}" class="checkout-product" data-index="${index}">
                <label for="checkout-${index}">
                  <div class="tick_mark"></div>
                </label>
            </div>
      
            <div class="product-image-cart">
              <img src="${product.image}" alt="${product.name}" />
            </div>
      
            <div class="product-details">
              <div class="product-title">${product.name}</div>
            </div>
      
            <div class="product-price">
              <span class="price-title">Price</span>
              <span class="price-value">$${product.price}</span>
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
              <span class="total-price-title">Total Price</span>
              <span class="total-price-value">$${
                product.price * product.quantity
              }</span>
            </div>
          </div>
        `;

        cartContainer.innerHTML += item;
      });

      // Attach event listeners to the remove buttons and quantity inputs
      document.querySelectorAll(".remove-product-cart").forEach((button) => {
        button.addEventListener("click", () => {
          let resp = window.confirm(
            `Are you sure you want to remove this item?`
          );
          if (resp) {
            removeFromCart(button.dataset.index);
          }
        });
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
      document.querySelectorAll(".checkout-product").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          updateTotals();
        });
      });
    }
  }

  /**
   * Increases the quantity of a product in the cart by 1.
   * @async
   * @param {number} index - The index of the product in the cart.
   */
  async function increaseQuantity(index) {
    const isChecked = document.getElementById(`checkout-${index}`).checked;
    if (cart[index].quantity < 10) {
      cart[index].quantity++;
      await updateQuantityOnServer(index, cart[index].quantity);
      renderCartItems();
      document.getElementById(`checkout-${index}`).checked = isChecked;
      updateTotals();
    }
  }

  /**
   * Decreases the quantity of a product in the cart by 1.
   * @async
   * @param {number} index - The index of the product in the cart.
   */
  async function decreaseQuantity(index) {
    const isChecked = document.getElementById(`checkout-${index}`).checked;
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      await updateQuantityOnServer(index, cart[index].quantity);
      renderCartItems();
      document.getElementById(`checkout-${index}`).checked = isChecked;
      updateTotals();
    }
  }

  /**
   * Updates the quantity of a product in the cart based on user input.
   * @async
   * @param {number} index - The index of the product in the cart.
   */
  async function updateQuantity(index) {
    const input = document.getElementById(`quantity-${index}`);
    const newQuantity = parseInt(input.value);
    const isChecked = document.getElementById(`checkout-${index}`).checked;
    if (
      newQuantity > 0 &&
      newQuantity <= 10 &&
      newQuantity !== cart[index].quantity
    ) {
      cart[index].quantity = newQuantity;
      await updateQuantityOnServer(index, newQuantity);
      renderCartItems();
      document.getElementById(`checkout-${index}`).checked = isChecked;
      updateTotals();
    }
  }

  /**
   * Updates the quantity of a product on the server.
   * @async
   * @param {number} index - The index of the product in the cart.
   * @param {number} quantity - The new quantity of the product.
   */
  async function updateQuantityOnServer(index, quantity) {
    const product = cart[index];

    try {
      const response = await fetch(`/api/carts/${userId}/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantity }),
      });
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Renders the items in the user's purchase history.
   */
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
      purchaseHistory.forEach((product, index) => {
        // Format the checkoutTime to a readable string
        const checkoutTime = formatCheckoutTime(new Date(product.checkoutTime));

        const item = `
        <div class="puchaseHistoryWrap">
          <div class="product-checkout-time">
            <span class="checkout-time-value">${checkoutTime}</span> 
          </div>

          <div class="product-history">
            <div class="product-image-purchase-history">
              <img src="${product.image}" alt="${product.name}" />
            </div>
      
            <div class="product-details">
              <div class="product-title">${product.name}</div>
            </div>
      
            <div class="product-price">
              <span class="price-title">Price</span>
              <span class="price-value">$${product.price}</span>
            </div>
      
            <div class="product-quantity-history">
              <span class="quantity-title">Quantity</span>
              <span class="quantity-value">${product.quantity}</span> 
            </div>
      
            <div class="product-removal">
              <button class="remove-product-history">Remove</button>
            </div>
      
            <div class="product-line-price">
              <span class="total-price-title">Total Price</span>
              <span class="total-price-value">$${product.totalPrice}</span> 
            </div>
          </div>
        </div>
      `;

        purchaseHistoryContainer.innerHTML += item;
      });

      // Function to format checkout time
      function formatCheckoutTime(checkoutTime) {
        const options = {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        return checkoutTime.toLocaleDateString("en-US", options);
      }

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

  /**
   * Initiates the checkout process.
   */
  async function checkout() {
    // Get all the checkboxes
    const checkboxes = document.querySelectorAll(".checkout-product");
    // Filter out the checked checkboxes
    const checked = [...checkboxes].filter((checkbox) => checkbox.checked);

    if (checked.length === 0) {
      // If no checkboxes are checked, show a pop-up message
      window.alert("Please check at least one item before checking out.");
      return;
    }

    const confirmation = window.confirm("Are you sure you want to checkout?");

    if (confirmation) {
      // Iterate over each checked product in the cart
      for (let checkbox of checked) {
        const index = checkbox.dataset.index;
        const product = cart[index];
        try {
          // Add the product to the purchase history
          CartService.addToPurchaseHistory(product);

          // Remove the product from the cart
          removeFromCart(index, true);
        } catch (error) {
          console.error("Error checking out:", error);
        }
      }

      CartService.renderCartItems();
      CartService.renderPurchaseHistory();
      CartService.updateTotals();
    }
  }

  return {
    getCart,
    getPurchaseHistory,
    clearCart,
    removeFromCart,
    updateTotals,
    addToPurchaseHistory,
    clearPurchaseHistory,
    renderCartItems,
    renderPurchaseHistory,
    checkout,
  };
})();

/**
 * Fetches the user's cart from the server.
 */
async function fetchCarts() {
  try {
    const response = await fetch(`/api/carts/${userId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    cart = await data[0].products;
    CartService.renderCartItems();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

/**
 * Fetches the user's purchase history from the server.
 */
async function fetchPurchaseHistory() {
  try {
    const response = await fetch(`/api/purchaseHistory/${userId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    purchaseHistory = await data[0].products;
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

// Event listener for clear history button
document
  .getElementById("clearHistoryBtn")
  .addEventListener("click", CartService.clearPurchaseHistory);

CartService.updateTotals();

export default CartService;
export { cart, purchaseHistory };

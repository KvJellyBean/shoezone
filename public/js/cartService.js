let cart = [];
let purchaseHistory = [];

// Fetch products from API
async function fetchCarts() {
  try {
    const response = await fetch("/api/carts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    cart = await response.json();
    console.log(cart);
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
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

const CartService = (() => {
  function addToCart(product) {
    console.log("Adding product to cart:", product);

    // Push the product to the cart
    this.cart.push(product);
    console.log("Cart now contains:", this.cart);

    // Update the total items and price
    this.updateTotals();

    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  function removeFromCart(index) {
    if (index > -1) {
      this.cart.splice(index, 1);
      this.updateTotals();

      // Save the updated cart to local storage
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }
  }

  function updateTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    this.cart.forEach((product) => {
      totalItems += 1;
      totalPrice += Number(product.price);
    });

    this.totalItems = totalItems;
    this.totalPrice = totalPrice;

    return { totalItems, totalPrice };
  }

  function getCart() {
    console.log(this.cart);
    return this.cart;
  }

  function getPurchaseHistory() {
    return this.purchaseHistory;
  }

  function clearCart() {
    this.cart = [];
    this.updateTotals();
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  function addToPurchaseHistory(product) {
    // Add the product to the front of the purchase history
    this.purchaseHistory.unshift(product);

    // If the purchase history exceeds 5 items, remove the oldest item
    if (this.purchaseHistory.length > 10) {
      this.purchaseHistory.pop();
    }

    // Save the updated purchase history to local storage
    localStorage.setItem(
      "purchaseHistory",
      JSON.stringify(this.purchaseHistory)
    );
  }

  function clearPurchaseHistory() {
    this.purchaseHistory = [];
    // Save the updated purchase history to local storage
    localStorage.setItem(
      "purchaseHistory",
      JSON.stringify(this.purchaseHistory)
    );
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
  };
})();

// Render products when the page loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchCarts();
  fetchPurchaseHistory();
});

export default CartService;
export { cart, purchaseHistory };

class CartService {
  constructor() {
    // Load cart data from local storage
    const loadedCart = localStorage.getItem("cart");
    if (loadedCart) {
      this.cart = JSON.parse(loadedCart);
    } else {
      this.cart = [];
    }

    // Initialize purchase history
    const loadedPurchaseHistory = localStorage.getItem("purchaseHistory");
    if (loadedPurchaseHistory) {
      this.purchaseHistory = JSON.parse(loadedPurchaseHistory);
    } else {
      this.purchaseHistory = [];
    }

    this.totalItems = 0;
    this.totalPrice = 0;
  }

  addToCart(product) {
    console.log("Adding product to cart:", product);

    // Push the product to the cart
    this.cart.push(product);
    console.log("Cart now contains:", this.cart);

    // Update the total items and price
    this.updateTotals();

    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  addToCart(product) {
    console.log("Adding product to cart:", product);

    // Push the product to the cart
    this.cart.push(product);
    console.log("Cart now contains:", this.cart);

    // Update the total items and price
    this.updateTotals();

    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  removeFromCart(index) {
    if (index > -1) {
      this.cart.splice(index, 1);
      this.updateTotals();

      // Save the updated cart to local storage
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }
  }

  updateTotals() {
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

  getCart() {
    console.log(this.cart);
    return this.cart;
  }

  getPurchaseHistory() {
    return this.purchaseHistory;
  }

  clearCart() {
    this.cart = [];
    this.updateTotals();
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  addToPurchaseHistory(product) {
    // Add the product to the front of the purchase history
    this.purchaseHistory.unshift(product);

    // If the purchase history exceeds 5 items, remove the oldest item
    if (this.purchaseHistory.length > 5) {
      this.purchaseHistory.pop();
    }

    // Save the updated purchase history to local storage
    localStorage.setItem(
      "purchaseHistory",
      JSON.stringify(this.purchaseHistory)
    );
  }

  clearPurchaseHistory() {
    this.purchaseHistory = [];
    // Save the updated purchase history to local storage
    localStorage.setItem(
      "purchaseHistory",
      JSON.stringify(this.purchaseHistory)
    );
  }
}

// Exporting the CartService

export default CartService;

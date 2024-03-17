class CartService {
  constructor() {
    this.cart = [];

    this.totalItems = 0;

    this.totalPrice = 0;
  }

  addToCart(product) {
    console.log("Adding product to cart:", product);

    this.cart.push(product);

    console.log("Cart now contains:", this.cart);

    this.updateTotals();
  }

  removeFromCart(index) {
    if (index > -1) {
      this.cart.splice(index, 1);

      this.updateTotals();
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

  clearCart() {
    this.cart = [];

    this.updateTotals();
  }
}

// Exporting the CartService

// module.exports = CartService;

export default CartService;

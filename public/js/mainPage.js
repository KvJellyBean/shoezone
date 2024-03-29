import CartService from "./cartService.js";

const cartService = new CartService();

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    const firstThreeProducts = [
      ...products.slice(0, 1),
      ...products.slice(8, 9),
      ...products.slice(12, 13),
    ];
    renderProducts(firstThreeProducts);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Generate Star Rating based on product rating
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fa-solid fa-star" style="color: #FFD43B;"></i>';
  }

  if (halfStar === 1) {
    starsHTML +=
      '<i class="fa-solid fa-star-half-stroke" style="color: #FFD43B;"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="fa-regular fa-star" style="color: #FFD43B;"></i>';
  }

  return starsHTML;
}

// Render product list to page
function renderProducts(products) {
  const hotProductContainer = document.querySelector(".hot-product div.row");
  hotProductContainer.innerHTML = "";

  products.forEach((product) => {
    hotProductContainer.innerHTML += `
    <!-- Product card -->
    <div class="col">
      <div class="card h-100"> <!-- Tambahkan kelas h-100 untuk menetapkan tinggi 100% -->
        <!-- Product image -->
        <div class="img-container container">
          <img class="card-img-top p-5 p-md-3" src="${
            product.image
          }" alt="Shoes ${product.name}" />
        </div>
        <!-- Product details -->
        <div class="card-body text-center pt-4">
          <!-- Product name -->
          <h4 href="/shop" class="h4 text-primary text-decoration-none">${
            product.name
          }</h4>
          <!-- Product rating -->
          <div class="d-flex justify-content-center small text-warning my-2">
            ${generateStarRating(product.rating)}
          </div>
          <!-- Product price -->
          <div class="product-price">
            <span class="price fw-bold ms-2">$ ${product.price.toFixed(
              2
            )}</span>
          </div>
        </div>
        <!-- Product Add to cart -->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent mt-4">
          <div class="text-center">
            <a href="/cart" class="btn btn-outline-dark mt-auto px-4 py-2 addButtonHotProduct" role="button">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </a>
          </div>
        </div>
      </div>
    </div>
    
    `;
  });

  // Add to cart button functionality
  const addToCartButtons = document.querySelectorAll(".addButtonHotProduct");
  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      addProductToCart(products[index]);
    });
  });
}

// Add product to cart page
function addProductToCart(product) {
  cartService.addToCart(product);
  console.log("Adding product to cart:", product);
}

// Fetch and render when page is loaded
document.addEventListener("DOMContentLoaded", fetchProducts);

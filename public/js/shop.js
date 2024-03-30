// import CartService from "./cartService.js";

let products = [];

// Create an instance of the CartService class
// const cartService = CartService;

// Main container of products
const shopContainer = document.querySelector("#shop-cards");

// Search bar
const searchBar = document.querySelector(".form-control");

// Filter buttons & Select sort
const brandButtons = document.querySelectorAll(".btn.btn-primary.text-dark");
const sortSelect = document.getElementById("sortFeature");

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Add product to cart
function addProductToCart(index, event) {
  const product = products[index];
  // Make a POST request to the /api/carts route with the product data
  fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Product added to cart:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Fetch cart items from API
function fetchCartItems() {
  fetch("/api/carts")
    .then((response) => response.json())
    .then((data) => {
      console.log("Cart items:", data);
      // Render the cart items on the page
      renderCartItems(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Search product functionality
function searchProducts(event = null) {
  let searchTerm = event ? event.target.value.trim().toLowerCase() : "";

  const searchResults = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      )
    : products;

  if (searchResults.length === 0 && searchTerm) {
    displayNotFound(searchTerm);
  } else {
    renderProducts(searchResults);
  }
}

// Displays a not found message when no products match the search term.
function displayNotFound(searchWord) {
  shopContainer.innerHTML = `
    <div class="notFoundContainer">
      <img src="/assets/notfound.png" alt="Product Not Found Logo" />
      <h4>Can't find the product <span>"${searchWord}"</span>.</h4>
    </div>
  `;
}

// Generate Star Rating based on product rating
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;

  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fa-solid fa-star" style="color: #FFD43B;"></i>';
  }

  if (halfStar === 1) {
    starsHTML +=
      '<i class="fa-solid fa-star-half-stroke" style="color: #FFD43B;"></i>';
  }
  return starsHTML;
}

// Render product list to page
function renderProducts(products) {
  shopContainer.innerHTML = "";

  products.forEach((product) => {
    // Get the star
    const starRatingHTML = generateStarRating(product.rating);

    shopContainer.innerHTML += `
      <!-- Product card -->
      <div class="col">
        <div class="card">

          <!-- Product image -->
          <div class="img-container">
            <img
              class="card-img-top p-5 p-md-3"
              src="${product.image}"
              alt="Shoes ${product.name}"
            />
          </div>
      
          <!-- Product details  p-4 -->
          <div class="card-body text-center pt-4 d-flex flex-column gap-1">
            <!-- Product name -->
            <h4 href="#" class="text-primary text-decoration-none">
              ${product.name}
            </h4>
      
            <!-- Product rating -->
            <div class="d-flex justify-content-center small text-warning my-2">
              ${starRatingHTML}
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
              <a
                href="/cart"
                class="btn btn-outline-dark mt-auto px-4 py-2 addButtonShop"
                role="button"
                ><i class="fa-solid fa-cart-shopping"></i> Add Cart</a
              >
            </div>
          </div>
        </div>
      </div>
        `;
  });

  // Add to cart button functionality
  const addToCartButtons = document.querySelectorAll(".addButtonShop");
  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      addProductToCart(index, e);
    });
  });
}

// Function to filter and sorting
function filterAndSortByBrand(brand) {
  let filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(brand.toLowerCase())
  );

  const sortBy = sortSelect.value;

  switch (sortBy) {
    case "alphabet":
      filteredProducts = filteredProducts
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "lowPrice":
      filteredProducts = filteredProducts
        .slice()
        .sort((a, b) => a.price - b.price);
      break;
    case "highPrice":
      filteredProducts = filteredProducts
        .slice()
        .sort((a, b) => b.price - a.price);
      break;
    case "rate":
      filteredProducts = filteredProducts
        .slice()
        .sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  if (filteredProducts.length === 0) {
    displayNotFound(brand);
  } else {
    renderProducts(filteredProducts);
  }
}

// Event listener for filter button
brandButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const brand = event.target.textContent.trim();
    const isActive = event.target.classList.contains("activeFilter");

    if (isActive) {
      event.target.classList.remove("activeFilter");
      searchProducts();
    } else {
      brandButtons.forEach((btn) => {
        btn.classList.remove("activeFilter");
      });
      event.target.classList.add("activeFilter");

      const brandFilter = document.querySelector(
        ".btn.btn-primary.text-dark.activeFilter"
      );

      if (brandFilter) {
        filterAndSortByBrand(brandFilter.textContent.trim());
      } else {
        filterAndSortByBrand(brand);
      }
    }
  });
});

// Event listener for filtering or sorting only
sortSelect.addEventListener("change", (event) => {
  const sortBy = event.target.value;
  // Check is there any active filter based on brand
  const brandFilter = document.querySelector(
    ".btn.btn-primary.text-dark.activeFilter"
  );

  if (brandFilter) {
    const brand = brandFilter.textContent.trim();
    filterAndSortByBrand(brand);
  } else {
    let sortedProducts = [];
    switch (sortBy) {
      case "alphabet":
        sortedProducts = products
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lowPrice":
        sortedProducts = products.slice().sort((a, b) => a.price - b.price);
        break;
      case "highPrice":
        sortedProducts = products.slice().sort((a, b) => b.price - a.price);
        break;
      case "rate":
        sortedProducts = products.slice().sort((a, b) => b.rating - a.rating);
        break;
      default:
        sortedProducts = products;
        break;
    }

    if (sortedProducts.length === 0) {
      displayNotFound();
    } else {
      renderProducts(sortedProducts);
    }
  }
});

// Implements search bar functionality
searchBar.addEventListener("keyup", searchProducts);
searchBar.addEventListener("submit", (e) => searchProducts(e));

// Render products when the page loaded
document.addEventListener("DOMContentLoaded", fetchProducts);

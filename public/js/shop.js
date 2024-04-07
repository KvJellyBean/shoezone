// Global Variabel
let products = [];
let searchResults = [];

// Main container of products
const shopContainer = document.querySelector("#shop-cards");
const userRole = shopContainer.dataset.userRole;

// DOM Element
const searchBar = document.querySelector(".form-control");
const brandButtons = document.querySelectorAll(".btn.btn-primary.text-dark");
const sortSelect = document.getElementById("sortFeature");
const addProductBtn = document.querySelector(".addProduct");
const addProductForm = document.querySelector("#addProductDialog form");
const cancelAddProduct = document.querySelector(".cancelAddProduct");
const cancelEditProduct = document.querySelector(".cancelEditProduct");
const editProductForm = document.querySelector("#editProductDialog form");

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
  brandButtons.forEach((btn) => {
    btn.classList.remove("activeFilter");
  });

  let searchTerm =
    event === searchBar
      ? searchBar.value
      : event
      ? event.target.value.trim().toLowerCase()
      : "";

  // Check if filter or sorting is active
  const brandFilter = document.querySelector(
    ".btn.btn-primary.text-dark.activeFilter"
  );
  const sortBy = sortSelect.value;

  searchResults = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      )
    : products;

  if (searchResults.length === 0 && searchTerm) {
    displayNotFound(searchTerm);
  } else {
    // Apply filter if brand filter is active
    if (brandFilter) {
      const brand = brandFilter.textContent.trim();
      searchResults = searchResults.filter((product) =>
        product.name.toLowerCase().includes(brand.toLowerCase())
      );
    }

    // Apply sorting if sort option is selected
    switch (sortBy) {
      case "alphabet":
        searchResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lowPrice":
        searchResults.sort((a, b) => a.price - b.price);
        break;
      case "highPrice":
        searchResults.sort((a, b) => b.price - a.price);
        break;
      case "rate":
        searchResults.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

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

// Function to filter and sorting
function filterAndSortByBrand(brand) {
  let filteredProducts;

  if (searchResults.length === 0) {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(brand.toLowerCase())
    );
  } else {
    filteredProducts = searchResults.filter((product) =>
      product.name.toLowerCase().includes(brand.toLowerCase())
    );
  }

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
    displayNotFound(brand + " " + searchBar.value);
  } else {
    renderProducts(filteredProducts);
  }
}

// Render product list to page
function renderProducts(products) {
  shopContainer.innerHTML = "";

  products.forEach((product) => {
    // Get the star
    const starRatingHTML = generateStarRating(product.rating);

    if (userRole === "admin") {
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
            <div class="d-flex flex-column justify-content-center small  my-2">
              <div class="stars">
                ${starRatingHTML}
              </div>

              <!-- Product price -->
              <div class="product-price">
                <span class="price fw-bold ms-2">$ ${product.price.toFixed(
                  2
                )}</span>
              </div>
            </div>
      
          </div>
      
          <!-- Product Add to cart -->
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent mt-4">
            <div class="text-center">
              <a
                href="/cart"
                class="btn btn-success mt-auto px-4 py-2 addButtonShop"
                role="button"
                ><i class="fa-solid fa-cart-shopping"></i> Add Cart</a
              >
            </div>
          </div>

          <div class="menuButton">
            <button type="button" class="removeButton" data-product-id="${
              product._id
            }"><i class="fa-solid fa-trash"></i></button>
            <button type="button" class="editButton" data-product-id="${
              product._id
            }"><i class="fa-solid fa-pen-to-square"></i></button>
          </div>
        </div>
      </div>
        `;
    } else {
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
            <div class="d-flex flex-column justify-content-center small  my-2">
              <div class="stars">
                ${starRatingHTML}
              </div>

              <!-- Product price -->
              <div class="product-price">
                <span class="price fw-bold ms-2">$ ${product.price.toFixed(
                  2
                )}</span>
              </div>
            </div>
      
          </div>
      
          <!-- Product Add to cart -->
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent mt-4">
            <div class="text-center">
              <a
                href="/cart"
                class="btn btn-success mt-auto px-4 py-2 addButtonShop"
                role="button"
                ><i class="fa-solid fa-cart-shopping"></i> Add Cart</a
              >
            </div>
          </div>
        </div>
      </div>
        `;
    }
  });

  // Add to cart button functionality
  const addToCartButtons = document.querySelectorAll(".addButtonShop");
  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      addProductToCart(index, e);
    });
  });
}

// Show Add Product dialog
function showAddProductDialog() {
  const dialog = document.querySelector("dialog#addProductDialog");
  const form = dialog.querySelector("form");
  form.reset();
  dialog.showModal();
}

// Show Edit Product dialog
async function showEditProductDialog(productId) {
  const product = await getProductDetails(productId);

  if (product) {
    const dialog = document.querySelector("dialog#editProductDialog");
    const form = dialog.querySelector("form");
    form.reset();

    // Populate form fields with product details
    form.querySelector("#nameEditInput").value = product.name;
    form.querySelector("#priceEditInput").value = product.price;
    form.querySelector("#descriptionEditInput").value = product.description;
    form.querySelector("#imageEditInput").value = product.image;
    form.querySelector("#ratingEditInput").value = product.rating;

    dialog.showModal();
  }
}

// Close Add Product dialog
function closeAddProductDialog() {
  const dialog = document.querySelector("dialog#addProductDialog");
  dialog.close();
}

// Close Edit Product dialog
function closeEditProductDialog() {
  const dialog = document.querySelector("dialog#editProductDialog");
  dialog.close();
}

// Function to add new product
async function addProduct(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#nameInput").value;
  const priceInput = document.querySelector("#priceInput").value;
  const descriptionInput = document.querySelector("#descriptionInput").value;
  const imageInput = document.querySelector("#imageInput").value;
  const ratingInput = document.querySelector("#ratingInput").value;

  try {
    // Check if a product with the same name already exists
    const existingProduct = products.find(
      (product) => product.name.toLowerCase() === nameInput.toLowerCase()
    );
    if (existingProduct) {
      alert("A product with the same name already exists.");
      return;
    }

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput,
        price: priceInput,
        description: descriptionInput,
        image: imageInput,
        rating: ratingInput,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with adding the product:", error);
  }
}

// Function to delete product
async function deleteProduct(event, productId) {
  event.preventDefault();

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with deleting the product:", error);
  }
}

// Function to edit product
async function editProduct(event, productId) {
  event.preventDefault();

  const nameInput = document.querySelector("#nameEditInput").value;
  const priceInput = document.querySelector("#priceEditInput").value;
  const descriptionInput = document.querySelector(
    "#descriptionEditInput"
  ).value;
  const imageInput = document.querySelector("#imageEditInput").value;
  const ratingInput = document.querySelector("#ratingEditInput").value;

  try {
    // Check if a product with the same name already exists
    const existingProduct = products.find(
      (product) =>
        product.name.toLowerCase() === nameInput.toLowerCase() &&
        product._id !== productId
    );
    if (existingProduct) {
      alert("A product with the same name already exists.");
      return;
    }

    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput,
        price: priceInput,
        description: descriptionInput,
        image: imageInput,
        rating: ratingInput,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with updating the product:", error);
  }
}

async function addAndShowProduct(event) {
  event.preventDefault();
  await addProduct(event);
  await fetchProducts();
  renderProducts(products);
  closeAddProductDialog();
}

async function deleteAndShowProduct(event, productId) {
  event.preventDefault();

  const isDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (isDelete) {
    await deleteProduct(event, productId);
    await fetchProducts();
    renderProducts(products);
  } else {
    return;
  }
}

async function editAndShowProduct(event, productId) {
  event.preventDefault();
  await editProduct(event, productId);
  await fetchProducts();
  renderProducts(products);
  closeEditProductDialog();
}

// Function to get product details by ID
async function getProductDetails(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with fetching product details:", error);
    return null;
  }
}

// Handler function for edit product
function handleEdit(e) {
  editAndShowProduct(e, productId);
}

// EVENT LISTENER

// Render products when the page loaded
document.addEventListener("DOMContentLoaded", fetchProducts);

// Implements search bar functionality
searchBar.addEventListener("keyup", searchProducts);
searchBar.addEventListener("submit", (e) => searchProducts(e));

// Event listener for filter button
brandButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const brand = event.target.textContent.trim();
    const isActive = event.target.classList.contains("activeFilter");

    if (isActive) {
      event.target.classList.remove("activeFilter");
      searchProducts(searchBar);
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
  let sortedProducts = [...searchResults];

  if (brandFilter) {
    const brand = brandFilter.textContent.trim();
    filterAndSortByBrand(brand);
  } else {
    switch (sortBy) {
      case "alphabet":
        sortedProducts = sortedProducts
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lowPrice":
        sortedProducts = sortedProducts
          .slice()
          .sort((a, b) => a.price - b.price);
        break;
      case "highPrice":
        sortedProducts = sortedProducts
          .slice()
          .sort((a, b) => b.price - a.price);
        break;
      case "rate":
        sortedProducts = sortedProducts
          .slice()
          .sort((a, b) => b.rating - a.rating);
        break;
      default:
        sortedProducts = sortedProducts;
        break;
    }

    if (sortedProducts.length === 0) {
      displayNotFound();
    } else {
      renderProducts(sortedProducts);
    }
  }
});

if (userRole === "admin") {
  // Show dialog to add new product
  addProductBtn.addEventListener("click", () => {
    addProductForm.removeEventListener("submit", addAndShowProduct);
    showAddProductDialog();
    addProductForm.addEventListener("submit", addAndShowProduct);
  });

  // Event handler for edit and remove product
  let productId;
  shopContainer.addEventListener("click", (e) => {
    editProductForm.removeEventListener("submit", handleEdit);

    if (e.target.matches(".editButton")) {
      productId = e.target.dataset.productId;
      showEditProductDialog(productId);
      editProductForm.addEventListener("submit", handleEdit);
    } else if (e.target.matches(".removeButton")) {
      productId = e.target.dataset.productId;
      deleteAndShowProduct(e, productId);
    }
  });

  // Close dialog of add new product
  cancelAddProduct.addEventListener("click", () => {
    closeAddProductDialog();
  });

  // Close dialog of edit product
  cancelEditProduct.addEventListener("click", () => {
    closeEditProductDialog();
  });
}

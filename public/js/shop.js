// Global Variabel
let products = [];
let searchResults = [];
let productId;
let userId = document.querySelector("#logoutBtn.userData").dataset.userId;
let userRole = document.querySelector("#logoutBtn.userData").dataset.userRole;

// Main container of products
const shopContainer = document.querySelector("#shop-cards");

// DOM Elements.
const searchBar = document.querySelector(".form-control");
const searchInput = document.querySelector("#searchInput");
const brandButtons = document.querySelectorAll(".btn.btn-primary.text-dark");
const sortSelect = document.getElementById("sortFeature");
const addProductBtn = document.querySelector(".addProduct");
const addProductForm = document.querySelector("#addProductDialog form");
const submitBtnProduct = document.querySelector(".submitBtn");
const submiBtnProduct = document.querySelector(".submitBtn");
const editBtnProduct = document.querySelector(".editBtn");
const cancelAddProduct = document.querySelector(".cancelAddProduct");
const cancelEditProduct = document.querySelector(".cancelEditProduct");
const editProductForm = document.querySelector("#editProductDialog form");

/**
 * Fetches products from the API.
 */
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

/**
 * Adds a product to the cart.
 * @param {Event} event - The click event.
 * @param {string} productId - The ID of the product.
 * @param {string} userId - The ID of the user.
 */
function addProductToCart(event, productId, userId) {
  const product = products.find((prod) => prod._id === productId);

  const cartData = {
    userId: userId,
    products: product,
  };

  // Check if the user and product are already in the cart in the database
  fetch(`/api/carts/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      const cart = data.find((cart) => cart.userId === userId);

      if (cart) {
        let updatedCart;

        if (cart.products.find((prod) => prod._id === productId)) {
          updatedCart = {
            // Update quantity inside products list
            products: cart.products.map((prod) =>
              prod._id === productId
                ? { ...prod, quantity: prod.quantity + 1 }
                : prod
            ),
          };
        } else {
          updatedCart = {
            products: [...cart.products, product],
          };
        }

        // Update the cart in the database
        fetch(`/api/carts/${cart._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCart),
        });
      } else {
        // Create a new cart in the database
        fetch("/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartData),
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * Searches products based on the input search term.
 * @param {Event | string} event - The input event or search term.
 */
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

/**
 * Displays a message when no products match the search term.
 * @param {string} searchWord - The search term.
 */
function displayNotFound(searchWord) {
  shopContainer.innerHTML = `
    <div class="notFoundContainer">
      <img src="/assets/notfound.png" alt="Product Not Found Logo" />
      <h4>Can't find the product <span>"${searchWord}"</span>.</h4>
    </div>
  `;
}

/**
 * Generates star rating HTML based on the product rating.
 * @param {number} rating - The rating of the product.
 * @returns {string} - The HTML representation of star rating.
 */
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

/**
 * Filters and sorts products by brand and other criteria.
 * @param {string} brand - The brand name to filter by.
 */
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

/**
 * Renders the product list to the page.
 * @param {Array} products - The array of products to render.
 */
function renderProducts(products) {
  shopContainer.innerHTML = "";

  products.forEach((product) => {
    // Get the star
    const starRatingHTML = generateStarRating(product.rating);

    if (userRole === "admin") {
      shopContainer.innerHTML += `
      <!-- Product card -->
      <div class="col" data-aos="fade-up">
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
                class="btn btn-success mt-auto px-4 py-2 addButtonShop"
                role="button" data-product-id="${product._id}"
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
      <div class="col" data-aos="fade-up">
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
                class="btn btn-success mt-auto px-4 py-2 addButtonShop"
                role="button" data-product-id="${product._id}"
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
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      Toastify({
        text: "Product added to cart!",
        duration: 2000,
        destination: "/cart",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      addProductToCart(e, button.dataset.productId, userId);
    });
  });
}

/**
 * Shows the dialog for adding a new product.
 */
function showAddProductDialog() {
  const dialog = document.querySelector("dialog#addProductDialog");
  const form = dialog.querySelector("form");
  form.reset();
  dialog.showModal();
}

/**
 * Shows the dialog for editing a product.
 * @param {string} productId - The ID of the product to edit.
 */
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
    form.querySelector("#ratingEditInput").value = product.rating;

    dialog.showModal();
  }
}

/**
 * Closes the dialog for adding a new product.
 */
function closeAddProductDialog() {
  const dialog = document.querySelector("dialog#addProductDialog");
  dialog.close();
}

/**
 * Closes the dialog for editing a product.
 */
function closeEditProductDialog() {
  const dialog = document.querySelector("dialog#editProductDialog");
  dialog.close();
}

/**
 * Adds a new product.
 * @param {Event} event - The submit event.
 */
async function addProduct(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#nameInput").value;
  const priceInput = document.querySelector("#priceInput").value;
  const descriptionInput = document.querySelector("#descriptionInput").value;
  const imageInput = document.querySelector("#imageInput").files[0];
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

    const formData = new FormData();
    formData.append("name", nameInput);
    formData.append("price", priceInput);
    formData.append("description", descriptionInput);
    formData.append("image", imageInput);
    formData.append("rating", ratingInput);
    formData.append("quantity", 1);

    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with adding the product:", error);
  }
}

/**
 * Deletes a product.
 * @param {Event} event - The click event.
 * @param {string} productId - The ID of the product to delete.
 */
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

/**
 * Edits a product.
 * @param {Event} event - The submit event.
 * @param {string} productId - The ID of the product to edit.
 */
async function editProduct(event, productId) {
  event.preventDefault();

  const nameInput = document.querySelector("#nameEditInput").value;
  const priceInput = document.querySelector("#priceEditInput").value;
  const descriptionInput = document.querySelector(
    "#descriptionEditInput"
  ).value;
  const imageInput = document.querySelector("#imageEditInput").files[0];
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

    const formData = new FormData();
    formData.append("name", nameInput);
    formData.append("price", priceInput);
    formData.append("description", descriptionInput);
    formData.append("rating", ratingInput);
    formData.append("image", imageInput);
    formData.append("quantity", 1);

    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with updating the product:", error);
  }
}

/**
 * Adds a new product and updates the displayed product list.
 * @param {Event} event - The submit event.
 */
async function addAndShowProduct(event) {
  event.preventDefault();
  submitBtnProduct.disabled = true;
  await addProduct(event);
  await fetchProducts();
  submitBtnProduct.disabled = false;
  renderProducts(products);
  closeAddProductDialog();
}

/**
 * Deletes a product and updates the displayed product list.
 * @param {Event} event - The click event.
 * @param {string} productId - The ID of the product to delete.
 */
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

/**
 * Edits a product and updates the displayed product list.
 * @param {Event} event - The submit event.
 * @param {string} productId - The ID of the product to edit.
 */
async function editAndShowProduct(event, productId) {
  event.preventDefault();
  editBtnProduct.disabled = true;
  await editProduct(event, productId);
  await fetchProducts();
  editBtnProduct.disabled = false;
  renderProducts(products);
  closeEditProductDialog();
}

/**
 * Gets the details of a product by its ID.
 * @param {string} productId - The ID of the product.
 * @returns {Object | null} - The details of the product, or null if not found.
 */
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

/**
 * Event listener to handle edit product submission.
 * @param {Event} e - The submit event.
 */
function handleEdit(e) {
  editAndShowProduct(e, productId);
}

// EVENT LISTENER

// Render products when the page loaded.
document.addEventListener("DOMContentLoaded", fetchProducts);

// Implements search bar functionality.
searchBar.addEventListener("keyup", searchProducts);
searchBar.addEventListener("submit", (e) => {
  // avoid refresh when submit
  e.preventDefault();
  searchProducts(e);
});

// Implements search bar functionality for enter key.
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchProducts(e);
  }
});

// Event listener for filter button.
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

// Event listener for filtering or sorting only.
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
  // Show dialog to add new product.
  addProductBtn.addEventListener("click", () => {
    addProductForm.removeEventListener("submit", addAndShowProduct);
    showAddProductDialog();
    addProductForm.addEventListener("submit", addAndShowProduct);
  });

  // Event handler for edit and remove product.
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

  // Close dialog of add new product.
  cancelAddProduct.addEventListener("click", () => {
    closeAddProductDialog();
  });

  // Close dialog of edit product.
  cancelEditProduct.addEventListener("click", () => {
    closeEditProductDialog();
  });
}

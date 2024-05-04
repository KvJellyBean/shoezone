// Variables to store products and user ID
let products;
let userId = document.querySelector("#logoutBtn.userData")
  ? document.querySelector("#logoutBtn.userData").dataset.userId
  : 0;

/**
 * Fetches products from the API and renders them on the page.
 */
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    products = await response.json();
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

/**
 * Fetches partners from the API and renders them on the page.
 */
async function fetchPartners() {
  try {
    const response = await fetch("/api/partners");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const partners = await response.json();
    renderPartners(partners);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
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
 * Renders the product list on the page.
 * @param {Array} products - The array of products to render.
 */
function renderProducts(products) {
  const hotProductContainer = document.querySelector(".hot-product div.row");
  hotProductContainer.innerHTML = "";

  products.forEach((product, index) => {
    hotProductContainer.innerHTML += `
    <!-- Product card -->
    <div class="col" data-aos="${
      index === 0 ? "fade-left" : index === 1 ? "fade-down" : "fade-right"
    }">
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
          ${
            userId === 0
              ? `<div class="text-center">
            <a class="btn btn-success mt-auto px-4 py-2 disabled" role="button">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </a>
          </div>`
              : `<div class="text-center">
            <a class="btn btn-success mt-auto px-4 py-2 addButtonHotProduct" role="button" data-product-id="${product._id}">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </a>
          </div>`
          }
        </div>
      </div>
    </div>
    
    `;
  });

  // Add to cart button functionality
  const addToCartButtons = document.querySelectorAll(".addButtonHotProduct");
  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      Toastify({
        text: "Product added to cart!",
        duration: 2000,
        destination: "/cart",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      addProductToCart(userId, e.target.dataset.productId);
    });
  });
}

/**
 * Renders partner logos on the page.
 * @param {Array} partners - The array of partners to render.
 */
function renderPartners(partners) {
  const partnerContainer = document.querySelector(".client-in ul");
  partners.forEach((partner) => {
    const li = document.createElement("li");
    li.dataset.aos = "zoom-out";
    li.innerHTML = `
    <a href="${partner.website}" target="_blank">
      <img src="${partner.logo}" alt="${partner.name} Shadow" />
      <img src="${partner.logo}" alt="${partner.name}" />
    </a>
    `;
    partnerContainer.appendChild(li);
  });
}

/**
 * Adds a product to the cart.
 * @param {Object} product - The product object to add to the cart.
 */
function addProductToCart(userId, productId) {
  const hotProduct = products.find((prod) => prod._id === productId);

  const cartData = {
    userId: userId,
    products: hotProduct,
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
            products: [...cart.products, hotProduct],
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

// Fetch and render products and partners when the page is loaded.
document.addEventListener("DOMContentLoaded", async function () {
  await fetchProducts();
  await fetchPartners();
});

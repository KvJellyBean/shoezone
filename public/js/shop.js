import LocalStorage from "./localStorage.js";
import products from "./products.js";

let searchResults = [];
let product = [];

// Check localStorage
if (LocalStorage.isStorageAvailable()) {
  LocalStorage.loadData();
  product = LocalStorage.getSavedData();
  console.log("Loaded data: ", product);
}

// Add to cart function
function addProductToCart(index, event) {
  event.preventDefault();
  console.log("Adding product to cart:", product);
  product.append(products[index]);
  LocalStorage.saveData(product);
}

// Search product function
function searchProducts(event) {
  event.preventDefault();
  const searchTerm = event.target.value;

  if (searchTerm.trim() !== "") {
    searchResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchResults.length === 0) {
      renderProducts(products);
    } else {
      renderProducts(searchResults);
    }
  }
}

// Rendering
const shopContainer = document.querySelector("#shop-cards");

function renderProducts(products) {
  shopContainer.innerHTML = "";

  products.forEach((product, index) => {
    shopContainer.innerHTML += `
            <!-- Product card -->
            <div class="col">
                <div class="card">
                
                <!-- Product image -->
                <div class="img-container">
                    <img
                    class="card-img-top p-5 p-md-3"
                    src=${product.image}
                    alt="Shoes ${product.name}"
                    />
                </div>
    
                <!-- Product details  p-4 -->
                <div class="card-body text-center pt-4">
                    
                    <!-- Product name -->
                    <h4 href="#" class="h4 text-primary text-decoration-none">
                    ${product.name}
                    </h4>
    
                    <!-- Product raiting -->
                    <div class="d-flex justify-content-center small text-warning my-2">
                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                    </div>
    
                    <!-- Product price -->
                    <div class="product-price">
                    <span class="price fw-bold ms-2">$ ${product.price}</span>
                    </div>
                </div>
    
                <!-- Product Add to cart -->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent mt-4">
                    <div class="text-center">
                    <a
                        href="#"
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
}

// Add to cart button functionality
const addToCartButtons = document.querySelectorAll(".addButtonShop");
addToCartButtons.forEach((button, index) => {
  console.log("Adding click event listener for " + button);
  button.addEventListener("click", (e) => {
    console.log("Clicked");
    addProductToCart(index, e);
  });
});

// Search bar functionality
const searchBar = document.querySelector(".form-control");
searchBar.addEventListener("keyup", searchProducts);
searchBar.addEventListener("submit", searchProducts);

// render products
renderProducts(products);

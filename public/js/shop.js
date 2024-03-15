const products = [
  {
    name: "Product 1",
    price: "18.55",
    description: "This is product 1",
    image: "./assets/slides/slide1.png",
  },
  {
    name: "Product 2",
    price: "18.55",
    description: "This is product 2",
    image: "./assets/slides/slide2.png",
  },
  {
    name: "Product 4",
    price: "18.55",
    description: "This is product 3",
    image: "./assets/slides/slide3.png",
  },
  {
    name: "Product 5",
    price: "18.55",
    description: "This is product 1",
    image: "./assets/slides/slide1.png",
  },
  {
    name: "Product 6",
    price: "18.55",
    description: "This is product 2",
    image: "./assets/slides/slide2.png",
  },
  {
    name: "Product 7",
    price: "18.55",
    description: "This is product 3",
    image: "./assets/slides/slide3.png",
  },
];
let searchResults = [];

function addProductToCart(product, event) {
  event.preventDefault();
  console.log("Adding product to cart:", product); // Add to cart logic
}

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

  products.forEach((product) => {
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
                        href="/cart"
                        class="btn btn-outline-dark mt-auto px-4 py-2"
                        role="button"
                        onclick="addProductToCart(${product}, event)"
                        ><i class="fa-solid fa-cart-shopping"></i> Add Cart</a
                    >
                    </div>
                </div>
                </div>
            </div>
        `;
  });
}
renderProducts(products);

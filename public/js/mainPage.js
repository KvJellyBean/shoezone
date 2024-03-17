// Carousel
document.addEventListener("DOMContentLoaded", function () {
  const myCarousel = new bootstrap.Carousel(
    document.getElementById("carouselExampleControls"),
    {
      interval: 4000,
      pause: false,
      wrap: true,
      keyboard: true,
      touch: true,
      slide: true,
    }
  );
});

const products = [
  {
    name: "Product 1",
    price: 18.55,
    description: "This is product 1",
    image: "/assets/slides/slide1.png",
  },
  {
    name: "Product 2",
    price: 18.55,
    description: "This is product 2",
    image: "/assets/slides/slide2.png",
  },
  {
    name: "Product 3",
    price: 18.55,
    description: "This is product 3",
    image: "/assets/slides/slide3.png",
  },
];

const hotProductContainer = document.querySelector(".hot-product div.row");

function renderProducts(products) {
  products.forEach((product) => {
    hotProductContainer.innerHTML += `
      <!-- Product card -->
      <div class="col">
      <div class="card">
          <!-- Product image -->
          <div class="img-container container">
          <img
              class="card-img-top p-5 p-md-3"
              src=${product.image}
              alt="Shoes ${product.name}"
          />
          </div>
  
          <!-- Product details -->
          <div class="card-body text-center pt-4">
          <!-- Product name -->
          <h4 href="/shop" class="h4 text-primary text-decoration-none">
              ${product.name}
          </h4>
          <!-- Product rating -->
          <div class="d-flex justify-content-center small text-warning my-2">
              <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
              <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
              <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
              <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
              <i class="fa-solid fa-star-half-stroke" style="color: #FFD43B;"></i>
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
              class="btn btn-outline-dark mt-auto px-4 py-2"
              href="/cart"
              role="button"
              onClick="addProductToCart(${product}, event)"
              >
              <i class="fa-solid fa-cart-shopping"></i> Add to cart
              </a>
          </div>
          </div>
      </div>
      </div>
      `;
  });
}

function addProductToCart(product, event) {
  event.preventDefault();
  console.log("Adding product to cart:", product); // Add to cart logic
}

renderProducts(products);

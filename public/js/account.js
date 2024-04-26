let products = [];
let partners = [];
let accounts = [];
let productId;
let partnerId;

let userId = document.querySelector("#logoutBtn.userData").dataset.userId;
let userRole = document.querySelector("#account-cards").dataset.userRole;

// DOM Elements for Admin UI
const productSection = document.querySelector(".dashboardTableProduct");
const productSectionBtn = document.querySelector("#productSection");
const partnerSection = document.querySelector(".dashboardTablePartner");
const partnerSectionBtn = document.querySelector("#partnerSection");

const productsContainer = document.querySelector("#product-table");
const addProductBtn = document.querySelector(".addProductBtn");
const addProductForm = document.querySelector("#addProductDialog form");
const submitBtnProduct = document.querySelector(".submitBtn");
const cancelAddProduct = document.querySelector(".cancelAddProduct");
const editProductForm = document.querySelector("#editProductDialog form");
const editBtnProduct = document.querySelector(".editBtn");
const cancelEditProduct = document.querySelector(".cancelEditProduct");

const partnersContainer = document.querySelector("#partner-table");
const addPartnerBtn = document.querySelector(".addPartnerBtn");
const addPartnerForm = document.querySelector("#addPartnerDialog form");
const submitBtnPartner = document.querySelector(".submitBtnPartner");
const cancelAddPartner = document.querySelector(".cancelAddPartner");
const editPartnerForm = document.querySelector("#editPartnerDialog form");
const editBtnPartner = document.querySelector(".editBtnPartner");
const cancelEditPartner = document.querySelector(".cancelEditPartner");

const searchBarProduct = document.querySelector(".productSearchBar");
const searchBarPartner = document.querySelector(".partnerSearchBar");

// DOM Elements for User UI
const formProfile = document.querySelector("#formProfile");
const submitEditProfile = document.querySelector(".submitEditProfile");

// Fetch Account from API
async function fetchAccount() {
  try {
    const response = await fetch("/api/account");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    accounts = await response.json();
    return accounts;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Fetch Product from API
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    products = await response.json();
    renderProductTable(products);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Fetch Partner from API
async function fetchPartners() {
  try {
    const response = await fetch("/api/partners");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    partners = await response.json();
    renderPartnerTable(partners);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Fungsi untuk mengubah active class dan dom content (partner section dan product section)
function handleDashboardSectionClick() {
  const section = document.querySelector(".dashboardSection");
  section.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.matches("ul") || e.target.matches("li")) return;

    document
      .querySelectorAll(".dashboardSection li .nav-link")
      .forEach((link) => {
        link.classList.remove("active");
      });

    if (e.target.matches(".dashboardSection li:nth-child(1) .nav-link")) {
      e.target.classList.add("active");

      // Show product section and hide partner section
      productSection.style.display = "block";
      productSection.style.visibility = "visible";
      partnerSection.style.display = "none";
      partnerSection.style.visibility = "hidden";
    } else if (
      e.target.matches(".dashboardSection li:nth-child(2) .nav-link")
    ) {
      e.target.classList.add("active");

      // Show partner section
      productSection.style.display = "none";
      productSection.style.visibility = "hidden";
      partnerSection.style.display = "block";
      partnerSection.style.visibility = "visible";
    }
  });
}

function renderProductTable(products) {
  productsContainer.innerHTML = "";

  products.forEach((product, index) => {
    const productRow = document.createElement("tr");
    productRow.innerHTML += `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>
        <img src="${product.image}" alt="${product.name} image" />
      </td>
      <td>${product.rating}</td>
      <td>${product.price}</td>
      <td>
        <button class="btn btn-primary editButton" data-product-id="${
          product._id
        }">Edit</button>
        <button class="btn btn-danger removeButton" data-product-id="${
          product._id
        }">Delete</button>
      </td>
    `;

    productsContainer.appendChild(productRow);
  });
}
// Problem in render partner table (didnt automate rerender)
function renderPartnerTable(partners) {
  partnersContainer.innerHTML = "";

  partners.forEach((partner, index) => {
    const partnerRow = document.createElement("tr");
    partnerRow.innerHTML += `
      <td>${index + 1}</td>
      <td>${partner.name}</td>
      <td>
        <img src="${partner.logo}" alt="${partner.name} image" />
      </td>
      <td>${partner.website}</td>
      <td>
        <button class="btn btn-primary editPartnerButton" data-partner-id="${
          partner._id
        }">Edit</button>
        <button class="btn btn-danger removePartnerButton" data-partner-id="${
          partner._id
        }">Delete</button>
      </td>
    `;

    partnersContainer.appendChild(partnerRow);
  });
}

// Product

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

function showAddProductDialog() {
  const dialog = document.querySelector("dialog#addProductDialog");
  const form = dialog.querySelector("form");
  form.reset();
  dialog.showModal();
}

function closeAddProductDialog() {
  const dialog = document.querySelector("dialog#addProductDialog");
  dialog.close();
}

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

function closeEditProductDialog() {
  const dialog = document.querySelector("dialog#editProductDialog");
  dialog.close();
}

async function addAndShowProduct(event) {
  event.preventDefault();
  submitBtnProduct.disabled = true;
  await addProduct(event);
  await fetchProducts();
  submitBtnProduct.disabled = false;
  closeAddProductDialog();
}

async function editAndShowProduct(event, productId) {
  event.preventDefault();
  editBtnProduct.disabled = true;
  await editProduct(event, productId);
  await fetchProducts();
  editBtnProduct.disabled = false;
  closeEditProductDialog();
}

async function deleteAndShowProduct(event, productId) {
  event.preventDefault();

  const isDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (isDelete) {
    await deleteProduct(event, productId);
    await fetchProducts();
  } else {
    return;
  }
}

function handleEdit(e) {
  editAndShowProduct(e, productId);
}

// Partner

async function addPartner(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#partnerNameInput").value;
  const logoInput = document.querySelector("#logoInput").files[0];
  const websiteInput = document.querySelector("#websiteInput").value;

  try {
    // Check if a partner with the same name already exists
    const existingPartner = partners.find(
      (partner) => partner.name.toLowerCase() === nameInput.toLowerCase()
    );
    if (existingPartner) {
      alert("A partner with the same name already exists.");
      return;
    }

    const formData = new FormData();

    formData.append("name", nameInput);
    formData.append("logo", logoInput);
    formData.append("website", websiteInput);

    fetch("/api/partners", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("There was a problem with adding the partner:", error);
  }
}

async function deletePartner(event, partnerId) {
  event.preventDefault();

  try {
    fetch(`/api/partners/${partnerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("There was a problem with deleting the partner:", error);
  }
}

async function editPartner(event, partnerId) {
  event.preventDefault();

  const nameInput = document.querySelector("#partnerNameEditInput").value;
  const logoInput = document.querySelector("#logoEditInput").files[0];
  const websiteInput = document.querySelector("#websiteEditInput").value;

  try {
    // Check if a partner with the same name already exists
    const existingPartner = partners.find(
      (partner) =>
        partner.name.toLowerCase() === nameInput.toLowerCase() &&
        partner._id !== partnerId
    );
    if (existingPartner) {
      alert("A partner with the same name already exists.");
      return;
    }

    const formData = new FormData();

    formData.append("name", nameInput);
    formData.append("logo", logoInput);
    formData.append("website", websiteInput);

    fetch(`/api/partners/${partnerId}`, {
      method: "PUT",
      body: formData,
    });
  } catch (error) {
    console.error("There was a problem with updating the partner:", error);
  }
}

async function getPartnerDetails(partnerId) {
  try {
    const response = await fetch(`/api/partners/${partnerId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with fetching partner details:", error);
    return null;
  }
}

function showAddPartnerDialog() {
  const dialog = document.querySelector("dialog#addPartnerDialog");
  const form = dialog.querySelector("form");
  form.reset();
  dialog.showModal();
}

function closeAddPartnerDialog() {
  const dialog = document.querySelector("dialog#addPartnerDialog");
  dialog.close();
}

async function showEditPartnerDialog(partnerId) {
  const partner = await getPartnerDetails(partnerId);

  if (partner) {
    const dialog = document.querySelector("dialog#editPartnerDialog");
    const form = dialog.querySelector("form");
    form.reset();

    // Populate form fields with partner details
    form.querySelector("#partnerNameEditInput").value = partner.name;
    form.querySelector("#websiteEditInput").value = partner.website;

    dialog.showModal();
  }
}

function closeEditPartnerDialog() {
  const dialog = document.querySelector("dialog#editPartnerDialog");
  dialog.close();
}

async function addAndShowPartner(event) {
  event.preventDefault();
  submitBtnPartner.disabled = true;
  await addPartner(event);
  await fetchPartners();
  submitBtnPartner.disabled = false;
  closeAddPartnerDialog();
  window.location.reload();
}

async function editAndShowPartner(event, partnerId) {
  event.preventDefault();
  editBtnPartner.disabled = true;
  await editPartner(event, partnerId);
  await fetchPartners();
  editBtnPartner.disabled = false;
  closeEditPartnerDialog();
}

async function deleteAndShowPartner(event, partnerId) {
  event.preventDefault();

  const isDelete = window.confirm(
    "Are you sure you want to delete this partner?"
  );

  if (isDelete) {
    await deletePartner(event, partnerId);
    await fetchPartners();
  } else {
    return;
  }
}

function handleEditPartner(e) {
  editAndShowPartner(e, partnerId);
  window.location.reload();
}

function searchProducts(e, searchBar) {
  e.preventDefault();
  const searchValue = searchBar.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue)
  );

  renderProductTable(filteredProducts);
}

function searchPartners(e, searchBar) {
  e.preventDefault();
  const searchValue = searchBar.value.toLowerCase();
  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchValue)
  );

  renderPartnerTable(filteredPartners);
}

// User Methods
function checkExistingAccount(field, value) {
  return accounts.some((account) => account[field] === value);
}

// Change account data
async function changeAccountData(event) {
  event.preventDefault();
  submitEditProfile.disabled = true;
  const username = document.querySelector("#username").value;
  const phone = document.querySelector("#phone").value;
  const address = document.querySelector("#address").value;
  const image = document.querySelector("#image").files[0];

  try {
    const theUser = accounts.find((account) => account._id === userId);

    if (theUser.username !== username) {
      if (checkExistingAccount("username", username.toLowerCase())) {
        alert("An account with the same username already exists.");
        return;
      }
    }

    if (theUser.phone !== phone) {
      if (checkExistingAccount("phone", phone)) {
        alert("Phone number already used.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("password", theUser.password);
    formData.append("username", username);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("image", image);

    const response = await fetch(`/api/account/${userId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with updating the account:", error);
  }
  submitEditProfile.disabled = false;
}

document.addEventListener("DOMContentLoaded", async function () {
  if (userRole === "admin") {
    await fetchProducts();
    await fetchPartners();

    // Product Section
    productSectionBtn.addEventListener("click", handleDashboardSectionClick);

    addProductBtn.addEventListener("click", () => {
      addProductForm.removeEventListener("submit", addAndShowProduct);
      showAddProductDialog();
      addProductForm.addEventListener("submit", addAndShowProduct);
    });

    productsContainer.addEventListener("click", (e) => {
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

    cancelAddProduct.addEventListener("click", () => {
      closeAddProductDialog();
    });

    cancelEditProduct.addEventListener("click", () => {
      closeEditProductDialog();
    });

    // Partner Section
    partnerSectionBtn.addEventListener("click", handleDashboardSectionClick);

    // avoid multiple click on button

    addPartnerBtn.addEventListener("click", () => {
      addPartnerForm.removeEventListener("submit", addAndShowPartner);
      showAddPartnerDialog();
      addPartnerForm.addEventListener("submit", addAndShowPartner);
    });

    partnersContainer.addEventListener("click", (e) => {
      editPartnerForm.removeEventListener("submit", handleEditPartner);

      if (e.target.matches(".editPartnerButton")) {
        partnerId = e.target.dataset.partnerId;
        showEditPartnerDialog(partnerId);
        editPartnerForm.addEventListener("submit", handleEditPartner);
      } else if (e.target.matches(".removePartnerButton")) {
        partnerId = e.target.dataset.partnerId;
        deleteAndShowPartner(e, partnerId);
        window.location.reload();
      }
    });

    cancelAddPartner.addEventListener("click", () => {
      closeAddPartnerDialog();
    });

    cancelEditPartner.addEventListener("click", () => {
      closeEditPartnerDialog();
    });

    // Search Bar
    searchBarProduct.addEventListener("keyup", (e) =>
      searchProducts(e, searchBarProduct)
    );
    searchBarProduct.addEventListener("submit", (e) =>
      searchProducts(e, searchBarProduct)
    );

    searchBarPartner.addEventListener("keyup", (e) =>
      searchPartners(e, searchBarPartner)
    );
    searchBarPartner.addEventListener("submit", (e) =>
      searchPartners(e, searchBarPartner)
    );
  } else {
    await fetchAccount();

    formProfile.addEventListener("submit", async (event) => {
      await changeAccountData(event);
      window.location.reload();
    });
  }
});

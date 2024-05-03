// DOM Elements.
const form = document.querySelector("form");
const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");
const passwordInput = document.getElementById("password");
const icon = document.querySelector(".toggle-password");

/**
 * Event listener for form submission to handle user login.
 * @param {Event} e - The form submission event.
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear any previous error messages
  emailError.textContent = "";
  passwordError.textContent = "";

  // Retrieve email and password from the form
  const email = form.email.value;
  const password = form.password.value;

  try {
    // Send a POST request to the server to authenticate the user
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    // Parse the response JSON data
    const data = await res.json();

    // Handle errors, if any, and display them to the user
    if (data.errors) {
      emailError.textContent += data.errors.email;
      passwordError.textContent += data.errors.password;
    }

    // If login is successful, retrieve the user's cart and purchase history
    if (data._id && data.email) {
      const userCart = await fetch(`/api/carts/${data._id}`);
      const dataCart = await userCart.json();

      // Create a cart for the user if they don't have one
      if (!dataCart.length) {
        fetch("/api/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data._id, products: [] }),
        });
      }

      const userPurchaseHistory = await fetch(
        `/api/purchaseHistory/${data._id}`
      );
      const dataPurchaseHistory = await userPurchaseHistory.json();

      // Create a purchase history for the user if they don't have one
      if (!dataPurchaseHistory.length) {
        fetch("/api/purchaseHistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data._id, products: [] }),
        });
      }

      // Redirect the user to the homepage after successful login
      location.assign("/");
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Event listener to toggle password visibility.
 */
icon.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
});

// DOM Elements.
const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const iconEye1 = document.querySelector(".toggle-password.eye1");
const iconEye2 = document.querySelector(".toggle-password.eye2");
const usernameError = document.querySelector(".usernameError");
const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");

/**
 * Event listener for form submission to handle user signup.
 * @param {Event} e - The form submission event.
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear any previous error messages
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  // Retrieve user input values
  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    passwordError.textContent = "Password and confirm password do not match";
    return;
  }

  try {
    // Send a POST request to the server to sign up the user
    const res = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    // Parse the response JSON data
    const data = await res.json();

    // Handle errors, if any, and display them to the user
    if (data.errors) {
      usernameError.textContent += data.errors.username;
      emailError.textContent += data.errors.email;
      passwordError.textContent += data.errors.password;
    }

    // If signup is successful, create an empty cart and purchase history for the user
    if (data._id && data.email) {
      fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data._id, products: [] }),
      });

      fetch("/api/purchaseHistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data._id, products: [] }),
      });

      // Redirect the user to the homepage after successful signup
      location.assign("/");
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Event listener to toggle password visibility.
 */
iconEye1.addEventListener("click", function () {
  // Toggle password visibility
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    iconEye1.classList.remove("fa-eye-slash");
    iconEye1.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    iconEye1.classList.remove("fa-eye");
    iconEye1.classList.add("fa-eye-slash");
  }
});

/**
 * Event listener to toggle confirm password visibility.
 */
iconEye2.addEventListener("click", function () {
  // Toggle confirm password visibility
  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    iconEye2.classList.remove("fa-eye-slash");
    iconEye2.classList.add("fa-eye");
  } else {
    confirmPasswordInput.type = "password";
    iconEye2.classList.remove("fa-eye");
    iconEye2.classList.add("fa-eye-slash");
  }
});

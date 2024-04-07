const form = document.querySelector("form");
// DOM Element
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const iconEye1 = document.querySelector(".toggle-password.eye1");
const iconEye2 = document.querySelector(".toggle-password.eye2");
const usernameError = document.querySelector(".usernameError");
const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");

// Form event to sign up an user
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (password !== confirmPassword) {
    passwordError.textContent = "Password and confirm password do not match";
    return;
  }

  try {
    const res = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.errors) {
      usernameError.textContent += data.errors.username;
      emailError.textContent += data.errors.email;
      passwordError.textContent += data.errors.password;
    }
    if (data._id && data.email) {
      location.assign("/");
    }
  } catch (error) {
    console.log(error);
  }
});

// Show and hide password
iconEye1.addEventListener("click", function () {
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

// Show and hide confirm password
iconEye2.addEventListener("click", function () {
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

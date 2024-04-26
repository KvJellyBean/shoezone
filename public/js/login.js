// DOM Element
const form = document.querySelector("form");
const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");
const passwordInput = document.getElementById("password");
const icon = document.querySelector(".toggle-password");

// Form event to login
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  emailError.textContent = "";
  passwordError.textContent = "";

  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.errors) {
      emailError.textContent += data.errors.email;
      passwordError.textContent += data.errors.password;
    }
    if (data._id && data.email) {
      const userCart = await fetch(`/api/carts/${data._id}`);
      const dataCart = await userCart.json();
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
      if (!dataPurchaseHistory.length) {
        fetch("/api/purchaseHistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data._id, products: [] }),
        });
      }

      location.assign("/");
    }
  } catch (error) {
    console.log(error);
  }
});

// Show and hide password
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

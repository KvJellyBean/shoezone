document.addEventListener("DOMContentLoaded", function () {
    const loginregis = document.querySelector(".loginregis");
    const btnpopup = document.querySelector(".popup-login");
    btnpopup?.addEventListener("click", function () {
      loginregis?.classList.add("active-popup");
    });
  
    const loginlink = document.querySelector(".login-link");
    const registerlink = document.querySelector(".register-link");
    registerlink?.addEventListener("click", function (event) {
      event.preventDefault();
      loginregis?.classList.add("active");
    });
  
    loginlink?.addEventListener("click", function (event) {
      event.preventDefault();
      loginregis?.classList.remove("active");
    });
  
    const iconclose = document.querySelector(".close");
    iconclose?.addEventListener("click", function () {
      loginregis?.classList.remove("active-popup");
    });
  });
  
  function validateForm() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("cpassword").value;
  
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return false;
    }
    return true;
  }
  
  function togglePassword(field, iconId) {
    const input = document.getElementById(field);
    const icon = document.querySelector(`#${iconId}`);
  
    if (input.type === "password") {
      input.type = "text";
      icon.className = "fa-solid fa-eye";
    } else {
      input.type = "password";
      icon.className = "fa-solid fa-eye-slash";
    }
  }
  
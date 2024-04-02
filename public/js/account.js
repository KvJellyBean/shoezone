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

// Carousel
document.addEventListener("DOMContentLoaded", function () {
  const myCarousel = new bootstrap.Carousel(
    document.getElementById("carouselExampleAutoplaying"),
    {
      interval: 3000,
      pause: false,
      wrap: true,
      keyboard: true,
      touch: true,
      slide: true,
    }
  );
});

const registerForm = document.querySelector('.form-regis form');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('regisEmail').value;
  const password = document.getElementById('password').value;

  console.log('Username:', username);
  console.log('Email:', email);
  console.log('Password:', password);

  fetch('/api/accounts/registers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
    }),
  })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.error) {
        document.getElementById('registrationStatus').innerHTML = `<p>${responseData.error}</p>`;
      } else {
        setTimeout(() => {
          window.location.href = '/shop';
        }, 1000);    
        document.getElementById('registrationStatus').innerHTML = '<p>Registration successful!</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

const loginForm = document.querySelector('.form-login form');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  console.log('Email:', email);
  console.log('Password:', password);

  fetch('/api/accounts/logins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.accessToken) {
        // Login successful
        // Save access token to local storage
        localStorage.setItem('accessToken', data.accessToken);
        // Redirect to shop page after 1 second
        setTimeout(() => {
          window.location.href = '/shop';
        }, 1000);
      } else {
        // Login failed
        document.getElementById('loginStatus').innerHTML = '<p>Incorrect email or password</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('loginStatus').innerHTML = '<p>Login failed: Server error</p>';
    });
});



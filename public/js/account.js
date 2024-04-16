// Memilih elemen kontainer akun dan mendapatkan peran pengguna
const accountContainer = document.querySelector("#account-cards");
const userRole = accountContainer.dataset.userRole;

// Jika peran pengguna adalah "user"
if(userRole === "user"){
    let accounts = [];

    // Fungsi untuk mengaktifkan/menonaktifkan mode pengeditan untuk bidang tertentu
    function toggleEdit(field) {
        var inputField = document.getElementById(field + 'Input');
        var editButton = document.querySelector('.' + field + '-button');
        if (inputField.disabled) {
            inputField.disabled = false;
            inputField.focus();
            editButton.innerHTML = '<i class="fas fa-check"></i>';
        } else {
            inputField.disabled = true;
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
        }
    }

    // Fungsi untuk mengubah visibilitas password
    function togglePasswordVisibility(inputId) {
        var inputElement = document.getElementById(inputId);
        var toggleIcon = document.getElementById("toggle-" + inputId);

        if (inputElement.type === "password") {
            inputElement.type = "text";
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash");
        } else {
            inputElement.type = "password";
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye");
        }
    }

    // Mendapatkan akun dari API
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

    // Mendapatkan ID akun pengguna
    let accountId = document.querySelector('#account-cards').dataset.user;

    // Fungsi untuk mengedit akun
    // Fungsi untuk mengedit akun
async function editAccount(event, accountId) {
    event.preventDefault();

    let accounts = await fetchAccount();
    
    let userData = await accounts.find(account => account.objectId === accountId);
    const usernameInput = document.querySelector("#usernameInput").value;
    const nameInput = document.querySelector("#nameInput").value;
    const addressInput = document.querySelector("#addressInput").value;
    const emailInput = document.querySelector("#emailInput").value;
    const phoneInput = document.querySelector("#phoneInput").value;

    try {
        const response = await fetch(`/api/account/${accountId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...userData,
                username: usernameInput,
                name: nameInput,
                address: addressInput,
                email: emailInput,
                phone: phoneInput,
            }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // Menampilkan pesan "Data berhasil diubah"
        alert("Data berhasil diubah");

        // Merefresh halaman
        location.reload();

    } catch (error) {
        console.error("There was a problem with updating the account:", error);
    }
}


    // Mendapatkan elemen untuk menambahkan akun
    const addAccount = document.querySelector("#account-cards");

    // Event listener untuk mengedit akun saat formulir disubmit
    addAccount.addEventListener("submit", (e)=>{
        e.preventDefault();
        editAccount(e, accountId);
    });
}

// Jika peran pengguna adalah "admin"
else if (userRole === "admin") {
    let products = [];
    const addProductForm = document.querySelector("#account-cards");

    // Mendapatkan produk dari API
    async function fetchProducts() {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            products = await response.json();

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    }

    fetchProducts();

    // Fungsi untuk menambahkan produk
    async function addProduct(event) {
        event.preventDefault();
        const nameInput = document.querySelector("#nameInput").value;
        const priceInput = document.querySelector("#priceInput").value;
        const descriptionInput = document.querySelector("#descriptionInput").value;
        const imageInput = document.querySelector("#imageInput").value;
        const ratingInput = document.querySelector("#ratingInput").value;

        try {
            const existingProduct = products.find(
                (product) => product.name.toLowerCase() === nameInput.toLowerCase()
            );
            if (existingProduct) {
                alert("A product with the same name already exists.");
                return;
            }

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nameInput,
                    price: priceInput,
                    description: descriptionInput,
                    image: imageInput,
                    rating: ratingInput,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Menampilkan pesan
            alert("Product berhasil ditambahkan");

            // Merefresh halaman
            location.reload();
        } catch (error) {
            console.error("There was a problem with adding the product:", error);
        }
    }

    // Event listener untuk menambahkan produk saat formulir disubmit
    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addProduct(e);
    });
}

// Fungsi untuk merender tampilan akun
function renderAccount() {    
    if(userRole === "admin"){
        accountContainer.innerHTML = "";
        accountContainer.innerHTML+=`   <form class="container light-style flex-grow-1 container-p-y">            
        <div class="card overflow-hidden">
            <div class="row no-gutters row-bordered row-border-light"  data-user-role="<%= userRole %>">
                <h4 class="font-weight-bold py-3 mb-60 text-center">Add Product </h4>
                </div>
                <div class="col-md-12">
                    <div class="tab-content">
                        <div class="tab-pane fade active show" id="account-info">
                            <div class="card-body pb-2">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="form-label">Product Name:</label>
                                        <input
                                            class="form-control"
                                            name="name"
                                            type="text"
                                            id="nameInput"
                                            value=""
                                            autocomplete="true"
                                            required
                                            placeholder="Enter shoes name..."/>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label class="form-label">Price:</label>
                                        <input 
                                            class="form-control"
                                            name="price"
                                            type="number"
                                            id="priceInput"
                                            min="0"
                                            step="0.01"
                                            value=""
                                            required
                                            placeholder="Enter price in dollar (e.g.150.50)">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Description:</label>
                                    <textarea
                                        class="form-control"
                                        name="description"
                                        id="descriptionInput"
                                        rows="5"
                                        value=""
                                        required
                                        placeholder="Enter the shoes description..."
                                    ></textarea>
                                </div> 
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="form-label">Shoe' Image Link:</label>
                                        <input 
                                            class="form-control"
                                            name="image"
                                            type="text"
                                            id="imageInput"
                                            value=""
                                            required
                                            placeholder="Enter link (e.g. https://nike.com/shoes/nike-white-shoes)">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label class="form-label">Rating:</label>
                                        <input 
                                            class="form-control"
                                            name="rating"
                                            type="number"
                                            id="ratingInput"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value=""
                                            required
                                            placeholder="Enter shoes rating...">
                                    </div>
                                </div>
                                <div class="text-right mt-3 center-buttons">
                                    <div class="btn-group">
                                        <button id="submit" type="submit" class="btn btn-success submitBtn">Save changes</button>&nbsp;
                                        <button type="button" class="btn btn-danger cancelAddProduct">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </form>`;
    }  
}

//Tombol cancel
document.addEventListener("DOMContentLoaded", function() {
    const cancelButton = document.querySelector(".cancelAddProduct");
    cancelButton.addEventListener("click", function() {
        window.location.reload();
    });
});

// Memanggil fungsi renderAccount untuk menginisialisasi tampilan
renderAccount();

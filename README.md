<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/KvJellyBean/shoezone">
    <img src="public/assets/shoezone.png" alt="ShoeZone Logo" width="300" height="auto">
  </a>

<h1 align="center">ShoeZone</h1>

  <p align="center">
    Full-Stack E-Commerce Platform for Footwear
    <br />
    A modern online shoe store built with Express.js and MongoDB
    <br />
    <br />
    <a href="https://github.com/KvJellyBean/e-commerce-js/issues">Report Bug</a>
    ·
    <a href="https://github.com/KvJellyBean/e-commerce-js/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-documentation">API Documentation</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![ShoeZone Screenshot][product-screenshot]](https://github.com/KvJellyBean/shoezone)

ShoeZone is a full-featured e-commerce platform specialized in footwear retail. Built with modern web technologies, it provides a seamless shopping experience with user authentication, shopping cart management, product catalog, and order processing capabilities.

**Why ShoeZone?**

- 🛒 **Complete Shopping Experience**: Browse products, manage cart, and track purchase history
- 👤 **User Authentication**: Secure login/signup with JWT-based authentication
- 🎨 **Responsive Design**: Mobile-first approach ensuring great UX across all devices
- 🔐 **Role-Based Access**: Admin dashboard for product and partner management
- 📦 **Real-time Updates**: Dynamic product catalog with instant cart updates

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Node.js][Node.js]][Node-url]
- [![Express.js][Express.js]][Express-url]
- [![MongoDB][MongoDB]][MongoDB-url]
- [![EJS][EJS]][EJS-url]
- [![JWT][JWT]][JWT-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with bcrypt password hashing
- 👥 **User Management**: User registration, login, and profile management
- 🛍️ **Product Catalog**: Browse and search through shoe collections
- 🛒 **Shopping Cart**: Add, update, and remove items from cart
- 📦 **Order Management**: Purchase history tracking and order processing
- 👨‍💼 **Admin Dashboard**: Manage products, partners, and view analytics
- 🤝 **Partner Management**: Add and manage business partners
- 📱 **Responsive UI**: Mobile-optimized interface with carousel and dynamic layouts
- 🔒 **Secure Routes**: Protected API endpoints with authentication middleware
- 📊 **RESTful API**: Well-structured API endpoints for all operations

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up ShoeZone locally for development.

### Prerequisites

Ensure you have the following installed:

- **Node.js 18+**
  ```sh
  node --version
  ```
- **MongoDB** (local or Atlas)
  ```sh
  mongod --version
  ```
- **Git**
  ```sh
  git --version
  ```

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/KvJellyBean/e-commerce-js.git
   cd e-commerce-js
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/shoezone
   # Or use MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shoezone

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Session Configuration
   SESSION_SECRET=your_session_secret_here
   ```

4. **Import sample data (optional)**

   If you have sample data in the `db/` folder:

   ```sh
   mongoimport --db shoezone --collection accounts --file db/shoezone.accounts.json --jsonArray
   mongoimport --db shoezone --collection products --file db/shoezone.products.json --jsonArray
   ```

5. **Start the development server**

   ```sh
   npm start
   # or for development with auto-reload
   npm run dev
   ```

6. **Access the application**

   Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### User Flow

1. **Sign Up**: Navigate to `/signup` to create a new account
2. **Login**: Access your account at `/login`
3. **Browse Products**: View available shoes on the shop page
4. **Add to Cart**: Click on products to add them to your cart
5. **Checkout**: Review cart and complete purchase
6. **View History**: Check your purchase history in the account section

### Admin Features

1. **Login as Admin**: Use admin credentials
2. **Manage Products**: Add, edit, or delete products from the catalog
3. **Manage Partners**: Add or update business partner information
4. **View Analytics**: Monitor sales and user activity

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- API DOCUMENTATION -->

## API Documentation

### Authentication Endpoints

- `POST /api/accounts/register` - Register new user
- `POST /api/accounts/login` - User login
- `POST /api/accounts/logout` - User logout

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart Endpoints

- `GET /api/carts` - Get user's cart
- `POST /api/carts` - Add item to cart
- `PUT /api/carts/:id` - Update cart item
- `DELETE /api/carts/:id` - Remove item from cart

### Partner Endpoints

- `GET /api/partners` - Get all partners
- `POST /api/partners` - Add new partner (Admin)
- `PUT /api/partners/:id` - Update partner (Admin)
- `DELETE /api/partners/:id` - Delete partner (Admin)

### Purchase History Endpoints

- `GET /api/purchase-history` - Get user's purchase history
- `POST /api/purchase-history` - Create new purchase record

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->

## Project Structure

```
shoezone/
├── db/                          # Database seed files
│   ├── shoezone.accounts.json
│   └── shoezone.products.json
├── middleware/                  # Custom middleware
│   └── authMiddleware.js       # JWT authentication
├── models/                      # Mongoose models
│   ├── accounts.js
│   ├── carts.js
│   ├── partners.js
│   ├── products.js
│   └── purchaseHistory.js
├── public/                      # Static assets
│   ├── assets/                 # Images
│   ├── css/                    # Stylesheets
│   └── js/                     # Client-side scripts
├── routes/                      # API routes
│   └── api/
│       ├── accounts.js
│       ├── carts.js
│       ├── partners.js
│       ├── products.js
│       └── purchaseHistory.js
├── views/                       # EJS templates
│   ├── layouts/                # Reusable components
│   ├── account.ejs
│   ├── cart.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── shop.ejs
│   └── signup.ejs
├── .env                         # Environment variables
├── index.js                     # Application entry point
├── package.json                 # Dependencies
└── vercel.json                 # Vercel deployment config
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] User authentication and authorization
- [x] Product catalog with CRUD operations
- [x] Shopping cart functionality
- [x] Purchase history tracking
- [x] Admin dashboard
- [x] Partner management
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Order tracking system

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions make the open source community amazing! Any contributions you make are **greatly appreciated**.

If you have suggestions for improvements:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Comment complex logic
- Test your changes before committing
- Keep code DRY (Don't Repeat Yourself)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTORS -->

## Contributors

**Kelompok 11**

- **535220060** - Ari Wijaya ([@Ariwjy](https://github.com/Ariwjy))
- **535220077** - Richard Vincentius ([@XTu17As](https://github.com/XTu17As))
- **535220084** - Kevin Natanael ([@KvJellyBean](https://github.com/KvJellyBean))

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/KvJellyBean/e-commerce-js.svg?style=for-the-badge
[contributors-url]: https://github.com/KvJellyBean/e-commerce-js/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/KvJellyBean/e-commerce-js.svg?style=for-the-badge
[forks-url]: https://github.com/KvJellyBean/e-commerce-js/network/members
[stars-shield]: https://img.shields.io/github/stars/KvJellyBean/e-commerce-js.svg?style=for-the-badge
[stars-url]: https://github.com/KvJellyBean/e-commerce-js/stargazers
[issues-shield]: https://img.shields.io/github/issues/KvJellyBean/e-commerce-js.svg?style=for-the-badge
[issues-url]: https://github.com/KvJellyBean/e-commerce-js/issues
[product-screenshot]: public/assets/preview.jpeg

<!-- Technology Badges -->

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[EJS]: https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black
[EJS-url]: https://ejs.co/
[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[JWT-url]: https://jwt.io/

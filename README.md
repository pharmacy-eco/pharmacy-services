# sow-wear-services

Welcome to Sow Wear, the ultimate destination where shopping meets social connection! Discover trending products, connect with like-minded shoppers, and share your finds with friends. Whether you’re looking for the latest fashion, gadgets, or unique handmade items, we’ve got something for everyone.

# Sow Wear - E-Commerce for Clothing

Welcome to **Sow Wear**, an e-commerce platform that connects people who want to buy and sell secondhand clothing. Built with **NestJS**, **Next.js**, **Redis**, and **MySQL**, this platform offers a seamless experience for users to browse, buy, and sell pre-owned clothes.

## 🚀 Technologies Used

- **NestJS**: A progressive Node.js framework for building scalable and maintainable server-side applications. It's used to handle the backend logic for our platform.
- **Next.js**: A React-based framework for building static and dynamic websites. It powers the frontend of our e-commerce platform.
- **Redis**: A fast in-memory data store, used for caching to ensure quick access to frequently requested data.
- **MySQL**: A relational database used to store product listings, user accounts, order data, and more.

## 🌟 Features

- **User Authentication & Authorization**: Secure login, registration, and profile management with role-based access control for buyers and sellers.
- **Product Listings**: Sellers can upload their pre-loved clothes, adding descriptions, images, and pricing.
- **Search & Filters**: Users can easily search and filter items based on category, size, condition, price, and more.
- **Shopping Cart & Checkout**: Manage cart items, and proceed with checkout for purchases.
- **Order Management**: Track orders from placement to delivery.
- **Payment Gateway**: Integration with popular payment gateways for secure transactions (e.g., Stripe, PayPal).
- **User Reviews & Ratings**: Buyers can leave feedback on products and sellers.
- **Fast Performance**: Redis caching ensures that users experience fast load times and reduced latency.

## 🛠 Installation

--yarn or npm run i --f

## Migrations

console

- **run**: npm run migration:run Chạy migration tạo DB từ các migration đã có
- **create**: npm run migration:create --name=db_name_table tạo các migration mới cho các entity
- **generate**: npm run migration:generate --name=db_name_table tạo migration từ enity đã có
- **revert**: npm run migration:revert chuyển về migration được chạy gần nhất hoặc theo lich sử trong DB

## Husky

- **feat**: 'feat', // Tính năng mới.
- **fix**: 'fix', // Sửa lỗi
- **docs**: 'docs', // Chỉnh sửa tài liệu
- **refactor**: 'refactor', // Cải thiện code (không thay đổi tính năng)
- **perf**: 'perf', // Cải thiện hiệu suất
- **test**: 'test', // Bổ sung/chỉnh sửa test
- **chore**: 'chore', // Công việc lặt vặt (chạy lệnh, CI/CD...)

## Eslint

- **CheckEslint**: yarn lint or npm run lint // Kiểm tra lỗi eslint

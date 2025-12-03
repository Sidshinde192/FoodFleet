🍽️ FoodFleet – Full-Stack Food Ordering System

FoodFleet is a scalable and secure online food ordering application built using React, Spring Boot, and MongoDB.
The platform supports real-time menu browsing, user authentication, order placement, payments, and admin-level operations.
It is designed for high performance, easy scalability, and a smooth user experience.

🚀 Features
💻 Frontend (React)

Responsive and modern UI using React

Dynamic menu display with category and item filtering

Cart and order summary management

JWT-based user authentication

Secure checkout flow

Razorpay integrated payment page

🛠️ Backend (Spring Boot)

RESTful APIs for authentication, menu items, orders, and payments

JWT authentication + role-based access (User / Admin)

MongoDB for high-performance NoSQL storage

Service-layer architecture for clean and maintainable code

Error handling + validation filters

File upload support (food images → AWS S3)

☁️ Cloud Integration

AWS S3 for storing food images

CORS configuration for frontend-backend communication

Environment variables for secure deployment

Optimized API response times (up to 35% faster)

🧱 Tech Stack
Frontend

React.js

JavaScript (ES6+)

HTML5, CSS3

Vite

Axios

Backend

Java

Spring Boot

Spring Security (JWT)

Spring Web

MongoDB

Maven

Cloud & Tools

AWS S3

Razorpay Payments

Git + GitHub

Postman

⚙️ How to Run Backend
1. Install dependencies
mvn clean install

2. Update application.properties
spring.application.name=foddiesapi
spring.data.mongodb.uri=mongodb://localhost:27017/foodies

# AWS Config
aws.access.key=
aws.secret.key=
aws.region=
aws.s3.bucketname=

# JWT Secret
jwt.secret.key=

3. Run the Spring Boot server
mvn spring-boot:run


Backend runs on: http://localhost:8080

⚙️ How to Run Frontend
1. Install dependencies
npm install

2. Start the development server
npm run dev


Frontend runs on: http://localhost:5173

VS Code / IntelliJ

Docker (optional)

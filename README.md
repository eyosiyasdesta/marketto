# Marketto — Full-Stack E-Commerce Storefront

Marketto is a modern, editorial-style e-commerce web application built with a **React + Vite** frontend and a **Java Spring Boot** backend. Designed around a clean, considered shopping experience, it features curated product collections, real-time search and category filtering, wishlist and shopping bag management, order tracking, and standalone customer support portals.

---

## ✨ Key Features

- **Curated Storefront & Auto-Sliding Hero Carousel:** Smooth, interactive hero banner showcasing featured collections with touch/swipe support, manual controls, and pause/play toggles.
- **Product Discovery & Filtering:** Browse across categories (_Electronics_, _Clothing_, _Home & Living_, _Books_, _Accessories_), search products dynamically, and inspect detailed product views.
- **Shopping Bag & Wishlist:** Persistent cart and wishlist workflows with live item counters in the storefront header.
- **Order Management & Tracking:** Built-in order history and dedicated **Track Order** and **Store Locations** views integrated into the storefront.
- **Customer Support & Info Portals:** Dedicated standalone routes for Contact, Careers, FAQs, Returns Policy, and Shipping Information.
- **Full-Stack REST API & Docker Support:** Backed by a Spring Boot Maven service (`src/` + `pom.xml`) with Docker deployment configuration.

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)

- **Framework:** React (Vite)
- **Routing:** TanStack Router (`@tanstack/react-router`)
- **Data Fetching & Caching:** TanStack Query (`@tanstack/react-query`)
- **UI & Styling:** Custom CSS design system, Lucide Icons (`lucide-react`)
- **Deployment:** Vercel (configured with SPA rewrites)

### Backend (`/src`)

- **Language & Framework:** Java, Spring Boot (Maven Wrapper `./mvnw`)
- **Containerization:** Docker (`Dockerfile`)

---

## 📁 Project Structure

```text
marketto/
├── frontend/               # React + Vite storefront application
│   ├── public/             # Static assets & hero imagery
│   ├── src/
│   │   ├── components/     # Reusable store layout, header, footer & product cards
│   │   ├── pages/          # Home, Products, Cart, Wishlist, Orders & Info views
│   │   ├── routes/         # TanStack Router definitions
│   │   └── api.js          # API client & collection data
│   └── vercel.json         # SPA routing configuration for Vercel
├── src/                    # Spring Boot backend source code
├── pom.xml                 # Maven dependencies and build configuration
└── Dockerfile              # Backend container setup

## Getting Started
Prerequisites
Node.js (v18+ recommended) & npm

Java JDK 17+ (for running the Spring Boot backend locally)

1. Run the Frontend
Bash
cd frontend
npm install
npm run dev
The storefront will be available at http://localhost:5173.
```

2. Run the Backend
   From the project root (marketto/):

Bash
./mvnw spring-boot:run

🌐 Deployment
Frontend: Deployed on Vercel with Root Directory set to frontend and SPA route rewrites handled via frontend/vercel.json.

Backend: Container-ready via the included Dockerfile

Author
Eyosiyas Desta

Portfolio: eyosiyasdesta.me

GitHub: @eyosiyasdesta

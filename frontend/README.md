# Marketto React Frontend

Modern React (JSX) frontend built with Vite, React Router, and Context API, connecting directly to the Marketto Spring Boot backend.

## Quick Start

### 1. Start the Spring Boot Backend
Make sure your Spring Boot server is running on `http://localhost:8080`:
```bash
./mvnw spring-boot:run
```

### 2. Start the React Frontend Dev Server
In the `frontend` directory:
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

All `/api/*` requests (auth, products, categories, cart, orders) are automatically proxied to `http://localhost:8080`.

---

## Production Build

To compile a production build:
```bash
npm run build
```
The output will be placed in `frontend/dist/`.

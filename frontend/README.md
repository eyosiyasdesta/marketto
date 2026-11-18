# Marketto frontend

Marketto's Lovable storefront, running as a Vite single-page app and connected to the Spring Boot API.

## Run locally

1. Start the Spring Boot application on `http://localhost:8080`.
2. In this folder, run `npm install` once, then `npm run dev`.
3. Open `http://localhost:5173`.

Vite proxies `/api/*` requests to Spring Boot. The app uses the backend's JWT login, product, cart, and order endpoints. Payment processing and profile editing are not provided by the current backend.

## Production

Run `npm run build`. The generated `dist/` folder is copied into Spring Boot's static resources by the root Dockerfile.

# CraveBite - Online Food Delivery App

A full-stack modern food delivery web application featuring a stunning dark UI with glassmorphism effects and dynamic animations.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS v4, Framer Motion, Recharts, React Router
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Raw SQL queries using `pg` driver)

## Features
- **Modern UI**: Dark theme (#0a0a0a) with #ff4d00 accents and glassmorphism cards.
- **Restaurant Discovery**: Search and filter by cuisine type.
- **Dynamic Cart**: Context-based cart with conflict resolution for multi-restaurant additions.
- **Live Order Tracking**: Animated stepper showing real-time order status.
- **Admin Dashboard**: Real-time KPI cards, Recharts data visualization (Revenue, Orders, Popular Items).

## Setup Instructions

### 1. Database Setup
1. Ensure you have a PostgreSQL server running locally.
2. The backend expects a database named `food_delivery`. 
3. Execute the schema and seed files to initialize the database:
```bash
createdb food_delivery -U postgres
psql -U postgres -d food_delivery -f backend/db/schema.sql
psql -U postgres -d food_delivery -f backend/db/seed.sql
```
*(If your postgres credentials differ, update the `pool.js` environment variables or defaults).*

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
*(The backend will run on port 5001).*

### 3. Frontend Setup
1. Open another terminal and navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
*(The app will be available at `http://localhost:5173`)*

## Database Architecture & SQL Concepts Used

This application avoids ORMs entirely in favor of advanced raw SQL concepts to ensure data integrity and performance directly at the database layer.

### 1. Constraints & Enums
- **ENUMs**: `order_status`, `vehicle_type`, `payment_method`, and `payment_status` restrict columns to specific predefined values ensuring data consistency.
- **Foreign Keys**: Used extensively with `ON DELETE CASCADE` or `ON DELETE SET NULL` to maintain relational integrity (e.g., deleting a restaurant deletes its menu items).
- **Check Constraints**: E.g., `quantity INT NOT NULL CHECK (quantity > 0)` and `rating INT CHECK (rating BETWEEN 1 AND 5)`.

### 2. Triggers
Triggers automatically execute logic upon certain database events:
- **`update_restaurant_rating()`**: Triggered `AFTER INSERT ON reviews`. It automatically recalculates the average rating for a restaurant and updates the `restaurants` table.
- **`update_agent_availability()`**: Triggered `AFTER UPDATE OF status ON orders`. When an order status is updated to 'Delivered', this trigger automatically finds the assigned delivery agent and sets their `is_available` flag back to `TRUE`, and sets the `delivered_time`.

### 3. Views
Views abstract complex queries for easy consumption by the backend:
- **`top_restaurants_view`**: Uses the `RANK() OVER (ORDER BY rating DESC, COUNT(rev.review_id) DESC)` window function to join restaurants and reviews and rank them.
- **`popular_items_view`**: Uses an aggregate `SUM(oi.quantity)` joined across `menu_items`, `order_items`, and `restaurants`, and applies a window function to rank the best-selling items across the platform.
- **`order_summary_view`**: A denormalized view joining `orders`, `users`, `restaurants`, and `payments` to easily display order history without writing complex JOINs in the Node.js controllers.

### 4. Stored Procedures
Procedures encapsulate business logic and transactions within the database:
- **`place_order(user_id, restaurant_id, items JSON)`**: Processes an order entirely within the database. It takes a JSON array of items, parses it using `json_populate_recordset`, calculates the total amount, inserts into `orders`, loops to insert into `order_items`, creates a pending `payment` record, and finally returns the generated `order_id`. All inside an atomic transaction block.
- **`assign_delivery(order_id)`**: Finds the first available delivery agent, inserts a new record into `deliveries`, marks the agent as unavailable (`is_available = FALSE`), and updates the order status to 'Out for Delivery'.

### 5. Indexes
Added on high-traffic lookup columns to speed up querying:
- `idx_orders_user_id` on `orders(user_id)`
- `idx_orders_status` on `orders(status)`
- `idx_menu_items_restaurant_id` on `menu_items(restaurant_id)`

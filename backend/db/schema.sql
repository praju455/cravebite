-- Drop existing objects if they exist (for clean runs)
DROP VIEW IF EXISTS order_summary_view;
DROP VIEW IF EXISTS popular_items_view;
DROP VIEW IF EXISTS top_restaurants_view;
DROP PROCEDURE IF EXISTS place_order;
DROP PROCEDURE IF EXISTS assign_delivery;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS delivery_agents CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enums
CREATE TYPE order_status AS ENUM ('Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled');
CREATE TYPE vehicle_type AS ENUM ('Bike', 'Bicycle', 'Scooter');
CREATE TYPE payment_method AS ENUM ('UPI', 'Card', 'Cash', 'Wallet');
CREATE TYPE payment_status AS ENUM ('Pending', 'Success', 'Failed');

-- 1. Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurants Table
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine_type VARCHAR(100),
    city VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    delivery_time_mins INT,
    is_open BOOLEAN DEFAULT TRUE,
    image_url TEXT
);

-- 3. Menu Items Table
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT
);

-- 4. Orders Table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INT REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items Table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL
);

-- 6. Delivery Agents Table
CREATE TABLE delivery_agents (
    agent_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    vehicle vehicle_type,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0
);

-- 7. Deliveries Table
CREATE TABLE deliveries (
    delivery_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    agent_id INT REFERENCES delivery_agents(agent_id) ON DELETE SET NULL,
    pickup_time TIMESTAMP,
    delivered_time TIMESTAMP,
    distance_km DECIMAL(5,2)
);

-- 8. Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INT REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Payments Table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method payment_method,
    status payment_status DEFAULT 'Pending',
    paid_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);

-- Triggers

-- Trigger 1: After INSERT on reviews -> recalculate and UPDATE restaurants.rating
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
    )
    WHERE restaurant_id = NEW.restaurant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restaurant_rating();

-- Trigger 2: After order status becomes 'Delivered' -> mark delivery_agents.is_available = TRUE
CREATE OR REPLACE FUNCTION update_agent_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Delivered' AND OLD.status != 'Delivered' THEN
        UPDATE delivery_agents
        SET is_available = TRUE
        WHERE agent_id = (SELECT agent_id FROM deliveries WHERE order_id = NEW.order_id);
        
        UPDATE deliveries
        SET delivered_time = CURRENT_TIMESTAMP
        WHERE order_id = NEW.order_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_order_delivered
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION update_agent_availability();

-- Views

-- View 1: top_restaurants_view
CREATE VIEW top_restaurants_view AS
SELECT 
    r.restaurant_id, 
    r.name, 
    r.cuisine_type, 
    r.rating,
    r.image_url,
    r.delivery_time_mins,
    COUNT(rev.review_id) AS total_reviews,
    RANK() OVER (ORDER BY r.rating DESC, COUNT(rev.review_id) DESC) as rank
FROM restaurants r
LEFT JOIN reviews rev ON r.restaurant_id = rev.restaurant_id
GROUP BY r.restaurant_id
ORDER BY rank;

-- View 2: popular_items_view
CREATE VIEW popular_items_view AS
SELECT 
    mi.item_id, 
    mi.name AS item_name, 
    r.name AS restaurant_name,
    mi.price,
    mi.image_url,
    SUM(oi.quantity) AS total_sold,
    RANK() OVER (ORDER BY SUM(oi.quantity) DESC) as rank
FROM menu_items mi
JOIN order_items oi ON mi.item_id = oi.item_id
JOIN restaurants r ON mi.restaurant_id = r.restaurant_id
GROUP BY mi.item_id, mi.name, r.name, mi.price, mi.image_url
LIMIT 10;

-- View 3: order_summary_view
CREATE VIEW order_summary_view AS
SELECT 
    o.order_id,
    o.created_at,
    o.total_amount,
    o.status,
    u.name AS user_name,
    u.email AS user_email,
    r.name AS restaurant_name,
    p.method AS payment_method,
    p.status AS payment_status
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN payments p ON o.order_id = p.order_id;

-- Stored Procedures

-- Procedure 1: place_order
CREATE OR REPLACE PROCEDURE place_order(
    p_user_id INT,
    p_restaurant_id INT,
    p_items JSON, -- Expecting JSON array: '[{"item_id": 1, "quantity": 2, "unit_price": 150.00}]'
    INOUT p_order_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_amount DECIMAL(10,2) := 0;
    v_item RECORD;
BEGIN
    -- Calculate total amount
    FOR v_item IN SELECT * FROM json_populate_recordset(null::record, p_items) AS (item_id INT, quantity INT, unit_price DECIMAL)
    LOOP
        v_total_amount := v_total_amount + (v_item.quantity * v_item.unit_price);
    END LOOP;

    -- Insert into orders
    INSERT INTO orders (user_id, restaurant_id, total_amount, status)
    VALUES (p_user_id, p_restaurant_id, v_total_amount, 'Placed')
    RETURNING order_id INTO p_order_id;

    -- Insert into order_items
    FOR v_item IN SELECT * FROM json_populate_recordset(null::record, p_items) AS (item_id INT, quantity INT, unit_price DECIMAL)
    LOOP
        INSERT INTO order_items (order_id, item_id, quantity, unit_price)
        VALUES (p_order_id, v_item.item_id, v_item.quantity, v_item.unit_price);
    END LOOP;
    
    -- Insert pending payment
    INSERT INTO payments (order_id, amount, method, status)
    VALUES (p_order_id, v_total_amount, 'Cash', 'Pending');
END;
$$;

-- Procedure 2: assign_delivery
CREATE OR REPLACE PROCEDURE assign_delivery(
    p_order_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_agent_id INT;
BEGIN
    -- Find an available agent (simple round-robin or random for demo)
    SELECT agent_id INTO v_agent_id
    FROM delivery_agents
    WHERE is_available = TRUE
    ORDER BY RANDOM()
    LIMIT 1;

    IF v_agent_id IS NOT NULL THEN
        -- Assign delivery
        INSERT INTO deliveries (order_id, agent_id, pickup_time)
        VALUES (p_order_id, v_agent_id, CURRENT_TIMESTAMP);

        -- Mark agent as unavailable
        UPDATE delivery_agents
        SET is_available = FALSE
        WHERE agent_id = v_agent_id;
        
        -- Update order status
        UPDATE orders
        SET status = 'Out for Delivery'
        WHERE order_id = p_order_id;
    ELSE
        RAISE EXCEPTION 'No delivery agents available';
    END IF;
END;
$$;

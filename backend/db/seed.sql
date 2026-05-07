-- Seed Data for Online Food Delivery App

-- 1. Users (10 users in Bangalore)
INSERT INTO users (name, email, phone, address) VALUES
('Rahul Sharma', 'rahul@example.com', '9876543210', '123, 1st Main, Indiranagar, Bangalore'),
('Priya Singh', 'priya@example.com', '9876543211', '45, 2nd Cross, Koramangala, Bangalore'),
('Amit Kumar', 'amit@example.com', '9876543212', '789, 3rd Block, Jayanagar, Bangalore'),
('Sneha Reddy', 'sneha@example.com', '9876543213', '12, 4th Phase, JP Nagar, Bangalore'),
('Vikram Patel', 'vikram@example.com', '9876543214', '34, 5th Main, HSR Layout, Bangalore'),
('Pooja Desai', 'pooja@example.com', '9876543215', '56, 6th Cross, BTM Layout, Bangalore'),
('Karan Johar', 'karan@example.com', '9876543216', '78, 7th Block, Whitefield, Bangalore'),
('Neha Gupta', 'neha@example.com', '9876543217', '90, 8th Main, Marathahalli, Bangalore'),
('Rohan Verma', 'rohan@example.com', '9876543218', '11, 9th Cross, Electronic City, Bangalore'),
('Anjali Menon', 'anjali@example.com', '9876543219', '22, 10th Main, Bellandur, Bangalore');

-- 2. Delivery Agents (5 agents)
INSERT INTO delivery_agents (name, phone, vehicle, rating) VALUES
('Suresh', '8876543210', 'Bike', 4.8),
('Ramesh', '8876543211', 'Scooter', 4.5),
('Mahesh', '8876543212', 'Bike', 4.9),
('Ganesh', '8876543213', 'Bicycle', 4.2),
('Dinesh', '8876543214', 'Bike', 4.7);

-- 3. Restaurants (6 restaurants)
INSERT INTO restaurants (name, cuisine_type, city, rating, delivery_time_mins, image_url) VALUES
('Burger King', 'Fast Food', 'Bangalore', 4.2, 30, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80'),
('Dominos', 'Italian', 'Bangalore', 4.1, 25, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80'),
('Meghana Foods', 'Indian', 'Bangalore', 4.8, 45, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80'),
('Social', 'Continental', 'Bangalore', 4.5, 40, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&q=80'),
('Truffles', 'Cafe', 'Bangalore', 4.6, 35, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80'),
('Natural Ice Cream', 'Desserts', 'Bangalore', 4.9, 20, 'https://images.unsplash.com/photo-1563805042-7684c889e1eb?w=500&q=80'),
('KFC', 'Fast Food', 'Bangalore', 4.3, 25, 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&q=80'),
('Paradise Biryani', 'Indian', 'Bangalore', 4.5, 40, 'https://images.unsplash.com/photo-1633383718081-22ac93e3db65?w=500&q=80');

-- 4. Menu Items (8 items per restaurant)
-- Burger King (Rest ID: 1)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(1, 'Whopper', 'Signature flame-grilled beef patty', 199.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'),
(1, 'Veggie Burger', 'Crispy veg patty with fresh lettuce', 149.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80'),
(1, 'French Fries (Large)', 'Crispy golden fries', 129.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80'),
(1, 'Chicken Nuggets (6pc)', 'Crispy chicken nuggets', 149.00, 'Starters', FALSE, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80'),
(1, 'Onion Rings', 'Crispy batter-fried onion rings', 119.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80'),
(1, 'Coke', 'Refreshing cola', 79.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'),
(1, 'Chocolate Shake', 'Thick chocolate milkshake', 159.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80'),
(1, 'Brownie', 'Warm chocolate brownie', 99.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80');

-- Dominos (Rest ID: 2)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(2, 'Margherita Pizza', 'Classic cheese and tomato', 249.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80'),
(2, 'Pepperoni Pizza', 'Loaded with pepperoni', 399.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80'),
(2, 'Garlic Breadsticks', 'Freshly baked garlic bread', 129.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80'),
(2, 'Stuffed Garlic Bread', 'Garlic bread stuffed with cheese and jalapenos', 169.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1619531040576-68f780072bba?w=500&q=80'),
(2, 'Choco Lava Cake', 'Gooey chocolate cake', 109.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80'),
(2, 'Pasta Italiano White', 'Penne pasta in white sauce', 189.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1621996311239-50ebae68d2f5?w=500&q=80'),
(2, 'Chicken Wings', 'Spicy baked chicken wings', 199.00, 'Starters', FALSE, 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&q=80'),
(2, 'Pepsi', 'Refreshing beverage', 60.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&q=80');

-- Meghana Foods (Rest ID: 3)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(3, 'Chicken Biryani', 'Aromatic basmati rice with spicy chicken', 350.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80'),
(3, 'Mutton Biryani', 'Rich and flavorful mutton biryani', 450.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80'),
(3, 'Paneer Tikka', 'Grilled cottage cheese blocks', 250.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1567158780111-e40656a2be29?w=500&q=80'),
(3, 'Chicken Kebab', 'Deep fried spicy chicken chunks', 280.00, 'Starters', FALSE, 'https://images.unsplash.com/photo-1599487405270-87050a41d9c7?w=500&q=80'),
(3, 'Dal Makhani', 'Creamy black lentils', 220.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80'),
(3, 'Butter Naan', 'Soft Indian bread', 50.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80'),
(3, 'Sweet Lassi', 'Traditional yogurt drink', 80.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80'),
(3, 'Gulab Jamun', 'Sweet milk dumplings in syrup', 100.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1589115798835-212d1b73e51a?w=500&q=80');

-- Social (Rest ID: 4)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(4, 'Nachos with Salsa', 'Crispy nachos loaded with cheese', 290.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&q=80'),
(4, 'Death Wings', 'Extremely spicy chicken wings', 350.00, 'Starters', FALSE, 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&q=80'),
(4, 'Social Cheese Burger', 'Signature double patty burger', 450.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'),
(4, 'Penne Arrabiata', 'Spicy tomato pasta', 380.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&q=80'),
(4, 'Fish and Chips', 'Classic British style fish and chips', 420.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1590411333795-364219a16f6b?w=500&q=80'),
(4, 'Cold Coffee', 'Classic cold coffee', 180.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80'),
(4, 'Mojito', 'Minty mocktail', 200.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80'),
(4, 'Ramesh & Suresh', 'Deep fried 5 star chocolate', 250.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80');

-- Truffles (Rest ID: 5)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(5, 'All American Cheese Burger', 'Classic beef burger', 320.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80'),
(5, 'Crispy Veg Burger', 'Crunchy vegetable patty', 250.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80'),
(5, 'Peri Peri Fries', 'Spicy fries', 180.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80'),
(5, 'Mac and Cheese', 'Creamy macaroni', 290.00, 'Mains', TRUE, 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&q=80'),
(5, 'Ferrero Rocher Shake', 'Premium chocolate shake', 220.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80'),
(5, 'Irish Coffee', 'Coffee with a hint of irish flavor', 190.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80'),
(5, 'Mississippi Mud Pie', 'Dense chocolate cake', 210.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80'),
(5, 'Red Velvet Cupcake', 'Soft red velvet cake', 120.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&q=80');

-- Natural Ice Cream (Rest ID: 6)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(6, 'Tender Coconut Scoop', 'Signature tender coconut ice cream', 80.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1558500665-27f6b92f750b?w=500&q=80'),
(6, 'Sitaphal Scoop', 'Fresh custard apple flavor', 80.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80'),
(6, 'Roasted Almond Scoop', 'Rich almond ice cream', 90.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1563805042-7684c889e1eb?w=500&q=80'),
(6, 'Mango Scoop', 'Seasonal alphonso mango', 90.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1501747315-124a0eaca060?w=500&q=80'),
(6, 'Choco Bite Scoop', 'Chocolate chips in vanilla', 85.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500&q=80'),
(6, 'Coffee Walnut Scoop', 'Coffee and roasted walnuts', 95.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80'),
(6, 'Malai Magic Scoop', 'Traditional milk flavor', 75.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1558500665-27f6b92f750b?w=500&q=80'),
(6, 'Kaju Draksh Scoop', 'Cashew and raisin flavor', 85.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1501747315-124a0eaca060?w=500&q=80');

-- 5. Orders & Order Items (Mock 20 completed orders)
DO $$
DECLARE
    v_order_id INT;
    v_user_id INT;
    v_rest_id INT;
    v_agent_id INT;
    v_item_id INT;
    v_qty INT;
    v_price DECIMAL;
    v_total DECIMAL;
    v_date TIMESTAMP;
BEGIN
    FOR i IN 1..20 LOOP
        -- Random selection
        v_user_id := (SELECT floor(random() * 10 + 1)::int);
        v_rest_id := (SELECT floor(random() * 6 + 1)::int);
        v_agent_id := (SELECT floor(random() * 5 + 1)::int);
        
        -- Date in last 7 days
        v_date := CURRENT_TIMESTAMP - (random() * interval '7 days');
        
        -- Get a random item from the chosen restaurant
        SELECT item_id, price INTO v_item_id, v_price FROM menu_items WHERE restaurant_id = v_rest_id ORDER BY random() LIMIT 1;
        v_qty := (SELECT floor(random() * 3 + 1)::int);
        v_total := v_price * v_qty;
        
        -- Insert Order (Delivered)
        INSERT INTO orders (user_id, restaurant_id, total_amount, status, created_at)
        VALUES (v_user_id, v_rest_id, v_total, 'Delivered', v_date)
        RETURNING order_id INTO v_order_id;
        
        -- Insert Order Item
        INSERT INTO order_items (order_id, item_id, quantity, unit_price)
        VALUES (v_order_id, v_item_id, v_qty, v_price);
        
        -- Add a second item 50% of the time
        IF random() > 0.5 THEN
            SELECT item_id, price INTO v_item_id, v_price FROM menu_items WHERE restaurant_id = v_rest_id AND item_id != v_item_id ORDER BY random() LIMIT 1;
            IF v_item_id IS NOT NULL THEN
                v_qty := (SELECT floor(random() * 2 + 1)::int);
                v_total := v_total + (v_price * v_qty);
                
                INSERT INTO order_items (order_id, item_id, quantity, unit_price)
                VALUES (v_order_id, v_item_id, v_qty, v_price);
                
                -- Update order total
                UPDATE orders SET total_amount = v_total WHERE order_id = v_order_id;
            END IF;
        END IF;

        -- Insert Payment
        INSERT INTO payments (order_id, amount, method, status, paid_at)
        VALUES (v_order_id, v_total, (ARRAY['UPI', 'Card', 'Cash', 'Wallet']::payment_method[])[floor(random()*4)+1], 'Success', v_date + interval '2 minutes');
        
        -- Insert Delivery
        INSERT INTO deliveries (order_id, agent_id, pickup_time, delivered_time, distance_km)
        VALUES (v_order_id, v_agent_id, v_date + interval '15 minutes', v_date + interval '40 minutes', (random() * 5 + 1)::decimal(5,2));
        
        -- Insert Review (80% chance)
        IF random() > 0.2 THEN
            INSERT INTO reviews (user_id, restaurant_id, rating, comment, created_at)
            VALUES (v_user_id, v_rest_id, floor(random() * 2 + 4)::int, 'Great food!', v_date + interval '2 hours');
        END IF;
    END LOOP;
END $$;

-- KFC (Rest ID: 7)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(7, 'Zinger Burger', 'Signature chicken zinger', 199.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'),
(7, 'Hot Wings (4pc)', 'Spicy chicken wings', 149.00, 'Starters', FALSE, 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&q=80'),
(7, 'French Fries', 'Crispy fries', 99.00, 'Starters', TRUE, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80'),
(7, 'Pepsi', 'Refreshing beverage', 60.00, 'Drinks', TRUE, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80');

-- Paradise Biryani (Rest ID: 8)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, image_url) VALUES
(8, 'Chicken Dum Biryani', 'Authentic hyderabadi biryani', 320.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80'),
(8, 'Mutton Dum Biryani', 'Special mutton dum biryani', 420.00, 'Mains', FALSE, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80'),
(8, 'Chicken 65', 'Spicy deep fried chicken', 250.00, 'Starters', FALSE, 'https://images.unsplash.com/photo-1599487405270-87050a41d9c7?w=500&q=80'),
(8, 'Double Ka Meetha', 'Traditional bread pudding', 120.00, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1589115798835-212d1b73e51a?w=500&q=80');

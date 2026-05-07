const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post('/api/users/register', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- RESTAURANT ROUTES ---
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching restaurants' });
  }
});

app.get('/api/restaurants/top', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM top_restaurants_view LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching top restaurants' });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE restaurant_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching restaurant details' });
  }
});

app.get('/api/restaurants/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.user_id 
      WHERE r.restaurant_id = $1 
      ORDER BY r.created_at DESC`, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
});

// --- MENU ROUTES ---
app.get('/api/menu/:restaurant_id', async (req, res) => {
  const { restaurant_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = TRUE', [restaurant_id]);
    
    // Group by category
    const menuByCategory = result.rows.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    
    res.json(menuByCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching menu' });
  }
});

// --- ORDER ROUTES ---
app.post('/api/orders', async (req, res) => {
  const { user_id, restaurant_id, items } = req.body;
  // items should be an array of objects: { item_id, quantity, unit_price }
  try {
    // We use the stored procedure place_order
    const result = await pool.query('CALL place_order($1, $2, $3, null)', [user_id, restaurant_id, JSON.stringify(items)]);
    const order_id = result.rows[0].p_order_id;
    res.status(201).json({ order_id, message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error placing order' });
  }
});

app.get('/api/orders/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM order_summary_view WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = $1) ORDER BY created_at DESC', [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching user orders' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    // If status updated to Out for Delivery, but wait, assign_delivery procedure handles that.
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating order status' });
  }
});

app.post('/api/orders/:id/assign', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('CALL assign_delivery($1)', [id]);
    res.json({ message: 'Delivery agent assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error assigning delivery agent: ' + err.message });
  }
});

app.get('/api/orders/:id/track', async (req, res) => {
  const { id } = req.params;
  try {
    const orderResult = await pool.query('SELECT * FROM order_summary_view WHERE order_id = $1', [id]);
    const deliveryResult = await pool.query(`
      SELECT d.*, a.name as agent_name, a.phone as agent_phone, a.vehicle, a.rating 
      FROM deliveries d 
      LEFT JOIN delivery_agents a ON d.agent_id = a.agent_id 
      WHERE d.order_id = $1`, [id]);
      
    if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    res.json({
      order: orderResult.rows[0],
      delivery: deliveryResult.rows[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching tracking info' });
  }
});

// --- STATS ROUTES ---
app.get('/api/stats/popular-items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM popular_items_view');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching popular items' });
  }
});

app.get('/api/stats/revenue', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE(created_at) as date, SUM(total_amount) as revenue 
      FROM orders 
      WHERE status = 'Delivered' 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC 
      LIMIT 7
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching revenue stats' });
  }
});

app.get('/api/stats/orders-today', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      WHERE DATE(created_at) = CURRENT_DATE 
      GROUP BY status
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching order stats' });
  }
});

app.get('/api/stats/dashboard', async (req, res) => {
  try {
    const totalOrdersResult = await pool.query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE");
    const revenueResult = await pool.query("SELECT SUM(total_amount) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status = 'Delivered'");
    const activeDeliveriesResult = await pool.query("SELECT COUNT(*) FROM orders WHERE status IN ('Confirmed', 'Preparing', 'Out for Delivery')");
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const recentOrders = await pool.query("SELECT * FROM order_summary_view ORDER BY created_at DESC LIMIT 5");

    res.json({
      totalOrdersToday: parseInt(totalOrdersResult.rows[0].count) || 0,
      revenueToday: parseFloat(revenueResult.rows[0].sum) || 0,
      activeDeliveries: parseInt(activeDeliveriesResult.rows[0].count) || 0,
      totalUsers: parseInt(usersResult.rows[0].count) || 0,
      recentOrders: recentOrders.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching dashboard KPI' });
  }
});

// --- REVIEWS & PAYMENTS ---
app.post('/api/reviews', async (req, res) => {
  const { user_id, restaurant_id, rating, comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, restaurant_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error posting review' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuthStore } from './store/authStore';
import { useAdminStore } from './store/adminStore';

// Protect consumer routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" />;
  return children;
};

// Protect admin routes — redirect to admin login if not logged in as admin
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAdminStore((s) => s.token);
  if (!token) return <Navigate to="/admin/login" />;
  return children;
};

// Pages that should NOT show the Navbar (full-screen layouts)
const NO_NAVBAR_PATHS = ['/', '/admin/login'];

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdminDash = pathname.startsWith('/admin/dashboard');
  const hideNav = NO_NAVBAR_PATHS.includes(pathname) || isAdminDash;

  return (
    <div className="min-h-screen">
      {!hideNav && <Navbar />}
      <main className={hideNav ? '' : 'container mx-auto px-4 py-8 relative z-10 pt-24'}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* ── Consumer routes ── */}
          <Route path="/" element={<Landing />} />
          <Route path="/restaurants" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* ── Admin routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <div className="container mx-auto px-4 py-8 pt-24">
                <Dashboard />
              </div>
            </AdminRoute>
          } />

          {/* Legacy /dashboard redirect to admin login */}
          <Route path="/dashboard" element={<Navigate to="/admin/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

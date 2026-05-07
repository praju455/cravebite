import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" />;
  return children;
};

// Hide Navbar on landing page (it has its own full-screen layout)
function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  return (
    <div className="min-h-screen">
      {!isLanding && <Navbar />}
      <main className={isLanding ? '' : 'container mx-auto px-4 py-8 relative z-10 pt-24'}>
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
          <Route path="/" element={<Landing />} />
          <Route path="/restaurants" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

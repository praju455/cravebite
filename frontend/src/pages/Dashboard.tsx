import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/axiosInstance';
import { useAdminStore } from '../store/adminStore';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Bike, LayoutDashboard, ClipboardList, RefreshCw, LogOut } from 'lucide-react';
import { getDashboardStats } from '../api/admin.api';

const COLORS = ['#d97706', '#f59e0b', '#fb923c', '#FF8042', '#8884d8', '#fbbf24'];

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'orders', label: 'All Orders', icon: ClipboardList },
];

/* ─── KPI Card ─── */
function KPICard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="glass-card p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
      <div className={`p-4 rounded-xl bg-white/5 ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Delivered': 'bg-amber-500/20 text-amber-400',
    'Cancelled': 'bg-red-500/20 text-red-400',
    'Out for Delivery': 'bg-blue-500/20 text-blue-400',
    'Placed': 'bg-yellow-500/20 text-yellow-400',
    'Preparing': 'bg-orange-500/20 text-orange-400',
    'Confirmed': 'bg-purple-500/20 text-purple-400',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold ${styles[status] || 'bg-white/10 text-white'}`}>
      {status}
    </span>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000,
    staleTime: 15000,
  });

  if (isLoading) return <div className="text-center py-20 animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</div>;
  if (!data) return <div className="text-center py-20 text-red-500">Failed to load stats.</div>;

  const { kpi, revenueData, orderStatusData, topItems } = data;

  return (
    <div className="space-y-8">
      {/* Refresh indicator */}
      <div className="flex justify-end">
        <button onClick={() => refetch()}
          className="flex items-center space-x-2 text-sm px-4 py-2 rounded-full glass-card hover:text-[#d97706] transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#d97706]' : ''}`} />
          <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Revenue Today" value={`₹${kpi.revenueToday.toFixed(2)}`} icon={TrendingUp} color="text-amber-500" />
        <KPICard title="Orders Today" value={kpi.totalOrdersToday} icon={ShoppingBag} color="text-blue-500" />
        <KPICard title="Active Deliveries" value={kpi.activeDeliveries} icon={Bike} color="text-orange-600" />
        <KPICard title="Total Users" value={kpi.totalUsers} icon={Users} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--chart-axis)" />
                <YAxis stroke="var(--chart-axis)" tickFormatter={(v) => `₹${v}`} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Orders by Status (Today)</h2>
          {orderStatusData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              No orders today yet
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {orderStatusData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {orderStatusData.map((entry: any, index: number) => (
                  <div key={entry.name} className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ color: 'var(--text-muted)' }} className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {kpi.recentOrders.map((order: any) => (
                  <tr key={order.order_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">#{order.order_id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{order.restaurant_name}</td>
                    <td className="px-4 py-3">₹{Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Popular Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ color: 'var(--text-muted)' }} className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Item</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3 text-right rounded-r-lg">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topItems.map((item: any, idx: number) => (
                  <tr key={item.item_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <span className="font-bold text-xs w-4" style={{ color: 'var(--text-muted)' }}>{idx + 1}</span>
                      <span className="font-medium">{item.item_name}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{item.restaurant_name}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#d97706]">{item.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await adminApi.get('/stats/users');
      return res.data.data;
    },
    refetchInterval: 20000,
  });

  if (isLoading) return <div className="text-center py-20 animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading users...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Registered Users</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {data?.length || 0} total users — updates automatically every 20s
          </p>
        </div>
        <button onClick={() => refetch()}
          className="flex items-center space-x-2 text-sm px-4 py-2 rounded-full glass-card hover:text-[#d97706] transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#d97706]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead style={{ color: 'var(--text-muted)' }} className="bg-white/5 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.map((user: any) => (
                <tr key={user.user_id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>#{user.user_id}</td>
                  <td className="px-5 py-4 font-semibold">{user.name}</td>
                  <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{user.phone || '—'}</td>
                  <td className="px-5 py-4 max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }}>{user.address || '—'}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(user.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── All Orders Tab ─── */
function AllOrdersTab() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['adminAllOrders'],
    queryFn: async () => {
      const res = await adminApi.get('/stats/orders');
      return res.data.data;
    },
    refetchInterval: 20000,
  });

  if (isLoading) return <div className="text-center py-20 animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading orders...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Orders</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {data?.length || 0} orders — live data from database
          </p>
        </div>
        <button onClick={() => refetch()}
          className="flex items-center space-x-2 text-sm px-4 py-2 rounded-full glass-card hover:text-[#d97706] transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#d97706]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead style={{ color: 'var(--text-muted)' }} className="bg-white/5 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Restaurant</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.map((order: any) => (
                <tr key={order.order_id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold">#{order.order_id}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{order.user_name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.user_email}</div>
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{order.restaurant_name}</td>
                  <td className="px-5 py-4 font-bold text-[#d97706]">₹{Number(order.total_amount).toFixed(0)}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded bg-white/10">{order.payment_method || 'Cash'}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { admin, logoutAdmin } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => { logoutAdmin(); navigate('/admin/login'); };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Logged in as <span className="text-[#d97706] font-semibold">{admin?.name}</span> · Live data, auto-refreshes every 30s
          </p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-sm font-medium hover:text-red-400 transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#d97706] text-[#d97706]'
                : 'border-transparent hover:text-[#d97706]'
            }`}
            style={{ color: activeTab === tab.id ? '#d97706' : 'var(--text-secondary)' }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'users'    && <UsersTab />}
      {activeTab === 'orders'   && <AllOrdersTab />}
    </div>
  );
}

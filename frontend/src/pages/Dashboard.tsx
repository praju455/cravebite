import { useDashboardStats } from '../hooks/useAdmin';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Bike } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading: loading } = useDashboardStats();

  if (loading) return <div className="text-center py-20 text-xl animate-pulse">Loading Dashboard...</div>;
  if (!data) return <div className="text-center py-20 text-xl text-red-500">Failed to load stats.</div>;

  const { kpi, revenueData, orderStatusData, topItems } = data;

  const COLORS = ['#ff4d00', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'];

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Revenue Today" value={`₹${kpi.revenueToday.toFixed(2)}`} icon={TrendingUp} color="text-green-500" />
        <KPICard title="Orders Today" value={kpi.totalOrdersToday} icon={ShoppingBag} color="text-blue-500" />
        <KPICard title="Active Deliveries" value={kpi.activeDeliveries} icon={Bike} color="text-[#ff4d00]" />
        <KPICard title="Total Users" value={kpi.totalUsers} icon={Users} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" tickFormatter={(value) => `₹${value}`} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                />
                <Bar dataKey="revenue" fill="#ff4d00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Orders by Status (Today)</h2>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {orderStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-gray-300">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass-card p-6 overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {kpi.recentOrders.map(order => (
                  <tr key={order.order_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 font-medium">#{order.order_id}</td>
                    <td className="px-4 py-4 text-gray-300">{order.restaurant_name}</td>
                    <td className="px-4 py-4">₹{Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="glass-card p-6 overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-6">Popular Items</h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Item</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3 text-right rounded-r-lg">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topItems.map((item, idx) => (
                  <tr key={item.item_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 flex items-center space-x-3">
                      <span className="text-gray-500 font-bold text-xs w-4">{idx + 1}</span>
                      <span className="font-medium">{item.item_name}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{item.restaurant_name}</td>
                    <td className="px-4 py-4 text-right font-bold text-[#ff4d00]">{item.total_sold}</td>
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

function KPICard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="glass-card p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-4 rounded-xl bg-white/5 \${color}`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
  );
}

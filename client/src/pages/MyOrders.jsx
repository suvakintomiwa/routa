import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Package,
  MapPin,
  Clock,
  Truck,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Zap,
  Bell,
  LogOut,
  Plus,
  Search,
  Filter,
  Calendar,
  Circle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Home,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Navigation,
  Eye
} from 'lucide-react';

const MyOrders = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      // Demo data for development
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Status configuration
  const statusConfig = {
    pending: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700', 
      label: 'Pending',
      icon: Clock,
      description: 'Waiting for driver'
    },
    confirmed: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-700', 
      label: 'Confirmed',
      icon: Check,
      description: 'Driver assigned'
    },
    picked_up: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-700', 
      label: 'Picked Up',
      icon: Package,
      description: 'Package collected'
    },
    in_transit: { 
      bg: 'bg-indigo-100', 
      text: 'text-indigo-700', 
      label: 'In Transit',
      icon: Truck,
      description: 'On the way'
    },
    delivered: { 
      bg: 'bg-green-100', 
      text: 'text-green-700', 
      label: 'Delivered',
      icon: CheckCircle,
      description: 'Successfully delivered'
    },
    cancelled: { 
      bg: 'bg-red-100', 
      text: 'text-red-700', 
      label: 'Cancelled',
      icon: X,
      description: 'Order cancelled'
    },
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`${config.bg} ${config.text} text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.trackingId?.toLowerCase().includes(query) ||
        order.pickupAddress?.toLowerCase().includes(query) ||
        order.dropoffAddress?.toLowerCase().includes(query) ||
        order.packageDesc?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && order.status?.toLowerCase() !== statusFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          if (orderDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          if (orderDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
          if (orderDate < monthAgo) return false;
          break;
      }
    }
    
    return true;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'picked_up', 'in_transit'].includes(o.status?.toLowerCase())).length,
    delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Routa</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4"
            >
              <Link to="/dashboard" className="flex items-center gap-2 text-gray-600">
                <Home className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/orders/create" className="flex items-center gap-2 text-gray-600">
                <Plus className="w-5 h-5" /> New Order
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">My Orders</h1>
              <p className="text-gray-600">Track and manage all your deliveries</p>
            </div>
            <Link
              to="/orders/create"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg group"
            >
              <Plus className="w-5 h-5" />
              New Order
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by tracking ID, address, or package..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Refresh */}
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              // Loading State
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                      <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-6 bg-gray-200 rounded-full w-20 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              // Error State
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load orders</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {orders.length === 0 ? 'No Orders Yet' : 'No matching orders'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  {orders.length === 0 
                    ? "You haven't created any delivery orders yet. Start by sending your first package!"
                    : "No orders match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {orders.length === 0 ? (
                  <Link
                    to="/orders/create"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg group"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Order
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDateFilter('all');
                    }}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              // Orders List
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order._id || order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/orders/${order._id || order.id}`}
                        className="flex items-center gap-4 p-5 hover:bg-gray-50 transition group"
                      >
                        {/* Order Icon */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-7 h-7 text-blue-600" />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            {getStatusBadge(order.status)}
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          {/* Route */}
                          <div className="flex items-start gap-2 mb-1">
                            <div className="flex flex-col items-center mt-1">
                              <Circle className="w-2 h-2 text-green-500 fill-green-500" />
                              <div className="w-0.5 h-3 bg-gray-200"></div>
                              <MapPin className="w-3 h-3 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 truncate">
                                {order.pickupAddress?.area || order.pickupAddress || 'Pickup location'}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.dropoffAddress?.area || order.dropoffAddress || 'Dropoff location'}
                              </p>
                            </div>
                          </div>

                          {/* Tracking ID */}
                          {order.trackingId && (
                            <p className="text-xs text-gray-400 font-mono mt-1">
                              #{order.trackingId}
                            </p>
                          )}
                        </div>

                        {/* Price & Actions */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(order.price)}
                          </p>
                          {order.distance && (
                            <p className="text-sm text-gray-500 flex items-center justify-end gap-1">
                              <Navigation className="w-3 h-3" />
                              {order.distance} km
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Results Count */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions Footer */}
          {orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/orders/create"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                Create another order
              </Link>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-gray-800"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Routa
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Built on</span>
              <span className="text-blue-600 font-medium">Base</span>
              <span>⛓️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyOrders;
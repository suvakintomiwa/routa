import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  MapPin,
  Clock,
  Shield,
  Truck,
  Star,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Zap,
  Wallet,
  Bell,
  LogOut,
  Power,
  Navigation,
  Phone,
  MessageCircle,
  Settings,
  HelpCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle,
  Circle,
  AlertCircle,
  Eye,
  Play,
  User,
  Calendar
} from 'lucide-react';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // Demo data
  const [driverStats, setDriverStats] = useState({
    totalDeliveries: 0,
    rating: 0,
    earnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    completionRate: 0,
    vehicleType: 'BIKE',
    vehiclePlate: 'ABC-123-XY',
  });

  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const acceptOrder = (orderId) => {
    alert(`Order ${orderId} accepted! (Demo)`);
  };

  const updateOrderStatus = (orderId, status) => {
    alert(`Order ${orderId} updated to ${status}! (Demo)`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      ACCEPTED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Check },
      PICKED_UP: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Package },
      IN_TRANSIT: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Truck },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: X },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`${config.bg} ${config.text} text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'BIKE':
        return '🏍️';
      case 'CAR':
        return '🚗';
      case 'VAN':
        return '🚐';
      default:
        return '🚚';
    }
  };

  // Loading skeleton
  const StatSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'available', label: 'Available', count: availableOrders.length, icon: Zap },
    { id: 'active', label: 'Active', count: myOrders.length, icon: Truck },
    { id: 'history', label: 'History', count: orderHistory.length, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">Routa</span>
                <span className="text-xs text-green-600 font-medium ml-1">Driver</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Online Status Indicator */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {/* Notification Bell */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">Driver</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <div className={`flex items-center gap-1 text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <Link to="/driver/earnings" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                <Wallet className="w-5 h-5" /> Earnings
              </Link>
              <Link to="/driver/profile" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                <Settings className="w-5 h-5" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 w-full"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner with Online Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-3xl p-8 md:p-10 mb-8 text-white relative overflow-hidden transition-all duration-500 ${
              isOnline 
                ? 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-800' 
                : 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800'
            }`}
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className={`text-lg mb-1 ${isOnline ? 'text-green-200' : 'text-gray-300'}`}>{greeting},</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{user?.firstName}! 🚀</h1>
                <p className={`max-w-lg text-lg ${isOnline ? 'text-green-100' : 'text-gray-300'}`}>
                  {isOnline 
                    ? "You're online and ready to accept deliveries. New orders will appear below."
                    : "Go online to start receiving delivery requests and earning money."
                  }
                </p>
              </div>

              {/* Big Online Toggle Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={toggleOnline}
                  className={`relative w-32 h-32 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                    isOnline
                      ? 'bg-white'
                      : 'bg-white/20 border-4 border-white/50'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full ${isOnline ? 'bg-green-500' : ''} flex items-center justify-center`}>
                    <Power className={`w-12 h-12 ${isOnline ? 'text-white' : 'text-white'}`} />
                  </div>
                  {isOnline && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-25"></div>
                  )}
                </button>
                <p className={`mt-4 font-bold text-lg ${isOnline ? 'text-white' : 'text-gray-300'}`}>
                  {isOnline ? 'TAP TO GO OFFLINE' : 'TAP TO GO ONLINE'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            {loading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                {/* Vehicle */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Vehicle</p>
                      <p className="text-xl font-bold text-gray-900">{driverStats.vehicleType}</p>
                      <p className="text-xs text-gray-400 font-mono">{driverStats.vehiclePlate}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      {getVehicleIcon(driverStats.vehicleType)}
                    </div>
                  </div>
                </div>

                {/* Total Deliveries */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-100 transition group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Deliveries</p>
                      <p className="text-3xl font-bold text-green-600">{driverStats.totalDeliveries}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-yellow-100 transition group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Rating</p>
                      <p className="text-3xl font-bold text-yellow-600 flex items-center gap-1">
                        {driverStats.rating > 0 ? driverStats.rating.toFixed(1) : 'N/A'}
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Today's Earnings */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Today</p>
                      <p className="text-2xl font-bold text-purple-600">₦{driverStats.todayEarnings.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition group col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                        ₦{driverStats.earnings.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Orders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Tab Headers */}
            <div className="flex border-b bg-gray-50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-4 text-center font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-green-600 bg-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Available Orders */}
                {activeTab === 'available' && (
                  <motion.div
                    key="available"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {!isOnline ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Power className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">You're Offline</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                          Go online to see available delivery requests in your area.
                        </p>
                        <button
                          onClick={toggleOnline}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-semibold group"
                        >
                          <Power className="w-5 h-5" />
                          Go Online Now
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </button>
                      </div>
                    ) : availableOrders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Zap className="w-12 h-12 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Waiting for Orders</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                          You're online and ready! New delivery requests will appear here.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Listening for orders...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableOrders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-green-200 transition group"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                  ₦
                                </div>
                                <div>
                                  <span className="text-2xl font-bold text-gray-900">
                                    ₦{order.price?.toLocaleString()}
                                  </span>
                                  <p className="text-gray-500 text-sm flex items-center gap-1">
                                    <Navigation className="w-3 h-3" />
                                    {order.distance} km away
                                  </p>
                                </div>
                              </div>
                              <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <div className="space-y-3 mb-5">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Circle className="w-3 h-3 text-green-600 fill-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                                  <p className="text-gray-900 font-medium">{order.pickupAddress}</p>
                                </div>
                              </div>
                              <div className="ml-4 border-l-2 border-dashed border-gray-200 h-4"></div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <MapPin className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">DROP-OFF</p>
                                  <p className="text-gray-900 font-medium">{order.dropoffAddress}</p>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => acceptOrder(order.id)}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold flex items-center justify-center gap-2 shadow-lg group"
                            >
                              <Check className="w-5 h-5" />
                              Accept Order
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Active Orders */}
                {activeTab === 'active' && (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {myOrders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Truck className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Orders</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                          Accept an order from the available tab to start a delivery.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myOrders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-200 rounded-2xl p-5"
                          >
                            <div className="flex justify-between items-start mb-4">
                              {getStatusBadge(order.status)}
                              <span className="text-xl font-bold text-gray-900">
                                ₦{order.price?.toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-4 mb-5">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Circle className="w-3 h-3 text-green-600 fill-green-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                                  <p className="text-gray-900 font-medium">{order.pickupAddress}</p>
                                  <a href={`tel:${order.pickupContact}`} className="text-green-600 text-sm flex items-center gap-1 mt-1 hover:underline">
                                    <Phone className="w-3 h-3" /> {order.pickupContact}
                                  </a>
                                </div>
                              </div>

                              <div className="ml-4 border-l-2 border-dashed border-gray-200 h-4"></div>

                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">DROP-OFF</p>
                                  <p className="text-gray-900 font-medium">{order.dropoffAddress}</p>
                                  <a href={`tel:${order.dropoffContact}`} className="text-green-600 text-sm flex items-center gap-1 mt-1 hover:underline">
                                    <Phone className="w-3 h-3" /> {order.dropoffContact}
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Package Info */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-4">
                              <p className="text-xs text-gray-500 font-medium mb-1">PACKAGE DETAILS</p>
                              <p className="text-gray-900">{order.packageDesc}</p>
                            </div>

                            {/* Status Update Buttons */}
                            {order.status === 'ACCEPTED' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PICKED_UP')}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition font-semibold flex items-center justify-center gap-2"
                              >
                                <Package className="w-5 h-5" />
                                Mark as Picked Up
                              </button>
                            )}
                            {order.status === 'PICKED_UP' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'IN_TRANSIT')}
                                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition font-semibold flex items-center justify-center gap-2"
                              >
                                <Truck className="w-5 h-5" />
                                Start Delivery
                              </button>
                            )}
                            {order.status === 'IN_TRANSIT' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-5 h-5" />
                                Mark as Delivered
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Order History */}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {orderHistory.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Clock className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Delivery History</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                          Completed deliveries will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orderHistory.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{order.dropoffAddress}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.deliveredAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold text-green-600 mt-1">
                                ₦{order.price?.toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Driver Support</h3>
                  <p className="text-gray-400">Need help? We're here 24/7</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+2348000000000"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Call Support
                </a>
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-full transition font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Routa Driver. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/driver/terms" className="text-gray-500 hover:text-gray-700 text-sm transition">Terms</Link>
              <Link to="/driver/support" className="text-gray-500 hover:text-gray-700 text-sm transition">Support</Link>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Powered by</span>
                <span className="text-green-600 font-medium">Routa</span>
                <span>🚀</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DriverDashboard;
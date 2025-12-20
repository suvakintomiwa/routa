import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RouteMap from '../components/Map/RouteMap';
import LiveTrackingMap from '../components/Map/LiveTrackingMap';
import {
  Package,
  MapPin,
  Clock,
  Truck,
  ChevronLeft,
  Check,
  X,
  Zap,
  Bell,
  LogOut,
  Phone,
  Navigation,
  User,
  Star,
  Shield,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Home,
  FileText,
  MessageCircle,
  ExternalLink,
  Circle,
  Car,
  Weight,
  Calendar,
  RefreshCw,
  Share2,
  HelpCircle,
  Menu
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [driverLocation, setDriverLocation] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Simulate driver movement (demo)
  useEffect(() => {
    if (!order || !['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status)) return;

    const interval = setInterval(() => {
      const pickup = { lat: order.pickupLat, lng: order.pickupLng };
      const dropoff = { lat: order.dropoffLat, lng: order.dropoffLng };

      const progress = Math.random();
      setDriverLocation({
        lat: pickup.lat + (dropoff.lat - pickup.lat) * progress,
        lng: pickup.lng + (dropoff.lng - pickup.lng) * progress,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [order]);

  // Auto-refresh for active orders
  useEffect(() => {
    if (!order || ['DELIVERED', 'CANCELLED'].includes(order.status)) return;

    const interval = setInterval(fetchOrder, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [order]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError('Failed to load order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/orders/${id}/cancel`);
      setShowCancelModal(false);
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(order.trackingId || order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Track my Routa delivery',
        text: `Track my package: ${order.trackingId || order.id}`,
        url: window.location.href,
      });
    } else {
      copyTrackingId();
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Status configuration
  const statusConfig = {
    PENDING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: Clock,
      label: 'Pending',
      description: 'Waiting for a driver to accept your order',
      color: 'yellow'
    },
    ACCEPTED: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Check,
      label: 'Accepted',
      description: 'A driver has accepted your order',
      color: 'blue'
    },
    PICKED_UP: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: Package,
      label: 'Picked Up',
      description: 'Driver has picked up your package',
      color: 'purple'
    },
    IN_TRANSIT: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: Truck,
      label: 'In Transit',
      description: 'Your package is on the way',
      color: 'indigo'
    },
    DELIVERED: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: CheckCircle,
      label: 'Delivered',
      description: 'Package has been delivered successfully',
      color: 'green'
    },
    CANCELLED: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: X,
      label: 'Cancelled',
      description: 'This order has been cancelled',
      color: 'red'
    },
  };

  const getStatusStep = (status) => {
    const steps = { PENDING: 1, ACCEPTED: 2, PICKED_UP: 3, IN_TRANSIT: 4, DELIVERED: 5 };
    return steps[status] || 0;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find this order. It may have been deleted or doesn't exist.</p>
          <Link
            to="/orders/my-orders"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to My Orders
          </Link>
        </motion.div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;
  const currentStep = getStatusStep(order.status);
  const pickup = { lat: order.pickupLat, lng: order.pickupLng, address: order.pickupAddress };
  const dropoff = { lat: order.dropoffLat, lng: order.dropoffLng, address: order.dropoffAddress };
  const isLiveTracking = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status);
  const canCancel = ['PENDING', 'ACCEPTED'].includes(order.status);

  const progressSteps = [
    { key: 'PENDING', label: 'Pending', icon: Clock },
    { key: 'ACCEPTED', label: 'Accepted', icon: Check },
    { key: 'PICKED_UP', label: 'Picked Up', icon: Package },
    { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

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
              <Link to="/orders/my-orders" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2">
                <FileText className="w-4 h-4" />
                My Orders
              </Link>

              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
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
              <Link to="/orders/my-orders" className="flex items-center gap-2 text-gray-600">
                <FileText className="w-5 h-5" /> My Orders
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
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/orders/my-orders"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to My Orders
            </Link>
          </motion.div>

          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${status.bg} ${status.border} border-2 rounded-2xl p-6 mb-6`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                  <StatusIcon className={`w-7 h-7 ${status.text}`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${status.text}`}>{status.label}</h2>
                  <p className="text-gray-600 text-sm">{status.description}</p>
                </div>
              </div>
              
              {isLiveTracking && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-700">Live Tracking</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order ID & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
                <div className="flex items-center gap-3">
                  <code className="text-lg font-mono font-bold text-gray-900">
                    {order.trackingId || order.id?.slice(0, 12)}
                  </code>
                  <button
                    onClick={copyTrackingId}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Copy tracking ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {formatDate(order.createdAt)}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={shareOrder}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={fetchOrder}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>

          {/* Progress Tracker */}
          {order.status !== 'CANCELLED' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Progress</h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {progressSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index + 1 < currentStep;
                    const isCurrent = index + 1 === currentStep;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </motion.div>
                        <p className={`text-xs mt-2 font-medium text-center ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isLiveTracking ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {isLiveTracking ? (
                    <Navigation className="w-5 h-5 text-green-600" />
                  ) : (
                    <MapPin className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {isLiveTracking ? 'Live Tracking' : 'Delivery Route'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isLiveTracking ? 'Driver location updates in real-time' : 'Pickup to dropoff route'}
                  </p>
                </div>
              </div>
              
              {isLiveTracking && (
                <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              )}
            </div>
            
            <div className="h-[300px]">
              {isLiveTracking ? (
                <LiveTrackingMap
                  pickup={pickup}
                  dropoff={dropoff}
                  driverLocation={driverLocation}
                  status={order.status}
                />
              ) : (
                <RouteMap pickup={pickup} dropoff={dropoff} />
              )}
            </div>
          </motion.div>

          {/* Price & Distance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Total Price</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">₦</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.price)}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Distance</span>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{order.distance} km</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Vehicle</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{order.vehicleType || 'Bike'}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Weight</span>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Weight className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{order.packageWeight || '-'} kg</p>
            </div>
          </motion.div>

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Route</h3>
            
            <div className="space-y-4">
              {/* Pickup */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Circle className="w-4 h-4 text-green-600 fill-green-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">PICKUP LOCATION</p>
                  <p className="font-medium text-gray-900 mb-2">{order.pickupAddress}</p>
                  <a 
                    href={`tel:${order.pickupContact}`}
                    className="inline-flex items-center gap-2 text-blue-600 text-sm hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {order.pickupContact}
                  </a>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">DROPOFF LOCATION</p>
                  <p className="font-medium text-gray-900 mb-2">{order.dropoffAddress}</p>
                  <a 
                    href={`tel:${order.dropoffContact}`}
                    className="inline-flex items-center gap-2 text-blue-600 text-sm hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {order.dropoffContact}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Package Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Package Details</h3>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900">{order.packageDesc || 'No description provided'}</p>
              {order.instructions && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Special Instructions:</p>
                  <p className="text-gray-700">{order.instructions}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Driver Info */}
          {order.driver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your Driver</h3>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {order.driver.user?.firstName?.charAt(0)}
                    {order.driver.user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {order.driver.user?.firstName} {order.driver.user?.lastName}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        {order.driver.vehicleType}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{order.driver.vehiclePlate}</span>
                    </div>
                    {order.driver.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-gray-900">{order.driver.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${order.driver.user?.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${order.driver.user?.phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full bg-red-50 border-2 border-red-200 text-red-600 py-4 rounded-xl hover:bg-red-100 transition font-semibold flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel Order
              </button>
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 bg-gray-50 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 text-sm">Having issues with this order?</span>
            </div>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium text-sm flex items-center gap-1 hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              Get help
            </a>
          </motion.div>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Order?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default OrderDetails;
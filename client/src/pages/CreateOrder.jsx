import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LocationPicker from '../components/Map/LocationPicker';
import RouteMap from '../components/Map/RouteMap';
import {
  Package,
  MapPin,
  Clock,
  Truck,
  Star,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowRight,
  Menu,
  X,
  Zap,
  Wallet,
  Bell,
  LogOut,
  Navigation,
  Phone,
  MessageCircle,
  User,
  FileText,
  Shield,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  Circle,
  Home,
  Info,
  DollarSign,
  Weight,
  Car,
  Bike
} from 'lucide-react';

const CreateOrder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Location states
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);

  // Nearby riders
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [ridersLoading, setRidersLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('BIKE');

  // Form data
  const [formData, setFormData] = useState({
    pickupContact: '',
    dropoffContact: '',
    packageDesc: '',
    packageWeight: '',
    instructions: '',
  });

  const [priceEstimate, setPriceEstimate] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user's current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Search for nearby riders when location is obtained
  useEffect(() => {
    if (userLocation) {
      searchNearbyRiders(userLocation);
    }
  }, [userLocation]);

  // Pre-fill pickup contact with user's phone
  useEffect(() => {
    if (user?.phone) {
      setFormData(prev => ({ ...prev, pickupContact: user.phone }));
    }
  }, [user]);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const address = await reverseGeocode(latitude, longitude);
          
          const location = {
            lat: latitude,
            lng: longitude,
            address: address || 'Current Location',
          };
          
          setUserLocation(location);
          setPickup(location); // Auto-set pickup to current location
          setLocationLoading(false);
        } catch (err) {
          console.error('Geocoding error:', err);
          const location = {
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          };
          setUserLocation(location);
          setPickup(location);
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        // Format address nicely
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.suburb) parts.push(data.address.suburb);
        if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
        if (data.address.state) parts.push(data.address.state);
        
        return parts.join(', ') || data.display_name;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };

  const searchNearbyRiders = async (location) => {
    setRidersLoading(true);
    
    try {
      // Call API to find nearby riders
      const response = await api.get('/drivers/nearby', {
        params: {
          lat: location.lat,
          lng: location.lng,
          radius: 5, // 5km radius
        }
      });
      
      setNearbyRiders(response.data.drivers || []);
    } catch (err) {
      console.error('Error fetching nearby riders:', err);
      // For demo, show mock riders
      setNearbyRiders([
        { id: 1, name: 'Chidi O.', rating: 4.9, trips: 234, vehicle: 'BIKE', distance: 0.5, eta: 3 },
        { id: 2, name: 'Emeka A.', rating: 4.8, trips: 189, vehicle: 'BIKE', distance: 0.8, eta: 5 },
        { id: 3, name: 'Tunde K.', rating: 4.7, trips: 312, vehicle: 'CAR', distance: 1.2, eta: 7 },
        { id: 4, name: 'Blessing N.', rating: 4.9, trips: 156, vehicle: 'BIKE', distance: 1.5, eta: 8 },
      ]);
    } finally {
      setRidersLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const vehicleTypes = [
    { 
      id: 'BIKE', 
      name: 'Bike', 
      icon: '🏍️',
      description: 'Small packages, documents',
      basePrice: 500,
      pricePerKm: 100,
      maxWeight: 5,
      eta: '15-25 min'
    },
    { 
      id: 'CAR', 
      name: 'Car', 
      icon: '🚗',
      description: 'Medium packages, fragile items',
      basePrice: 1000,
      pricePerKm: 150,
      maxWeight: 20,
      eta: '20-35 min'
    },
    { 
      id: 'VAN', 
      name: 'Van', 
      icon: '🚐',
      description: 'Large items, bulk orders',
      basePrice: 2500,
      pricePerKm: 250,
      maxWeight: 100,
      eta: '30-45 min'
    },
  ];

  const calculatePrice = useCallback(() => {
    if (!pickup || !dropoff) return;

    const R = 6371;
    const dLat = (dropoff.lat - pickup.lat) * (Math.PI / 180);
    const dLng = (dropoff.lng - pickup.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pickup.lat * (Math.PI / 180)) *
      Math.cos(dropoff.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(R * c * 10) / 10;

    const vehicle = vehicleTypes.find(v => v.id === selectedVehicle);
    const price = vehicle.basePrice + (distance * vehicle.pricePerKm);

    setPriceEstimate({ 
      distance, 
      price: Math.round(price),
      vehicle: vehicle,
      eta: vehicle.eta
    });
  }, [pickup, dropoff, selectedVehicle]);

  useEffect(() => {
    if (pickup && dropoff) {
      calculatePrice();
    }
  }, [pickup, dropoff, selectedVehicle, calculatePrice]);

  const nextStep = () => {
    if (step === 1) {
      if (!pickup || !formData.pickupContact) {
        setError('Please confirm pickup location and enter contact number');
        return;
      }
    } else if (step === 2) {
      if (!dropoff || !formData.dropoffContact) {
        setError('Please select dropoff location and enter contact number');
        return;
      }
    } else if (step === 3) {
      if (!selectedVehicle) {
        setError('Please select a vehicle type');
        return;
      }
    }
    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.packageDesc) {
      setError('Please describe your package');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        pickupAddress: pickup.address,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        pickupContact: formData.pickupContact,
        dropoffAddress: dropoff.address,
        dropoffLat: dropoff.lat,
        dropoffLng: dropoff.lng,
        dropoffContact: formData.dropoffContact,
        packageDesc: formData.packageDesc,
        packageWeight: formData.packageWeight ? parseFloat(formData.packageWeight) : null,
        vehicleType: selectedVehicle,
        instructions: formData.instructions,
        estimatedPrice: priceEstimate?.price,
      };

      const response = await api.post('/orders', orderData);
      navigate(`/orders/${response.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredRiders = nearbyRiders.filter(r => 
    selectedVehicle === 'ALL' || r.vehicle === selectedVehicle
  );

  const steps = [
    { num: 1, label: 'Pickup', icon: Circle },
    { num: 2, label: 'Dropoff', icon: MapPin },
    { num: 3, label: 'Vehicle', icon: Truck },
    { num: 4, label: 'Confirm', icon: Check },
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Send a Package
            </h1>
            <p className="text-gray-600">
              Fast, reliable delivery across the city
            </p>
          </motion.div>

          {/* Nearby Riders Banner */}
          {!ridersLoading && nearbyRiders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{nearbyRiders.length} riders nearby</p>
                    <p className="text-green-100 text-sm">Average pickup time: 5 mins</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {nearbyRiders.slice(0, 4).map((rider, i) => (
                    <div
                      key={rider.id}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-semibold text-xs border-2 border-green-500"
                    >
                      {rider.name.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                
                return (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-600 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 md:w-20 h-1 mx-2 rounded ${
                          step > s.num ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Pickup Location */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Circle className="w-6 h-6 text-green-600 fill-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Pickup Location</h2>
                        <p className="text-gray-500 text-sm">Where should we pick up your package?</p>
                      </div>
                    </div>

                    {/* Current Location Card */}
                    {locationLoading ? (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-blue-700">Detecting your location...</span>
                      </div>
                    ) : locationError ? (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="text-yellow-700">{locationError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          className="text-blue-600 text-sm font-medium hover:underline"
                        >
                          Try again
                        </button>
                      </div>
                    ) : userLocation && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <Navigation className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-green-600 font-medium">Current Location Detected</p>
                              <p className="text-gray-800 font-medium">{userLocation.address}</p>
                            </div>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                    )}

                    {/* Location Picker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or search for a different address
                      </label>
                      <LocationPicker
                        value={pickup}
                        onChange={setPickup}
                        placeholder="Search pickup address..."
                        markerColor="#22C55E"
                      />
                    </div>

                    {/* Pickup Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="pickupContact"
                          value={formData.pickupContact}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="08012345678"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                    >
                      Continue to Dropoff
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Dropoff Location */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Dropoff Location</h2>
                        <p className="text-gray-500 text-sm">Where should we deliver your package?</p>
                      </div>
                    </div>

                    {/* Location Picker */}
                    <LocationPicker
                      value={dropoff}
                      onChange={setDropoff}
                      placeholder="Search dropoff address..."
                      markerColor="#EF4444"
                    />

                    {/* Dropoff Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient's Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="dropoffContact"
                          value={formData.dropoffContact}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="08012345678"
                        />
                      </div>
                    </div>

                    {/* Route Preview */}
                    {pickup && dropoff && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="w-0.5 h-8 bg-gray-300"></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <p className="text-xs text-gray-500">FROM</p>
                              <p className="text-sm font-medium text-gray-800 truncate">{pickup.address}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">TO</p>
                              <p className="text-sm font-medium text-gray-800 truncate">{dropoff.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                      >
                        Choose Vehicle
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Vehicle Selection */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Choose Vehicle</h2>
                        <p className="text-gray-500 text-sm">Select the best option for your package</p>
                      </div>
                    </div>

                    {/* Vehicle Options */}
                    <div className="space-y-3">
                      {vehicleTypes.map((vehicle) => {
                        const availableCount = nearbyRiders.filter(r => r.vehicle === vehicle.id).length;
                        const isSelected = selectedVehicle === vehicle.id;
                        
                        return (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => setSelectedVehicle(vehicle.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-4xl">{vehicle.icon}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900">{vehicle.name}</p>
                                    {availableCount > 0 && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        {availableCount} nearby
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">{vehicle.description}</p>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Weight className="w-3 h-3" />
                                      Up to {vehicle.maxWeight}kg
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {vehicle.eta}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">₦{vehicle.basePrice}</p>
                                <p className="text-xs text-gray-400">+₦{vehicle.pricePerKm}/km</p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute top-4 right-4">
                                <CheckCircle className="w-6 h-6 text-blue-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Nearby Riders for Selected Vehicle */}
                    {filteredRiders.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">Available Riders</p>
                        <div className="space-y-2">
                          {filteredRiders.slice(0, 3).map((rider) => (
                            <div key={rider.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {rider.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{rider.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                      {rider.rating}
                                    </span>
                                    <span>•</span>
                                    <span>{rider.trips} trips</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">{rider.eta} min</p>
                                <p className="text-xs text-gray-400">{rider.distance} km away</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                      >
                        Review Order
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirm Order */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Review & Confirm</h2>
                        <p className="text-gray-500 text-sm">Make sure everything looks good</p>
                      </div>
                    </div>

                    {/* Route Map */}
                    {pickup && dropoff && (
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <RouteMap pickup={pickup} dropoff={dropoff} />
                      </div>
                    )}

                    {/* Price Summary */}
                    {priceEstimate && (
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-blue-200 text-sm">Distance</p>
                            <p className="text-2xl font-bold">{priceEstimate.distance} km</p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-sm">Vehicle</p>
                            <p className="text-2xl font-bold">{priceEstimate.vehicle.icon}</p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-sm">Total</p>
                            <p className="text-2xl font-bold">₦{priceEstimate.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Circle className="w-4 h-4 text-green-600 fill-green-600" />
                          <p className="text-sm font-medium text-green-700">Pickup</p>
                        </div>
                        <p className="text-gray-800 font-medium text-sm mb-1">{pickup?.address}</p>
                        <p className="text-blue-600 text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {formData.pickupContact}
                        </p>
                      </div>

                      <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <p className="text-sm font-medium text-red-700">Dropoff</p>
                        </div>
                        <p className="text-gray-800 font-medium text-sm mb-1">{dropoff?.address}</p>
                        <p className="text-blue-600 text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {formData.dropoffContact}
                        </p>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What are you sending? *
                      </label>
                      <div className="relative">
                        <Package className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          name="packageDesc"
                          value={formData.packageDesc}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                          placeholder="e.g., Documents, Electronics, Food package"
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg) - Optional
                        </label>
                        <div className="relative">
                          <Weight className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="packageWeight"
                            value={formData.packageWeight}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="0.5"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions
                        </label>
                        <input
                          type="text"
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Handle with care, call on arrival, etc."
                        />
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 py-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Insured up to ₦500K</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Real-time tracking</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Order...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Confirm Order • ₦{priceEstimate?.price.toLocaleString()}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 text-sm">Need help with your order?</span>
            </div>
            <a
              href="https://wa.me/2349033518016"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium text-sm flex items-center gap-1 hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us
            </a>
          </motion.div>
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

export default CreateOrder;
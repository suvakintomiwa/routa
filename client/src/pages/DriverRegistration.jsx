import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Truck,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  Zap,
  Wallet,
  LogOut,
  Shield,
  FileText,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Car,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
  ChevronRight,
  Upload,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IdCard,
  BadgeCheck
} from 'lucide-react';

const DriverRegistration = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    vehicleType: 'BIKE',
    vehiclePlate: '',
    licenseNumber: '',
    vehicleColor: '',
    vehicleModel: '',
    yearsOfExperience: '',
    hasInsurance: false,
    acceptedTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const vehicleTypes = [
    { 
      value: 'BIKE', 
      label: 'Motorcycle', 
      icon: '🏍️',
      description: 'Small packages & documents',
      earnings: '₦80K - ₦150K/month',
      popular: true
    },
    { 
      value: 'CAR', 
      label: 'Car', 
      icon: '🚗',
      description: 'Medium packages & fragile items',
      earnings: '₦100K - ₦200K/month',
      popular: false
    },
    { 
      value: 'VAN', 
      label: 'Van', 
      icon: '🚐',
      description: 'Large items & bulk orders',
      earnings: '₦150K - ₦300K/month',
      popular: false
    },
    { 
      value: 'TRUCK', 
      label: 'Truck', 
      icon: '🚚',
      description: 'Heavy cargo & moving',
      earnings: '₦200K - ₦400K/month',
      popular: false
    },
  ];

  const benefits = [
    { icon: Wallet, title: 'Instant Payouts', description: 'Get paid in USDC immediately after each delivery' },
    { icon: Clock, title: 'Flexible Hours', description: 'Work whenever you want, no minimum hours' },
    { icon: Shield, title: 'Insurance Coverage', description: 'Protected on every trip you make' },
    { icon: Award, title: 'Earn Badges', description: 'Build your on-chain reputation and earn more' },
  ];

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.vehicleType) {
        setError('Please select a vehicle type');
        return false;
      }
    } else if (step === 2) {
      if (!formData.vehiclePlate) {
        setError('Please enter your vehicle plate number');
        return false;
      }
      if (!formData.licenseNumber) {
        setError('Please enter your driver\'s license number');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Redirect after success animation
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to create driver profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const steps = [
    { num: 1, label: 'Vehicle', icon: Truck },
    { num: 2, label: 'Documents', icon: FileText },
    { num: 3, label: 'Confirm', icon: Check },
  ];

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Welcome to the Team! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-6"
          >
            Your driver profile has been created successfully
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-green-600"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Redirecting to dashboard...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">Routa</span>
                <span className="text-xs text-green-600 font-medium ml-1">Driver</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
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
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Earn up to ₦400K/month
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Driver Profile
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Just a few more details and you'll be ready to start earning with Routa
            </p>
          </motion.div>

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
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;

                return (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-green-600 text-white shadow-lg scale-110'
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
                        isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 md:w-24 h-1 mx-2 rounded ${
                          currentStep > s.num ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
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

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Vehicle Selection */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Select Your Vehicle</h2>
                            <p className="text-gray-500 text-sm">Choose the type of vehicle you'll be using</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {vehicleTypes.map((vehicle) => (
                            <label
                              key={vehicle.value}
                              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                formData.vehicleType === vehicle.value
                                  ? 'border-green-500 bg-green-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <input
                                type="radio"
                                name="vehicleType"
                                value={vehicle.value}
                                checked={formData.vehicleType === vehicle.value}
                                onChange={handleChange}
                                className="hidden"
                              />
                              {vehicle.popular && (
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                              {formData.vehicleType === vehicle.value && (
                                <div className="absolute top-3 right-3">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                              )}
                              <div className="text-center">
                                <span className="text-4xl block mb-2">{vehicle.icon}</span>
                                <p className="font-bold text-gray-900">{vehicle.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{vehicle.description}</p>
                                <p className="text-xs font-medium text-green-600 mt-2">{vehicle.earnings}</p>
                              </div>
                            </label>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2: Documents */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Vehicle & License Details</h2>
                            <p className="text-gray-500 text-sm">Enter your vehicle and license information</p>
                          </div>
                        </div>

                        {/* Selected Vehicle Display */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                          <span className="text-4xl">
                            {vehicleTypes.find(v => v.value === formData.vehicleType)?.icon}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900">
                              {vehicleTypes.find(v => v.value === formData.vehicleType)?.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {vehicleTypes.find(v => v.value === formData.vehicleType)?.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="ml-auto text-green-600 text-sm font-medium hover:underline"
                          >
                            Change
                          </button>
                        </div>

                        {/* Vehicle Plate */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Plate Number *
                          </label>
                          <div className="relative">
                            <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="vehiclePlate"
                              value={formData.vehiclePlate}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition uppercase"
                              placeholder="ABC-123-XY"
                            />
                          </div>
                        </div>

                        {/* License Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Driver's License Number *
                          </label>
                          <div className="relative">
                            <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="licenseNumber"
                              value={formData.licenseNumber}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition uppercase"
                              placeholder="DL123456789"
                            />
                          </div>
                        </div>

                        {/* Vehicle Details Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Color
                            </label>
                            <input
                              type="text"
                              name="vehicleColor"
                              value={formData.vehicleColor}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                              placeholder="e.g., Black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Model
                            </label>
                            <input
                              type="text"
                              name="vehicleModel"
                              value={formData.vehicleModel}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                              placeholder="e.g., Toyota Corolla"
                            />
                          </div>
                        </div>

                        {/* Experience */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Driving Experience
                          </label>
                          <select
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          >
                            <option value="">Select...</option>
                            <option value="1">Less than 1 year</option>
                            <option value="1-3">1-3 years</option>
                            <option value="3-5">3-5 years</option>
                            <option value="5+">5+ years</option>
                          </select>
                        </div>

                        {/* Insurance */}
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="checkbox"
                            name="hasInsurance"
                            checked={formData.hasInsurance}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">I have valid vehicle insurance</p>
                            <p className="text-sm text-gray-500">Required for all drivers</p>
                          </div>
                          <Shield className="w-5 h-5 text-green-500 ml-auto" />
                        </label>

                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-semibold"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={nextStep}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                          >
                            Continue
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Confirm */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <BadgeCheck className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
                            <p className="text-gray-500 text-sm">Make sure everything looks correct</p>
                          </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-5xl">
                              {vehicleTypes.find(v => v.value === formData.vehicleType)?.icon}
                            </span>
                            <div>
                              <p className="text-green-100 text-sm">Your Vehicle</p>
                              <p className="text-2xl font-bold">
                                {vehicleTypes.find(v => v.value === formData.vehicleType)?.label}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                            <div>
                              <p className="text-green-100 text-sm">Plate Number</p>
                              <p className="font-bold">{formData.vehiclePlate || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-green-100 text-sm">License</p>
                              <p className="font-bold">{formData.licenseNumber || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Profile Summary */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Driver Name</span>
                            <span className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium text-gray-900">{user?.email}</span>
                          </div>
                          {formData.vehicleColor && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Vehicle Color</span>
                              <span className="font-medium text-gray-900">{formData.vehicleColor}</span>
                            </div>
                          )}
                          {formData.vehicleModel && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Vehicle Model</span>
                              <span className="font-medium text-gray-900">{formData.vehicleModel}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className={`font-medium ${formData.hasInsurance ? 'text-green-600' : 'text-gray-400'}`}>
                              {formData.hasInsurance ? '✓ Verified' : 'Not provided'}
                            </span>
                          </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="checkbox"
                            name="acceptedTerms"
                            checked={formData.acceptedTerms}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500 mt-0.5"
                          />
                          <div>
                            <p className="text-gray-700">
                              I agree to the{' '}
                              <a href="#" className="text-green-600 hover:underline font-medium">Terms of Service</a>,{' '}
                              <a href="#" className="text-green-600 hover:underline font-medium">Driver Guidelines</a>, and{' '}
                              <a href="#" className="text-green-600 hover:underline font-medium">Privacy Policy</a>
                            </p>
                          </div>
                        </label>

                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-semibold"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={loading || !formData.acceptedTerms}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Profile...
                              </>
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Complete Registration
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>

            {/* Benefits Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white sticky top-24">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Driver Benefits
                </h3>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{benefit.title}</p>
                          <p className="text-sm text-gray-400">{benefit.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Earnings Highlight */}
                <div className="mt-6 p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Potential Earnings</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    {vehicleTypes.find(v => v.value === formData.vehicleType)?.earnings}
                  </p>
                </div>

                {/* Driver Stats */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-4">Join our growing fleet</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold">5,000+</p>
                      <p className="text-xs text-gray-400">Active Drivers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">4.9</p>
                      <p className="text-xs text-gray-400">Avg. Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
                © {new Date().getFullYear()} Routa Driver
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition">Support</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition">Terms</a>
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

export default DriverRegistration;
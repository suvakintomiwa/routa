import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  Smartphone,
  Truck,
  CreditCard,
  Star,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Zap,
  Users,
  Globe,
  Wallet
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                Routa
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
              <a href="#drivers" className="text-gray-600 hover:text-blue-600 transition">Drive with Us</a>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition font-medium"
              >
                Get Started
              </Link>
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
              className="md:hidden mt-4 pb-4 space-y-4"
            >
              <a href="#features" className="block text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-blue-600">How it Works</a>
              <a href="#pricing" className="block text-gray-600 hover:text-blue-600">Pricing</a>
              <a href="#drivers" className="block text-gray-600 hover:text-blue-600">Drive with Us</a>
              <Link to="/login" className="block text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="block bg-blue-600 text-white px-6 py-2.5 rounded-full text-center">
                Get Started
              </Link>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Now with crypto payments on Base
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Deliver Anything,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  {" "}Anywhere
                </span>
                <br />in Minutes
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                The fastest way to send packages across the city. Real-time tracking, 
                instant settlements, and blockchain-verified deliveries.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition font-semibold text-lg group"
                >
                  Send a Package
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link 
                  to="/register?role=driver" 
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:border-blue-600 hover:text-blue-600 transition font-semibold text-lg"
                >
                  <Truck className="w-5 h-5" />
                  Become a Driver
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Insured Deliveries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>30 Min Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>4.9 Rating</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Phone Mockup */}
              <div className="relative mx-auto w-[300px] md:w-[350px]">
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
                      <span className="text-sm font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Good morning</p>
                          <p className="font-bold text-lg">Where to deliver?</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">👤</span>
                        </div>
                      </div>

                      {/* Search Box */}
                      <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400">Enter destination</span>
                      </div>

                      {/* Map Preview */}
                      <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-40 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                          <div className="absolute bottom-8 right-8 w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Truck className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                        <span className="text-4xl">🗺️</span>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: '📦', label: 'Package' },
                          { icon: '📄', label: 'Document' },
                          { icon: '🍔', label: 'Food' },
                        ].map((item, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                            <span className="text-2xl block mb-1">{item.icon}</span>
                            <span className="text-xs text-gray-600">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -left-16 top-20 bg-white rounded-xl shadow-lg p-3 hidden md:block"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Package Delivered</p>
                      <p className="text-sm font-bold">2 mins ago</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -right-12 bottom-32 bg-white rounded-xl shadow-lg p-3 hidden md:block"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className="text-sm font-bold">$12.50 USDC</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Trusted by businesses across Africa</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {['🏪 Shoprite', '🏦 GTBank', '📱 MTN', '🛒 Jumia', '🍔 Chicken Republic'].map((brand, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold text-gray-400">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for
              <span className="text-blue-600"> seamless delivery</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From real-time tracking to blockchain payments, we've built the complete logistics solution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Real-Time Tracking',
                description: 'Track your package every step of the way with live GPS updates and ETA predictions.',
                color: 'bg-blue-500'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Instant Matching',
                description: 'Our AI matches you with the nearest available driver within seconds.',
                color: 'bg-yellow-500'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Secure & Insured',
                description: 'All deliveries are insured up to ₦500,000. Your packages are protected.',
                color: 'bg-green-500'
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: 'Crypto Payments',
                description: 'Pay with USDC on Base. Instant settlements with blockchain transparency.',
                color: 'bg-purple-500'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Verified Drivers',
                description: 'All drivers are background-checked with on-chain reputation scores.',
                color: 'bg-pink-500'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'City-Wide Coverage',
                description: 'Available across Lagos, Abuja, Port Harcourt, and expanding fast.',
                color: 'bg-cyan-500'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Routa Works
            </h2>
            <p className="text-lg text-gray-600">
              Send a package in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Locations',
                description: 'Tell us where to pick up and deliver your package.',
                icon: '📍'
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'A verified driver accepts your order within minutes.',
                icon: '🤝'
              },
              {
                step: '03',
                title: 'Track & Receive',
                description: 'Watch your delivery in real-time until it arrives.',
                icon: '📦'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative z-10">
                  <span className="text-6xl mb-4 block">{item.icon}</span>
                  <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Pay only for what you use. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Bike',
                icon: '🏍️',
                base: '₦500',
                perKm: '₦100',
                description: 'Small packages, documents',
                features: ['Up to 5kg', 'Fastest option', 'Perfect for documents']
              },
              {
                name: 'Car',
                icon: '🚗',
                base: '₦1,000',
                perKm: '₦150',
                description: 'Medium packages',
                features: ['Up to 20kg', 'Air conditioned', 'Fragile items welcome'],
                popular: true
              },
              {
                name: 'Van',
                icon: '🚐',
                base: '₦2,500',
                perKm: '₦250',
                description: 'Large items, bulk orders',
                features: ['Up to 100kg', 'Furniture friendly', 'Business deliveries']
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-8 border-2 ${
                  plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-100'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <span className="text-5xl mb-4 block">{plan.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.base}</span>
                  <span className="text-gray-500"> base</span>
                  <p className="text-gray-500">+ {plan.perKm}/km</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver CTA Section */}
      <section id="drivers" className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Earn Money on Your Schedule
              </h2>
              <p className="text-green-100 text-lg mb-8">
                Join thousands of drivers earning with Routa. Flexible hours, instant USDC payouts, 
                and build your on-chain reputation.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: '₦150K+', label: 'Avg Monthly Earnings' },
                  { value: '5,000+', label: 'Active Drivers' },
                  { value: '24/7', label: 'Support Available' },
                  { value: 'Instant', label: 'Crypto Payouts' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-green-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/register?role=driver"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full hover:bg-green-50 transition font-semibold text-lg"
              >
                Start Driving Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                    🧑
                  </div>
                  <div>
                    <p className="font-bold text-lg">David Okonkwo</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600">4.9 • 1,234 deliveries</span>
                    </div>
                  </div>
                  <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Gold Driver
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">₦45K</p>
                    <p className="text-xs text-gray-500">This Week</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">32</p>
                    <p className="text-xs text-gray-500">Deliveries</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-xs text-gray-500">On-Time</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100">Courier NFT</p>
                      <p className="font-bold">Reputation Score: 92/100</p>
                    </div>
                    <div className="text-3xl">🎖️</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers are saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Chioma Nwosu',
                role: 'E-commerce Owner',
                image: '👩🏾',
                text: 'Routa has transformed how I deliver to customers. Same-day delivery has increased my sales by 40%!',
                rating: 5
              },
              {
                name: 'Ahmed Ibrahim',
                role: 'Restaurant Owner',
                image: '👨🏽',
                text: 'The real-time tracking gives my customers peace of mind. Best delivery service in Lagos!',
                rating: 5
              },
              {
                name: 'Blessing Okafor',
                role: 'Routa Driver',
                image: '👩🏾',
                text: 'I earn more than my previous job with flexible hours. The instant USDC payouts are amazing!',
                rating: 5
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{testimonial.image}</span>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Deliveries?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of customers and drivers already using Routa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition font-semibold text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="mailto:hello@routahq.com" 
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:border-blue-600 hover:text-blue-600 transition font-semibold text-lg"
              >
                Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Routa</span>
              </Link>
              <p className="mb-4 max-w-sm">
                The fastest way to deliver anything, anywhere. Powered by blockchain technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition">Twitter</a>
                <a href="#" className="hover:text-white transition">Instagram</a>
                <a href="#" className="hover:text-white transition">LinkedIn</a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Routa. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span>Built on</span>
              <span className="text-blue-400 font-medium">Base</span>
              <span>⛓️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import { useState } from 'react';
import DeliveryMap from '../components/Map/DeliveryMap.jsx';
import socketService from '../services/socketService.js';

const CreateOrder = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [packageType, setPackageType] = useState('package');

  const calculatePrice = () => {
    if (!routeInfo) return 0;
    const distanceKm = routeInfo.distanceValue / 1000;
    const basePrice = 500;
    const pricePerKm = 100;
    return Math.round(basePrice + (distanceKm * pricePerKm));
  };

  const handleSubmitOrder = () => {
    if (!pickupLocation || !dropoffLocation) {
      alert('Please select pickup and dropoff locations');
      return;
    }

    const order = {
      id: `order-${Date.now()}`,
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      distance: routeInfo?.distance,
      duration: routeInfo?.duration,
      price: calculatePrice(),
      driverEarnings: calculatePrice() * 0.8,
      packageType,
      customer: {
        id: 'customer-123',
        name: 'John Doe',
        phone: '+2341234567890',
        rating: 4.8
      },
      createdAt: new Date().toISOString()
    };

    // Send to available drivers via socket
    socketService.createOrder(order);
    
    // Subscribe to updates for this order
    socketService.subscribeToOrder(order.id);
    
    alert('Order created! Waiting for driver...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Delivery</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          {/* Map Component */}
          <DeliveryMap
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            setPickupLocation={setPickupLocation}
            setDropoffLocation={setDropoffLocation}
            onRouteCalculated={setRouteInfo}
            height="400px"
          />

          {/* Package Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'document', label: 'Document', icon: '📄' },
                { id: 'package', label: 'Package', icon: '📦' },
                { id: 'food', label: 'Food', icon: '🍔' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPackageType(type.id)}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    packageType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{type.icon}</span>
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          {routeInfo && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Distance</span>
                <span>{routeInfo.distance}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Time</span>
                <span>{routeInfo.duration}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-green-600">₦{calculatePrice().toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={!pickupLocation || !dropoffLocation}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
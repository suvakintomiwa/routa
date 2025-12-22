import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { MapPin, Navigation, Clock, Route, Search, X, Loader } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color, emoji = '') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-size: 18px;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const pickupIcon = createIcon('#22c55e', '📍');
const dropoffIcon = createIcon('#ef4444', '🏁');
const driverIcon = createIcon('#3b82f6', '🚗');

// Routing component
const RoutingMachine = ({ pickup, dropoff, onRouteCalculated }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!pickup || !dropoff) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new routing control
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(pickup.lat, pickup.lng),
        L.latLng(dropoff.lat, dropoff.lng)
      ],
      routeWhileDragging: false,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [
          { color: '#3b82f6', weight: 6, opacity: 0.8 }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      altLineOptions: {
        styles: [
          { color: '#9ca3af', weight: 4, opacity: 0.6 }
        ]
      },
      createMarker: () => null, // We'll use our own markers
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving'
      })
    }).addTo(map);

    // Listen for route calculation
    routingControlRef.current.on('routesfound', (e) => {
      const routes = e.routes;
      const fastestRoute = routes[0];
      
      const distance = (fastestRoute.summary.totalDistance / 1000).toFixed(1);
      const duration = Math.round(fastestRoute.summary.totalTime / 60);

      if (onRouteCalculated) {
        onRouteCalculated({
          distance: `${distance} km`,
          distanceValue: fastestRoute.summary.totalDistance,
          duration: `${duration} mins`,
          durationValue: fastestRoute.summary.totalTime,
          coordinates: fastestRoute.coordinates
        });
      }
    });

    // Hide the routing control panel
    const container = document.querySelector('.leaflet-routing-container');
    if (container) {
      container.style.display = 'none';
    }

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [pickup, dropoff, map, onRouteCalculated]);

  return null;
};

// Map click handler
const MapClickHandler = ({ onMapClick, isSelectingPickup, isSelectingDropoff }) => {
  useMapEvents({
    click: (e) => {
      if (isSelectingPickup || isSelectingDropoff) {
        onMapClick(e.latlng, isSelectingPickup ? 'pickup' : 'dropoff');
      }
    }
  });
  return null;
};

// Recenter map component
const RecenterMap = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  
  return null;
};

// Location search component
const LocationSearch = ({ placeholder, value, onChange, onSelect, onClear, isLoading }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  const searchLocation = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ng`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    onChange(query);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchLocation(query);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    onSelect({
      address: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    });
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(searchLoading || isLoading) && (
          <Loader className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700 line-clamp-2">
                  {suggestion.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main DeliveryMap component
const DeliveryMap = ({
  onRouteCalculated,
  pickupLocation,
  dropoffLocation,
  setPickupLocation,
  setDropoffLocation,
  driverLocation,
  height = '400px'
}) => {
  const [pickupInput, setPickupInput] = useState(pickupLocation?.address || '');
  const [dropoffInput, setDropoffInput] = useState(dropoffLocation?.address || '');
  const [routeInfo, setRouteInfo] = useState(null);
  const [isSelectingPickup, setIsSelectingPickup] = useState(false);
  const [isSelectingDropoff, setIsSelectingDropoff] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 6.5244, lng: 3.3792 }); // Lagos

  // Update inputs when locations change
  useEffect(() => {
    if (pickupLocation?.address) {
      setPickupInput(pickupLocation.address);
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (dropoffLocation?.address) {
      setDropoffInput(dropoffLocation.address);
    }
  }, [dropoffLocation]);

  // Handle route calculation
  const handleRouteCalculated = useCallback((info) => {
    setRouteInfo(info);
    if (onRouteCalculated) {
      onRouteCalculated(info);
    }
  }, [onRouteCalculated]);

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Handle map click for selecting location
  const handleMapClick = async (latlng, type) => {
    const address = await getAddressFromCoords(latlng.lat, latlng.lng);
    
    if (type === 'pickup') {
      setPickupLocation({
        address,
        lat: latlng.lat,
        lng: latlng.lng
      });
      setPickupInput(address);
      setIsSelectingPickup(false);
    } else {
      setDropoffLocation({
        address,
        lat: latlng.lat,
        lng: latlng.lng
      });
      setDropoffInput(address);
      setIsSelectingDropoff(false);
    }
  };

  // Handle location search selection
  const handlePickupSelect = (location) => {
    setPickupLocation(location);
    setPickupInput(location.address);
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  const handleDropoffSelect = (location) => {
    setDropoffLocation(location);
    setDropoffInput(location.address);
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  // Use current location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoords(latitude, longitude);
        
        setPickupLocation({
          address,
          lat: latitude,
          lng: longitude
        });
        setPickupInput(address);
        setMapCenter({ lat: latitude, lng: longitude });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Could not get your location. Please enter it manually.');
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* Location Inputs */}
      <div className="space-y-3">
        {/* Pickup Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Pickup Location</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <LocationSearch
                placeholder="Enter pickup address"
                value={pickupInput}
                onChange={setPickupInput}
                onSelect={handlePickupSelect}
                onClear={() => {
                  setPickupInput('');
                  setPickupLocation(null);
                }}
                isLoading={isLoadingLocation}
              />
            </div>
            <button
              onClick={useCurrentLocation}
              disabled={isLoadingLocation}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isLoadingLocation ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Current</span>
            </button>
            <button
              onClick={() => {
                setIsSelectingPickup(true);
                setIsSelectingDropoff(false);
              }}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                isSelectingPickup 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Pick on Map</span>
            </button>
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Dropoff Location</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <LocationSearch
                placeholder="Enter delivery address"
                value={dropoffInput}
                onChange={setDropoffInput}
                onSelect={handleDropoffSelect}
                onClear={() => {
                  setDropoffInput('');
                  setDropoffLocation(null);
                }}
              />
            </div>
            <button
              onClick={() => {
                setIsSelectingDropoff(true);
                setIsSelectingPickup(false);
              }}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                isSelectingDropoff 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Pick on Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selection Mode Indicator */}
      {(isSelectingPickup || isSelectingDropoff) && (
        <div className={`p-3 rounded-xl text-center text-sm font-medium ${
          isSelectingPickup ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          Click on the map to select {isSelectingPickup ? 'pickup' : 'dropoff'} location
          <button
            onClick={() => {
              setIsSelectingPickup(false);
              setIsSelectingDropoff(false);
            }}
            className="ml-2 underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Route Info */}
      {routeInfo && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <Route className="w-5 h-5" />
            <span className="font-medium">{routeInfo.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="w-5 h-5" />
            <span className="font-medium">{routeInfo.duration}</span>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={13}
          style={{ height, width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Recenter map when needed */}
          <RecenterMap center={mapCenter} />

          {/* Click handler */}
          <MapClickHandler
            onMapClick={handleMapClick}
            isSelectingPickup={isSelectingPickup}
            isSelectingDropoff={isSelectingDropoff}
          />

          {/* Pickup Marker */}
          {pickupLocation && (
            <Marker 
              position={[pickupLocation.lat, pickupLocation.lng]} 
              icon={pickupIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-green-600">Pickup</strong>
                  <p className="mt-1">{pickupLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Dropoff Marker */}
          {dropoffLocation && (
            <Marker 
              position={[dropoffLocation.lat, dropoffLocation.lng]} 
              icon={dropoffIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-red-600">Dropoff</strong>
                  <p className="mt-1">{dropoffLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Driver Marker */}
          {driverLocation && (
            <Marker 
              position={[driverLocation.lat, driverLocation.lng]} 
              icon={driverIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-blue-600">Driver Location</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Routing */}
          {pickupLocation && dropoffLocation && (
            <RoutingMachine
              pickup={pickupLocation}
              dropoff={dropoffLocation}
              onRouteCalculated={handleRouteCalculated}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryMap;
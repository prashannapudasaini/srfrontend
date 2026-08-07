import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, User, ShieldCheck, 
  CreditCard, Banknote, CheckCircle, ArrowRight, 
  AlertCircle, CheckCircle2, MapPin, Search
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import api from '../../services/api'; 
import cIPSlogo from '../../assets/cIPSlogo.png'; 
import { useAuth } from '../../context/AuthContext'; 

// --- FIX FOR LEAFLET REACT ICONS BUGS ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- DELIVERY HUBS CONFIG ---
const HUBS = [
  { name: 'Patan', coordinates: [85.3181, 27.6742] },     // [lng, lat]
  { name: 'Kuleshwor', coordinates: [85.2970, 27.6970] }
];
const MAX_RADIUS_KM = 5;

// --- GENERATE RED ZONE MASK WITHOUT OVERLAP BUGS ---
// Regional bounding box covering Nepal/India/Tibet to prevent Leaflet from clipping
const outerBounds = [ 
  [35, 70],  // North-West
  [35, 95],  // North-East
  [20, 95],  // South-East
  [20, 70]   // South-West
]; 

// 1. Generate the circles using Turf
const circle1 = turf.circle(HUBS[0].coordinates, MAX_RADIUS_KM, { steps: 64, units: 'kilometers' });
const circle2 = turf.circle(HUBS[1].coordinates, MAX_RADIUS_KM, { steps: 64, units: 'kilometers' });

// 2. Merge them to prevent the "red intersection" bug
let mergedZones;
try {
  mergedZones = turf.union(turf.featureCollection([circle1, circle2]));
} catch (e) {
  mergedZones = turf.union(circle1, circle2);
}

// 3. Convert Coordinates from Turf [lng, lat] to Leaflet [lat, lng]
const extractLeafletCoords = (polygonFeature) => {
  const type = polygonFeature.geometry.type;
  const coords = polygonFeature.geometry.coordinates;
  const flip = (c) => [c[1], c[0]]; 
  
  if (type === 'Polygon') return [coords[0].map(flip)];
  if (type === 'MultiPolygon') return coords.map(poly => poly[0].map(flip));
  return [];
};

const safeZoneHoles = extractLeafletCoords(mergedZones);
const redZoneMask = [outerBounds, ...safeZoneHoles]; 
const circle1Border = circle1.geometry.coordinates[0].map(c => [c[1], c[0]]);
const circle2Border = circle2.geometry.coordinates[0].map(c => [c[1], c[0]]);

export default function CheckoutPage({ cartTotal, cartItems }) {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const safeName = user?.name || '';
  const safePhone = user?.phone || '';

  // ADDRESS, MAP, & SEARCH STATE
  const [addressData, setAddressData] = useState({
    detailedAddress: '',
    landmark: '',
    phone: safePhone
  });
  
  const [userLocation, setUserLocation] = useState(null); 
  const [deliveryInfo, setDeliveryInfo] = useState({ 
    available: false, fee: 0, distance: 0, hasChecked: false 
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('connectips');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // GATEKEEPER CONDITIONS
  const isAddressValid = deliveryInfo.available && Boolean(addressData.detailedAddress.trim()) && Boolean(addressData.phone.trim());
  const grandTotal = cartTotal + deliveryInfo.fee;

  // --- CORE GIS VALIDATION LOGIC ---
  const checkDeliveryZone = (lat, lng) => {
    setUserLocation([lat, lng]);
    const userPoint = turf.point([lng, lat]);
    let shortestDistance = Infinity;

    HUBS.forEach(hub => {
      const hubPoint = turf.point(hub.coordinates);
      const distance = turf.distance(userPoint, hubPoint, { units: 'kilometers' });
      if (distance < shortestDistance) shortestDistance = distance;
    });

    if (shortestDistance <= MAX_RADIUS_KM) {
      const calculatedFee = Math.ceil(shortestDistance) * 30; // Base * 30 NPR Example
      setDeliveryInfo({ available: true, fee: calculatedFee, distance: shortestDistance.toFixed(1), hasChecked: true });
    } else {
      setDeliveryInfo({ available: false, fee: 0, distance: shortestDistance.toFixed(1), hasChecked: true });
    }
  };

  // --- MAP CLICK HANDLER ---
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        checkDeliveryZone(e.latlng.lat, e.latlng.lng);
        setSearchResults([]); // Close search dropdown on map click
      },
    });
    return userLocation ? <Marker position={userLocation} /> : null;
  };

  // --- MAP PANNING HANDLER (Flies to location when searched) ---
  const MapUpdater = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      if (coords) map.flyTo(coords, 14, { duration: 1.5 });
    }, [coords, map]);
    return null;
  };

  // --- UPGRADED SEARCH API (Photon - Smarter & Google-like) ---
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingMap(true);
    try {
      // Photon API: Biased heavily towards Kathmandu (Lat: 27.7, Lon: 85.3) for highly accurate local results
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=27.7172&lon=85.3240&limit=8`);
      const data = await res.json();
      
      // Format the GeoJSON response into our dropdown list
      const formattedResults = data.features.map(feature => {
        const props = feature.properties;
        const nameParts = [props.name, props.street, props.district, props.city, props.state].filter(Boolean);
        return {
          display_name: [...new Set(nameParts)].join(', '), // Remove duplicates
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0]
        };
      }).filter(res => res.display_name); // Only keep results that actually have a name

      setSearchResults(formattedResults);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setIsSearchingMap(false);
  };

  const selectSearchResult = (result) => {
    checkDeliveryZone(result.lat, result.lon);
    setSearchResults([]); 
    setSearchQuery(result.display_name.split(',')[0]); // Put just the main name in the search bar
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!isAddressValid || !safeName || !userLocation) return; 

    setIsProcessing(true);

    const fullDeliveryAddress = `[GPS: ${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}] ${addressData.detailedAddress.trim()}` + 
      (addressData.landmark.trim() ? ` (${addressData.landmark.trim()})` : '');

    try {
      const payload = {
        user_id: user.id,
        customer_name: safeName,
        phone: addressData.phone,
        address: fullDeliveryAddress,
        total_amount: grandTotal, 
        delivery_fee: deliveryInfo.fee,
        payment_method: paymentMethod,
        items: cartItems 
      };

      const orderRes = await api.post('/orders/verify.php', payload);

      if (orderRes.data.status === 'success') {
        const realOrderId = orderRes.data.order_id; 

        if (paymentMethod === 'connectips') {
          const connectIpsRes = await api.post('/orders/init_connectips.php', {
            amount: grandTotal,
            purchase_id: realOrderId 
          });

          if (connectIpsRes.data.success) {
            submitConnectIPSForm(connectIpsRes.data.gatewayUrl, connectIpsRes.data.payload);
          } else {
            alert("Failed to initialize connectIPS payment: " + connectIpsRes.data.message);
            setIsProcessing(false);
          }
        } else {
          setIsProcessing(false);
          setIsSuccess(true); 
        }
      } else {
        alert("Failed to create order: " + orderRes.data.message);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  const submitConnectIPSForm = (gatewayUrl, payload) => {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", gatewayUrl);
    for (const key in payload) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", payload[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-10 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-inner">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Order Confirmed!</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{safeName}</strong>. We have received your order and will deliver it to your address shortly.
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="inline-flex items-center justify-center gap-2 bg-[#00519E] hover:bg-[#004182] text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md"
        >
          Continue Shopping <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Checkout Details</h2>
          <p className="text-sm text-gray-500 mt-1">Search or drop a pin on your location</p>
        </div>
        <div className="flex items-center gap-2 text-green-700 bg-green-100/50 px-3 py-1.5 rounded-full border border-green-200">
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Verified User</span>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">Customer Name</label>
              <div className="relative cursor-not-allowed">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" readOnly value={safeName || 'Customer'}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 cursor-not-allowed" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                Delivery Location *
              </label>
              
              <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
                
                {/* 🔥 CUSTOM SEARCH BAR OVERLAY */}
                <div className="absolute top-3 right-3 z-[1000] w-64 md:w-80">
                  <div className="relative flex shadow-md rounded-lg overflow-hidden bg-white">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                      placeholder="Search neighborhood..."
                      className="w-full p-3 pl-4 pr-12 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    <button 
                      type="button"
                      onClick={handleSearch}
                      className="absolute right-0 top-0 bottom-0 px-3 bg-gray-50 border-l border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      {isSearchingMap ? <Loader2 size={18} className="animate-spin text-[#00519E]" /> : <Search size={18} className="text-gray-500" />}
                    </button>
                  </div>

                  {/* SEARCH RESULTS DROPDOWN */}
                  {searchResults.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-56 overflow-y-auto z-[1001]">
                      {searchResults.map((res, index) => (
                        <li 
                          key={index} 
                          onClick={() => selectSearchResult(res)}
                          className="p-3 text-xs md:text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-0 text-gray-700 leading-tight"
                        >
                          {res.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 🔥 attributionControl={false} hides the Leaflet text */}
                <MapContainer center={[27.685, 85.305]} zoom={13} style={{ height: '100%', width: '100%' }} attributionControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* The Darker Red Zone Mask */}
                  <Polygon positions={redZoneMask} pathOptions={{ color: '#ef4444', stroke: false, fillColor: '#ef4444', fillOpacity: 0.55 }} />
                  
                  {/* Green Safe Zones */}
                  <Polygon positions={[circle1Border]} pathOptions={{ color: '#10b981', fill: false, weight: 2, dashArray: '6, 6' }} />
                  <Polygon positions={[circle2Border]} pathOptions={{ color: '#10b981', fill: false, weight: 2, dashArray: '6, 6' }} />

                  <LocationPicker />
                  <MapUpdater coords={userLocation} />
                </MapContainer>
                
                {!userLocation && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md pointer-events-none z-[999] flex items-center gap-2 border border-gray-100">
                    <MapPin size={16} className="text-[#00519E] animate-bounce" />
                    <span className="text-sm font-bold text-gray-800">Click map to pin location</span>
                  </div>
                )}
              </div>
            </div>

            {deliveryInfo.hasChecked && deliveryInfo.available && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold animate-fade-in">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Service Available! Delivery Fee: NPR {deliveryInfo.fee} ({deliveryInfo.distance} km)</span>
              </div>
            )}

            {deliveryInfo.hasChecked && !deliveryInfo.available && (
              <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold leading-relaxed animate-fade-in">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase text-[11px] tracking-wider text-red-900">Out of Delivery Zone</p>
                  <p className="mt-0.5">
                    Your location ({deliveryInfo.distance} km away) is outside our {MAX_RADIUS_KM} km delivery radius. We are expanding soon!
                  </p>
                </div>
              </div>
            )}

            {deliveryInfo.available && (
              <div className="space-y-4 animate-fade-in pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                    Detailed House / Street Address *
                  </label>
                  <input
                    type="text"
                    name="detailedAddress"
                    value={addressData.detailedAddress}
                    onChange={handleAddressChange}
                    placeholder="e.g., House No. 12, Street Name, Chowk"
                    required
                    className="w-full p-3.5 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-[#002147]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                      Nearest Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={addressData.landmark}
                      onChange={handleAddressChange}
                      placeholder="e.g., Near Bhatbhateni / Opp. School"
                      className="w-full p-3.5 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-[#002147]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      placeholder="98XXXXXXXX"
                      required
                      className="w-full p-3.5 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-[#002147]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-500" />
              Payment Method
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'connectips' ? 'border-[#00519E] bg-[#00519E]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'} ${!isAddressValid && 'opacity-50 cursor-not-allowed'}`}>
                <input type="radio" name="paymentMethod" value="connectips" className="sr-only" disabled={!isAddressValid} checked={paymentMethod === 'connectips'} onChange={() => setPaymentMethod('connectips')} />
                <div className="h-8 flex items-center justify-center">
                  <img src={cIPSlogo} alt="connectIPS" className="h-6 object-contain" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${paymentMethod === 'connectips' ? 'text-[#00519E]' : 'text-gray-500'}`}>Online Payment</span>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-[#9e111a] bg-[#9e111a]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'} ${!isAddressValid && 'opacity-50 cursor-not-allowed'}`}>
                <input type="radio" name="paymentMethod" value="cod" className="sr-only" disabled={!isAddressValid} checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[#9e111a] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Banknote size={18} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${paymentMethod === 'cod' ? 'text-[#9e111a]' : 'text-gray-500'}`}>Cash on Delivery</span>
              </label>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>NPR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm text-gray-600 pb-3 border-b border-gray-200">
                <span>Delivery Fee</span>
                <span>NPR {deliveryInfo.fee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">Total Amount Due</span>
                <span className="text-2xl font-black text-[#1A1A1A]">NPR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" disabled={isProcessing || cartTotal <= 0 || !isAddressValid}
              className={`w-full text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md flex justify-center items-center gap-3 relative disabled:opacity-50 disabled:cursor-not-allowed ${
                paymentMethod === 'connectips' ? 'bg-[#00519E] hover:bg-[#004182]' : 'bg-[#9e111a] hover:bg-[#7a0d14]'
              }`}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20} /> Processing Order...</>
              ) : !userLocation ? (
                <span>Pin Location on Map First</span>
              ) : !isAddressValid ? (
                <span>Location Out of Delivery Zone</span>
              ) : paymentMethod === 'connectips' ? (
                <span>Pay Now via ConnectIPS</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Place COD Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

function TourMap() {
  const [tours, setTours] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredTours, setFilteredTours] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:5050/api/tours');
      const staticTours = await res.json();
      const b2bTours = JSON.parse(localStorage.getItem('b2bTours') || '[]');
      const all = [...staticTours, ...b2bTours].filter(t => t.lat && t.lng);
      setTours(all);
      setFilteredTours(all);
    };
    load();
  }, []);

  const icon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);
    const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearby = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition((pos) => {
      const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserLocation(userCoords);
      const nearby = tours.filter((tour) => {
        const dist = haversineDistance(userCoords, {
          lat: parseFloat(tour.lat),
          lng: parseFloat(tour.lng),
        });
        return dist <= 50;
      });
      setFilteredTours(nearby);
    });
  };

  return (
    <div className="app">
      <Link to="/">← Back to homepage</Link>
      <h2>📍 Tour Map</h2>
      <button onClick={findNearby}>📡 Find Nearby Tours</button>

      <MapContainer center={[40.4093, 49.8671]} zoom={6} style={{ height: '500px', marginTop: '10px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {filteredTours.map((tour) => (
          <Marker key={tour.id} position={[tour.lat, tour.lng]} icon={icon}>
            <Popup>
              <strong>{tour.title}</strong><br />
              <Link to={`/tour/${tour.id}`}>View Details</Link>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default TourMap;

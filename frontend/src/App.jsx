import { Routes, Route } from 'react-router-dom';
import TourList from './pages/TourList.jsx';
import TourDetail from './pages/TourDetail.jsx';
import MyBookings from './pages/MyBookings.jsx';
import MyFavorites from './pages/MyFavorites.jsx';
import BusinessDashboard from './pages/BusinessDashboard.jsx';
import BusinessLogin from './pages/BusinessLogin.jsx';
import TourMap from './pages/TourMap.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TourList />} />
      <Route path="/tour/:id" element={<TourDetail />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/favorites" element={<MyFavorites />} />
      <Route path="/dashboard" element={<BusinessDashboard />} />
      <Route path="/login" element={<BusinessLogin />} />
      <Route path="/map" element={<TourMap />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;

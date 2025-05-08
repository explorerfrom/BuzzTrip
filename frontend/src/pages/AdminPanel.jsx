import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function AdminPanel() {
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:5050/api/tours');
      const staticTours = await res.json();
      const b2bTours = JSON.parse(localStorage.getItem('b2bTours') || '[]');
      setTours([...staticTours, ...b2bTours]);
      setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
    };
    load();
  }, []);

  const handleDeleteTour = (id) => {
    const updated = tours.filter((t) => t.id !== id);
    setTours(updated);
    const filteredB2B = JSON.parse(localStorage.getItem('b2bTours') || '[]')
      .filter((t) => t.id !== id);
    localStorage.setItem('b2bTours', JSON.stringify(filteredB2B));
  };

  return (
    <div className="app">
      <Link to="/">← Back to homepage</Link>
      <h2>🧑‍💼 Admin Dashboard</h2>

      <p><strong>Total Tours:</strong> {tours.length}</p>
      <p><strong>Total Bookings:</strong> {bookings.length}</p>

      <h3>📦 All Tours</h3>
      <div className="tour-list">
        {tours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <h4>{tour.title}</h4>
            <p>{tour.location}</p>
            <button onClick={() => handleDeleteTour(tour.id)} style={{ backgroundColor: '#fecaca' }}>
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '30px' }}>🧾 All Bookings</h3>
      <div className="tour-list">
        {bookings.map((b, i) => (
          <div className="tour-card" key={i}>
            <p><strong>Tour:</strong> {b.tourTitle}</p>
            <p><strong>Name:</strong> {b.name}</p>
            <p><strong>Email:</strong> {b.email}</p>
            <p><strong>Date:</strong> {b.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;

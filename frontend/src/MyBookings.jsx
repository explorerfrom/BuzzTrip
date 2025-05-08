import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../App.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(stored);
  }, []);

  return (
    <div className="app">
      <Link to="/">← Back to tours</Link>
      <h2>📘 My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b, index) => (
          <div key={index} className="tour-card">
            <h3>{b.tourTitle}</h3>
            <p><strong>Name:</strong> {b.name}</p>
            <p><strong>Email:</strong> {b.email}</p>
            <p><strong>Date:</strong> {b.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;


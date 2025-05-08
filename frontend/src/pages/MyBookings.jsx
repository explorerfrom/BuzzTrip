import { Link } from 'react-router-dom';
import '../App.css';

function MyBookings() {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  return (
    <div className="app">
      <Link to="/">← Back to homepage</Link>
      <h2>📘 My Bookings</h2>
      {bookings.length === 0 ? <p>You have no bookings yet.</p> : (
        <div className="tour-list">
          {bookings.map((b, i) => (
            <div className="tour-card" key={i}>
              <h4>{b.tourTitle}</h4>
              <p><strong>Name:</strong> {b.name}</p>
              <p><strong>Email:</strong> {b.email}</p>
              <p><strong>Date:</strong> {b.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;

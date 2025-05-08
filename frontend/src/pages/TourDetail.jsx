import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../App.css';

function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [booked, setBooked] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5050/api/tours')
      .then((res) => res.json())
      .then((data) => {
        const b2b = JSON.parse(localStorage.getItem('b2bTours') || '[]');
        const all = [...data, ...b2b];
        const found = all.find((t) => String(t.id) === id);
        setTour(found);
      });

    const stored = JSON.parse(localStorage.getItem(`reviews-${id}`) || '[]');
    setReviews(stored);
  }, [id]);

  const handleBooking = (e) => {
    e.preventDefault();
    const booking = {
      tourId: tour.id,
      tourTitle: tour.title,
      name,
      email,
      date: new Date().toLocaleString()
    };
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    existing.push(booking);
    localStorage.setItem('bookings', JSON.stringify(existing));
    setBooked(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      name: reviewerName,
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));
    setReviewerName('');
    setRating(5);
    setComment('');
  };

  if (!tour) return <p>Loading...</p>;

  return (
    <div className="app">
      <Link to="/">← Back to homepage</Link>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginTop: '20px'
      }}>
        <img src={tour.image} alt={tour.title} style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '10px'
        }} />
        <h2>{tour.title}</h2>
        <p><strong>Location:</strong> {tour.location}</p>
        <p><strong>Category:</strong> {tour.category}</p>
        <p><strong>Price:</strong> ${tour.price}</p>
        <p><strong>Duration:</strong> {tour.duration}</p>
        <p>{tour.description}</p>

        {tour.mapUrl && (
          <iframe
            src={tour.mapUrl}
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px', marginTop: '20px' }}
            loading="lazy"
            title="Map"
          ></iframe>
        )}

        {booked ? (
          <div style={{
            backgroundColor: '#dcfce7',
            padding: '15px',
            marginTop: '20px',
            borderRadius: '10px'
          }}>
            ✅ Booking confirmed! Thank you!
          </div>
        ) : (
          <form onSubmit={handleBooking} style={{ marginTop: '30px' }}>
            <h3>Book This Tour</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Confirm Booking</button>
          </form>
        )}

        <div style={{ marginTop: '40px' }}>
          <h3>⭐ Leave a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
            />
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
            <textarea
              placeholder="Your Review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>📝 Reviews</h3>
          {reviews.length === 0
            ? <p>No reviews yet.</p>
            : reviews.map((r, i) => (
              <div key={i} style={{
                background: '#fefce8',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                <p><strong>{r.name}</strong> — ⭐ {r.rating}</p>
                <p>{r.comment}</p>
                <p><em>{r.date}</em></p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TourDetail;

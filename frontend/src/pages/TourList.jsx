import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function TourList() {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('none');

  useEffect(() => {
    const fetchTours = async () => {
      const res = await fetch('http://localhost:5050/api/tours');
      const staticTours = await res.json();
      const b2bTours = JSON.parse(localStorage.getItem('b2bTours') || '[]');
      const all = [...staticTours, ...b2bTours];
      setTours(all);
    };
    fetchTours();
  }, []);

  const isLoggedIn = localStorage.getItem('b2bLoggedIn') === 'true';

  const getAverageRating = (id) => {
    const reviews = JSON.parse(localStorage.getItem(`reviews-${id}`) || '[]');
    if (!reviews.length) return null;
    return Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length);
  };

  const toggleFavorite = (tour) => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const exists = favs.some((t) => t.id === tour.id);
    const updated = exists ? favs.filter((t) => t.id !== tour.id) : [...favs, tour];
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (id) =>
    JSON.parse(localStorage.getItem('favorites') || '[]').some((t) => t.id === id);

  const filtered = tours
    .filter(t =>
      (filter === 'All' || t.category === filter) &&
      (t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase()))
    )
    .map(t => ({ ...t, avgRating: getAverageRating(t.id) || 0 }))
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.avgRating - a.avgRating;
      return 0;
    });

  return (
    <div className="app">
      {/* 🐝 Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #facc15 0%, #fef08a 100%)',
        padding: '40px 20px',
        borderRadius: '16px',
        marginBottom: '30px',
        textAlign: 'center',
      }}>
        <img src="/bee.png" alt="BuzzTrip" style={{ height: '60px', marginBottom: '10px' }} />
        <h1 style={{ fontSize: '2.8rem', margin: 0 }}>BuzzTrip</h1>
        <p style={{ fontSize: '1.2rem', color: '#444' }}>Unforgettable experiences, curated with care 🐝</p>
        <div style={{ marginTop: '15px' }}>
          <Link to="/bookings">📘 Bookings</Link> | <Link to="/favorites">💛 Favorites</Link> |{' '}
          <Link to="/map">🗺 Map</Link> | <Link to="/admin">🧑‍💼 Admin</Link> |{' '}
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">🏪 Dashboard</Link> |{' '}
              <a href="/" onClick={() => { localStorage.removeItem('b2bLoggedIn'); window.location.reload(); }}>
                🚪 Logout
              </a>
            </>
          ) : (
            <Link to="/login">🔐 Business Login</Link>
          )}
        </div>
      </section>

      {/* 🔍 Search + Filters */}
      <div style={{
        backgroundColor: '#fefce8',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />

        <div>
          <strong>Category:</strong>{' '}
          {['All', 'Nature', 'City', 'Adventure', 'Historical'].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} style={{ margin: '0 5px' }}>
              {cat}
            </button>
          ))}
        </div>

        <div>
          <strong>Sort by:</strong>{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '5px 10px' }}>
            <option value="none">None</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* 🧭 Tour Cards */}
      <div className="tour-list">
        {filtered.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <img src={tour.image} alt={tour.title} />
            <h3>{tour.title}</h3>
            <p><strong>Location:</strong> {tour.location}</p>
            <p><strong>Category:</strong> {tour.category || 'N/A'}</p>
            <p><strong>Price:</strong> ${tour.price}</p>
            <p><strong>Duration:</strong> {tour.duration}</p>
            <p>{tour.description}</p>
            {tour.avgRating > 0 && <p>⭐ {tour.avgRating} Stars</p>}
            <button onClick={() => toggleFavorite(tour)}>
              {isFavorite(tour.id) ? '💔 Remove Favorite' : '💛 Add to Favorites'}
            </button>
            <Link to={`/tour/${tour.id}`}>
              <button style={{ marginTop: '8px' }}>Book Now</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TourList;

import { Link } from 'react-router-dom';
import '../App.css';

function MyFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  return (
    <div className="app">
      <Link to="/">← Back to homepage</Link>
      <h2>💛 My Favorite Tours</h2>
      {favorites.length === 0 ? <p>No favorites yet.</p> : (
        <div className="tour-list">
          {favorites.map((tour) => (
            <div className="tour-card" key={tour.id}>
              <img src={tour.image} alt={tour.title} />
              <h3>{tour.title}</h3>
              <p><strong>Location:</strong> {tour.location}</p>
              <p><strong>Price:</strong> ${tour.price}</p>
              <p>{tour.description}</p>
              <Link to={`/tour/${tour.id}`}><button>Book Now</button></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFavorites;

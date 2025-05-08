// ✅ FILE: src/pages/BusinessDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function BusinessDashboard() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    duration: '',
    description: '',
    image: '',
    category: '',
    mapUrl: '',
    lat: '',
    lng: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('b2bLoggedIn');
    if (loggedIn !== 'true') {
      navigate('/login');
    } else {
      const stored = JSON.parse(localStorage.getItem('b2bTours') || '[]');
      setTours(stored);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedTours;

    if (editingId) {
      updatedTours = tours.map((tour) =>
        tour.id === editingId ? { ...form, id: editingId } : tour
      );
    } else {
      const newTour = { ...form, id: Date.now() };
      updatedTours = [...tours, newTour];
    }

    setTours(updatedTours);
    localStorage.setItem('b2bTours', JSON.stringify(updatedTours));
    setForm({
      title: '', location: '', price: '', duration: '', description: '', image: '',
      category: '', mapUrl: '', lat: '', lng: ''
    });
    setEditingId(null);
  };

  const handleEdit = (tour) => {
    setForm(tour);
    setEditingId(tour.id);
  };

  const handleDelete = (id) => {
    const filtered = tours.filter((tour) => tour.id !== id);
    setTours(filtered);
    localStorage.setItem('b2bTours', JSON.stringify(filtered));
  };

  const handleLogout = () => {
    localStorage.removeItem('b2bLoggedIn');
    navigate('/login');
  };

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">← Back to homepage</Link>
        <button onClick={handleLogout} style={{ backgroundColor: '#f87171' }}>🚪 Logout</button>
      </div>

      <h2>📋 Business Dashboard</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h3>{editingId ? '✏️ Edit Tour' : '➕ Add New Tour'}</h3>
        <input name="title" placeholder="Tour Title" value={form.title} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          <option value="Nature">Nature</option>
          <option value="City">City</option>
          <option value="Adventure">Adventure</option>
          <option value="Historical">Historical</option>
        </select>
        <input name="mapUrl" placeholder="Google Map Embed URL" value={form.mapUrl} onChange={handleChange} required />
        <input name="lat" placeholder="Latitude" value={form.lat} onChange={handleChange} required />
        <input name="lng" placeholder="Longitude" value={form.lng} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <button type="submit">{editingId ? '✅ Update Tour' : 'Add Tour'}</button>
      </form>

      <h3>📦 My Listed Tours</h3>
      <div className="tour-list">
        {tours.length === 0 && <p>No tours added yet.</p>}
        {tours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <img src={tour.image} alt={tour.title} />
            <h4>{tour.title}</h4>
            <p><strong>Location:</strong> {tour.location}</p>
            <p><strong>Category:</strong> {tour.category}</p>
            <p><strong>Price:</strong> ${tour.price}</p>
            <p><strong>Duration:</strong> {tour.duration}</p>
            <p>{tour.description}</p>
            <button onClick={() => handleEdit(tour)}>✏️ Edit</button>
            <button onClick={() => handleDelete(tour.id)} style={{ backgroundColor: '#fecaca', marginTop: '5px' }}>
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessDashboard;
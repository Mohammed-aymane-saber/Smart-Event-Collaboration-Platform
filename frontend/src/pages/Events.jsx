import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { title, description, event_date: eventDate });
      setShowCreate(false);
      setTitle('');
      setDescription('');
      setEventDate('');
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Upcoming Events</h1>
          <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Cancel' : '+ New Event'}
          </button>
        </div>

        {showCreate && (
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Event</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <input type="text" placeholder="Event Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>
              <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ marginBottom: '16px' }} />
              <button type="submit" className="btn-primary">Create</button>
            </form>
          </div>
        )}

        <div className="events-grid">
          {events.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No events active. Be the first to create one!</p>}
          {events.map((ev) => (
            <div key={ev.id} className="glass-panel event-card">
              <h3>{ev.title}</h3>
              <div className="event-date">{new Date(ev.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <p className="event-desc">{ev.description}</p>
              <div style={{ marginTop: 'auto' }}>
                <Link to={`/events/${ev.id}`} className="btn-outline" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

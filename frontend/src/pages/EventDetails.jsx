import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { Users, MessageSquare } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [joinMsg, setJoinMsg] = useState('');

  const fetchData = async () => {
    try {
      const eventRes = await api.get(`/events/${id}`);
      setEventData(eventRes.data.event);
      setParticipants(eventRes.data.participants || []);

      const commentsRes = await api.get(`/events/${id}/comments`);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, navigate]);

  const handleJoin = async () => {
    try {
      await api.post(`/events/${id}/join`);
      setJoinMsg('Successfully joined!');
      fetchData();
    } catch (err) {
      setJoinMsg(err.response?.data?.message || 'Error joining event');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/events/${id}/comments`, { text: newComment });
      setNewComment('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!eventData) return <div style={{ color: 'white', padding: 40 }}>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="page-container animate-fade-in">
        <div className="detail-header">
          <div className="event-date" style={{ fontSize: '1.2rem', marginBottom: 12 }}>
            {new Date(eventData.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1>{eventData.title}</h1>
          <p className="event-desc" style={{ fontSize: '1.2rem', maxWidth: '800px', marginTop: 20 }}>
            {eventData.description}
          </p>
          
          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 20 }}>
            <button className="btn-primary" onClick={handleJoin}>Join Event</button>
            {joinMsg && <span style={{ color: 'var(--primary)' }}>{joinMsg}</span>}
          </div>
        </div>

        <div className="participants-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Users size={24} color="var(--primary)" /> 
            Participants ({participants.length})
          </h2>
          <div className="participants-list">
            {participants.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No participants yet.</span>}
            {participants.map(p => (
              <span key={p.id} className="participant-badge">{p.username}</span>
            ))}
          </div>
        </div>

        <div className="comments-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MessageSquare size={24} color="var(--secondary)" /> 
            Comments
          </h2>
          
          <div style={{ maxWidth: '800px' }}>
            {comments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No comments yet.</p>}
            {comments.map(c => (
              <div key={c.id} className="glass-panel comment-card">
                <div className="comment-header">
                  <span className="comment-author">{c.username}</span>
                  <span className="comment-date">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}

            <form className="add-comment-form" onSubmit={handleAddComment}>
              <textarea 
                placeholder="Share your thoughts..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
              />
              <button type="submit" className="btn-primary">Post Comment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

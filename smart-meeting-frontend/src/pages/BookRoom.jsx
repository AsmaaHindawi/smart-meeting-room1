// src/pages/BookRoom.jsx
import { useState, useEffect } from 'react';
import { listRooms } from '../services/roomService';
import { createBooking } from '../services/bookingService';

export default function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    room_id: '',
    start_time: '',
    duration: '',
    attendees: ''  // could be a comma-separated string or array
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    listRooms()
      .then(res => setRooms(res.data))
      .catch(() => setStatus(s => ({ ...s, error: 'Couldn’t load rooms.' })));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      await createBooking({
        room_id: form.room_id,
        start_time: form.start_time,
        duration: form.duration,
        attendees: form.attendees.split(',').map(a => a.trim())
      });
      setStatus({ loading: false, error: null, success: 'Booked successfully!' });
      setForm({ room_id: '', start_time: '', duration: '', attendees: '' });
    } catch {
      setStatus({ loading: false, error: 'Booking failed.', success: null });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Book a Room</h2>
      {status.error && <div className="text-red-600 mb-2">{status.error}</div>}
      {status.success && <div className="text-green-600 mb-2">{status.success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="room_id"
          value={form.room_id}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        >
          <option value="">Select a room</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>
              {r.location} (Cap: {r.capacity})
            </option>
          ))}
        </select>

        <label>
          Date &amp; Time
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </label>

        <label>
          Duration (minutes)
          <input
            type="number"
            name="duration"
            min="1"
            value={form.duration}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </label>

        <label>
          Attendees (emails comma-separated)
          <input
            type="text"
            name="attendees"
            value={form.attendees}
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </label>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full p-2 bg-aqua rounded"
        >
          {status.loading ? 'Booking…' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}

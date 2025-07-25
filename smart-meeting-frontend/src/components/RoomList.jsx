// src/components/RoomList.jsx
import { useEffect, useState } from 'react';
import { listRooms } from '../services/roomService';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await listRooms();
        setRooms(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) return <div>Loading rooms…</div>;
  if (error)   return <div className="text-red-600">{error}</div>;
  if (rooms.length === 0) return <div>No rooms available.</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {rooms.map(room => (
        <div key={room.id} className="p-4 border rounded">
          <h3 className="font-bold">{room.location}</h3>
          <p>Capacity: {room.capacity}</p>
          <p>Features: {room.features || 'None'}</p>
        </div>
      ))}
    </div>
  );
}

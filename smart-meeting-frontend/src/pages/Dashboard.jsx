// C:\Users\Youssef Hindawi\smart-meeting-room1\smart-meeting-frontend\src\pages\Dashboard.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import RoomList from '../components/RoomList';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Welcome, {user.username}!</h1>

      {/* Quick Actions */}
      <div className="mb-8 space-x-4">
        <Link
          to="/book"
          className="inline-block px-4 py-2 bg-aqua rounded hover:bg-[#7d64fb] text-white font-medium"
        >
          Schedule Meeting
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-xl mb-2">Available Rooms</h2>
        <RoomList />
      </section>

      {/* …other widgets… */}
    </div>
  );
}

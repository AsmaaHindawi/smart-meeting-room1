export const UpcomingMeetings = () => (
  <section className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Upcoming Meetings</h2>
    <ul className="space-y-3">
      <li className="flex justify-between items-center border-b pb-2">
        <span>Team Sync - Room A</span>
        <span className="text-sm text-gray-500">10:00 AM</span>
      </li>
      <li className="flex justify-between items-center border-b pb-2">
        <span>Design Review - Room B</span>
        <span className="text-sm text-gray-500">2:00 PM</span>
      </li>
    </ul>
  </section>
);
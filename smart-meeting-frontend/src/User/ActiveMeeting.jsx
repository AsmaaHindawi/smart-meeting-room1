export const ActiveMeeting = () => (
  <section className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Active Meeting</h2>
    <div className="space-y-2">
      <div className="font-semibold">Title: Weekly Sync</div>
      <div>Time: 10:00 AM - 11:00 AM</div>
      <div>Attendees: Alice, Bob, Charlie</div>
      <div className="flex gap-4 mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">Start</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">End</button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Take Notes</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Share Screen</button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded">Invite</button>
      </div>
    </div>
  </section>
);
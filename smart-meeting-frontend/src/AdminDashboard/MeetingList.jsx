const MeetingList = ({ title, meetings }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-indigo-700">{title}</h3>
      <ul className="space-y-2">
        {meetings.map((meeting, index) => (
          <li key={index} className="flex justify-between text-sm border-b pb-1">
            <span>{meeting.time} - {meeting.title}</span>
            <span className="text-gray-500">{meeting.room}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingList;

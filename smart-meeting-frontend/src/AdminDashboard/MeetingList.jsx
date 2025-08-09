// Example: MeetingList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MeetingList() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/meetings") // your API endpoint
      .then(res => {
        setMeetings(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Meetings</h2>
      {meetings.map(meeting => (
        <div key={meeting.id} className="meeting-card">
          <h3>{meeting.title}</h3>
          <p>Room: {meeting.room?.name || "No Room Assigned"}</p>

          <h4>Attendees:</h4>
          <ul>
            {meeting.attendees.map(attendee => (
              <li key={attendee.id}>
                {attendee.user
                  ? (attendee.user.username || attendee.user.email)
                  : "No user assigned"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

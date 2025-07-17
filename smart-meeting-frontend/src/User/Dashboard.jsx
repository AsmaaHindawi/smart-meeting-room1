import  QuickActions  from "./QuickActions";

import { UpcomingMeetings } from "./UpcomingMeetings";
import Topbar from "./Topbar";
import { FaCalendarAlt, FaFileAlt, FaVideo } from "react-icons/fa";
import RoomCalendar from "./RoomCalendar";
import NotificationPanel from "./NotificationPanel";

export default function Dashboard() {
  return (
     <div className="flex flex-col h-full bg-gray-50">
  <Topbar />
     <main className="p-6 space-y-6 overflow-auto flex-1">
        <QuickActions
        actions={[
          { label: "Schedule Meeting", icon: <FaCalendarAlt />, to: "/user/book" },
          { label: "View Minutes", icon: <FaFileAlt />, to: "/user/minutes" },
        ]}
      />
      <UpcomingMeetings
        title="Upcoming Meetings"
        meetings={[
          { time: "11:00 AM", title: "Team Check-in", room: "Room A" },
          { time: "3:00 PM", title: "Client Call", room: "Room C" },
        ]}
      />
       <div className="grid md:grid-cols-2 gap-2">
          <RoomCalendar />
          <NotificationPanel
            notifications={[
              { type: "info", message: "Room C is under maintenance" },
              { type: "reminder", message: "Meeting with HR at 3 PM" },
            ]}
          />
        </div>
     </main>
    </div>
  );
}


import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const typeStyles = {
  info: {
    icon: <FaInfoCircle className="text-blue-500" />,
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  success: {
    icon: <FaCheckCircle className="text-green-500" />,
    bg: "bg-green-50",
    text: "text-green-700",
  },
  warning: {
    icon: <FaExclamationTriangle className="text-yellow-500" />,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
  default: {
    icon: <FaInfoCircle className="text-gray-400" />,
    bg: "bg-gray-50",
    text: "text-gray-700",
  },
};

const NotificationPanel = ({ notifications = [] }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full w-full">
      <h3 className="text-xl font-semibold text-[#2c2e5f] mb-4">Notifications</h3>

      {notifications.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No new notifications</div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((note, index) => {
            const style = typeStyles[note.type] || typeStyles.default;

            return (
              <li
                key={index}
                className={`flex items-start gap-3 p-3 rounded-xl ${style.bg} ${style.text} shadow-sm`}
              >
                <div className="pt-1">{style.icon}</div>
                <div className="text-sm leading-relaxed">{note.message}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;

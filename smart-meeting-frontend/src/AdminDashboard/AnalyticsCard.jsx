const AnalyticsCard = ({ title, chartData }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-indigo-700 mb-4">{title}</h3>
      <ul className="text-sm space-y-1">
        {chartData.labels.map((label, index) => (
          <li key={index} className="flex justify-between">
            <span>{label}</span>
            <span className="text-gray-600">{chartData.usage[index]}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsCard;

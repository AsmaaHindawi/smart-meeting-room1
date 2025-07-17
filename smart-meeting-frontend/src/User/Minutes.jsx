export default function Minutes() {
  const minutes = [
    {
      id: 1,
      date: "2025-06-30",
      title: "Marketing Sync",
      actionItems: ["Update ad copy", "Send proposal"],
    },
    {
      id: 2,
      date: "2025-06-25",
      title: "Product Roadmap",
      actionItems: ["Define Q3 goals"],
    },
  ];

  return (
    <div className="p-6 bg-gray-50 font-poppins min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Meeting Minutes</h2>
      <div className="space-y-4">
        {minutes.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{m.title} – {m.date}</h3>
            <ul className="list-disc pl-5 text-sm mt-2 text-gray-600">
              {m.actionItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

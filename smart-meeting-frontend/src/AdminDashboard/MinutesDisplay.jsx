import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";

export default function MinutesDisplay({ meetingId, onBack }) {
  const [minutes, setMinutes] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef();

  useEffect(() => {
    if (!meetingId) return;

    setLoading(true);
    setError("");

    // Fetch minutes
    
fetch(`http://localhost:8000/api/minutes/${minutesId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch minutes");
        return res.json();
      })
      .then((data) => {
        setMinutes(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    // Fetch attendees
    fetch(`http://localhost:8000/api/attendees/meeting/${meetingId}`)
      .then((res) => res.json())
      .then((data) => {
        setAttendees(data.map((a) => a.user.name));
      })
      .catch(() => {
        // silently ignore attendee fetch errors or set error if you want
      });
  }, [meetingId]);

  const exportPDF = () => {
    if (!minutes) return;

    const doc = new jsPDF();

    let y = 10;
    doc.setFontSize(18);
    doc.text("Minutes of Meeting", 14, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Meeting ID: ${meetingId}`, 14, y);
    y += 10;

    doc.setFontSize(16);
    doc.text("Agenda Items:", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(minutes.action_items || "No agenda", 180), 14, y);
    y += 20;

    doc.setFontSize(16);
    doc.text("Decisions & Discussions:", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(minutes.decisions || "No decisions", 180), 14, y);
    y += 20;

    doc.setFontSize(16);
    doc.text("Attendees:", 14, y);
    y += 10;

    doc.setFontSize(12);
    attendees.forEach((name) => {
      doc.text(`- ${name}`, 14, y);
      y += 8;
    });

    doc.save(`Minutes_Meeting_${meetingId}.pdf`);
  };

  if (loading) return <p>Loading minutes...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!minutes) return <p>No minutes found for this meeting.</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <button
        onClick={onBack}
        className="mb-6 text-indigo-600 underline"
      >
        ← Back to meetings
      </button>

      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Minutes of Meeting</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Agenda Items</h2>
        <p className="whitespace-pre-wrap border p-4 rounded bg-gray-50">{minutes.action_items || "No agenda items."}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Decisions & Discussions</h2>
        <p className="whitespace-pre-wrap border p-4 rounded bg-gray-50">{minutes.decisions || "No decisions."}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Attendees</h2>
        <ul className="list-disc list-inside">
          {attendees.length > 0 ? (
            attendees.map((name) => <li key={name}>{name}</li>)
          ) : (
            <li>No attendees found.</li>
          )}
        </ul>
      </section>

      <button
        onClick={exportPDF}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        Export as PDF
      </button>
    </div>
  );
}

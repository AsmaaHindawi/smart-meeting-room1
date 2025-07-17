import { useRef, useState } from "react";
import jsPDF from "jspdf";
import Select from "react-select";

const users = [
  { value: "sarah@example.com", label: "Sarah" },
  { value: "mark@example.com", label: "Mark" },
  { value: "lina@example.com", label: "Lina" },
  { value: "john@example.com", label: "John" },
  { value: "admin@example.com", label: "Admin" },
];

export const MinutesEditor = () => {
  const agendaRef = useRef();
  const decisionsRef = useRef();
  const fileRef = useRef();

  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const agenda = agendaRef.current.value;
    const decisions = decisionsRef.current.value;

    if (!agenda || !decisions || selectedAttendees.length === 0) {
      setError("⚠️ Please complete all required fields.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSaveDraft = () => {
    if (!validate()) return;

    const agenda = agendaRef.current.value;
    const decisions = decisionsRef.current.value;

    console.log("📥 Draft saved:", {
      agenda,
      decisions,
      attendees: selectedAttendees.map((a) => a.value),
    });

    setStatus("✅ Draft saved!");
  };

  const handleFinalizeAndExport = () => {
    if (!validate()) return;

    const agenda = agendaRef.current.value;
    const decisions = decisionsRef.current.value;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Minutes of Meeting", 10, 20);

    doc.setFontSize(12);
    doc.text("Agenda Items:", 10, 30);
    doc.text(agenda, 10, 40);

    doc.text("Discussion & Decisions:", 10, 70);
    doc.text(decisions, 10, 80);

    doc.text("Attendees:", 10, 110);
    selectedAttendees.forEach((attendee, index) => {
      doc.text(`- ${attendee.label} (${attendee.value})`, 10, 120 + index * 10);
    });

    doc.save("MinutesOfMeeting.pdf");
    setStatus("📄 PDF downloaded successfully!");
  };

  const handleSend = () => {
    if (!validate()) return;

    const agenda = agendaRef.current.value;
    const decisions = decisionsRef.current.value;

    const payload = {
      agenda,
      decisions,
      attendees: selectedAttendees.map((a) => a.value),
      attachment: fileRef.current?.files[0]?.name || null,
    };

    // Simulated "sending" action
    console.log("📨 Sending Minutes:", payload);
    setStatus("📬 Minutes sent to attendees!");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-full">
    
        <div className="px-7 py-7 ">
          <h1 className="text-2xl font-bold text-indigo-700 border-b pb-4">Minutes of Meeting</h1>
        </div>

    
        <div className="flex-grow px-7 py-5 space-y-6 overflow-y-auto">
    
          <div>
            <label className="block text-[#2c2e5f] font-semibold mb-1">Agenda Items</label>
            <textarea
              ref={agendaRef}
              rows={6}
              placeholder="e.g., Budget Planning, Q3 Progress, Team Feedback..."
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d65fb] text-[#2c2e5f]"
            />
          </div>

          <div>
            <label className="block text-[#2c2e5f] font-semibold mb-1">Discussion & Decisions</label>
            <textarea
              ref={decisionsRef}
              rows={8}
              placeholder="Summarize discussion points, decisions made, and next steps..."
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c7e0] text-[#2c2e5f]"
            />
          </div>
          <div>
            <label className="block text-[#2c2e5f] font-semibold mb-1">Select Attendees</label>
            <Select
              isMulti
              options={users}
              value={selectedAttendees}
              onChange={setSelectedAttendees}
              placeholder="Choose attendees..."
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.75rem",
                  padding: "2px 4px",
                  borderColor: "#ccc",
                  boxShadow: "none",
                }),
                multiValue: (styles) => ({
                  ...styles,
                  backgroundColor: "#7d65fb",
                  color: "white",
                }),
                multiValueLabel: (styles) => ({
                  ...styles,
                  color: "white",
                }),
                multiValueRemove: (styles) => ({
                  ...styles,
                  color: "white",
                  ':hover': {
                    backgroundColor: "#ff7954",
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-[#2c2e5f] font-semibold mb-1">Attachments (optional)</label>
            <input
              ref={fileRef}
              type="file"
              className="w-full border rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#7d65fb] file:text-white hover:file:bg-[#6b59e0]"
            />
          </div>

      
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

   
        <div className="flex justify-between items-center bg-gray-50 px-8 py-4 border-t">
          <p className="text-sm text-[#2c2e5f]">{status}</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSaveDraft}
              className="bg-[#ff7954] text-white px-5 py-2 rounded-xl hover:bg-[#e26542] transition"
            >
              Save 
            </button>
            <button
              onClick={handleFinalizeAndExport}
              className="bg-[#7d65fb] text-white px-5 py-2 rounded-xl hover:bg-[#6b59e0] transition"
            >
              Finalize & Export PDF
            </button>
            <button
              onClick={handleSend}
              className="bg-[#65c7e0] text-white px-5 py-2 rounded-xl hover:bg-[#4db0c9] transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

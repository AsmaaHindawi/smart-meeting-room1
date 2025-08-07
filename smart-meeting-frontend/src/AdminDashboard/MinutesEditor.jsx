import { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import Select from "react-select";

const users = [
  { value: "sarah@example.com", label: "Sarah" },
  { value: "mark@example.com", label: "Mark" },
  { value: "lina@example.com", label: "Lina" },
  { value: "john@example.com", label: "John" },
  { value: "admin@example.com", label: "Admin" },
];

export const MinutesEditor = ({ meetingId, onClose }) => {
  const agendaRef = useRef();
  const decisionsRef = useRef();
  const fileRef = useRef();

  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing minutes for editing if meetingId is provided
  useEffect(() => {
    if (!meetingId) return;

    setLoading(true);
    fetch(`http://localhost:8000/api/minutesofmeeting/${meetingId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meeting minutes");
        return res.json();
      })
      .then((data) => {
        agendaRef.current.value = data.action_items || "";
        decisionsRef.current.value = data.decisions || "";
        // TODO: You might want to parse and set attendees if stored on backend
        // For now, clear attendees:
        setSelectedAttendees([]);
        setStatus("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [meetingId]);

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

  // Create or update minutes on server
  const saveMinutes = async () => {
    if (!validate()) return;

    setLoading(true);
    const agenda = agendaRef.current.value;
    const decisions = decisionsRef.current.value;

    const payload = {
      action_items: agenda,
      decisions: decisions,
      // Consider sending attendees as JSON string or array if your API supports
      // attendees: selectedAttendees.map(a => a.value),
      file_url: null, // handle file upload separately if needed
    };

    try {
      const res = await fetch(
        meetingId
          ? `http://localhost:8000/api/minutesofmeeting/${meetingId}`
          : "http://localhost:8000/api/minutesofmeeting",
        {
          method: meetingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Failed to ${meetingId ? "update" : "save"} minutes`);

      const data = await res.json();
      setStatus(`✅ Minutes ${meetingId ? "updated" : "saved"} successfully!`);

      // Optionally clear or close editor here:
      // onClose?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete minutes
  const deleteMinutes = async () => {
    if (!meetingId) {
      setError("No meeting selected to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete these minutes?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/minutesofmeeting/${meetingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete minutes");

      setStatus("🗑️ Minutes deleted successfully!");
      // Clear fields and close editor if desired
      agendaRef.current.value = "";
      decisionsRef.current.value = "";
      setSelectedAttendees([]);
      onClose?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Your existing functions for export PDF, send, etc.
  // ...

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-full">
        <div className="px-7 py-7 ">
          <h1 className="text-2xl font-bold text-indigo-700 border-b pb-4">
            Minutes of Meeting
          </h1>
        </div>

        <div className="flex-grow px-7 py-5 space-y-6 overflow-y-auto">
          {loading && <p>Loading...</p>}

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
              onClick={saveMinutes}
              className="bg-[#7d65fb] text-white px-5 py-2 rounded-xl hover:bg-[#6b59e0] transition"
              disabled={loading}
            >
              {meetingId ? "Update" : "Save"}
            </button>
            {meetingId && (
              <button
                onClick={deleteMinutes}
                className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition"
                disabled={loading}
              >
                Delete
              </button>
            )}
            {/* Keep your other buttons here for export PDF, send, etc */}
          </div>
        </div>
      </div>
    </div>
  );
};

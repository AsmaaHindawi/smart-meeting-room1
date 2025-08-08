import { useRef, useState, useEffect } from "react";
import Select from "react-select";

export const MinutesEditor = ({ onClose }) => {
  const agendaRef = useRef();
  const decisionsRef = useRef();

  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [minutesId, setMinutesId] = useState(null);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all meetings on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/meetings")
      .then((res) => res.json())
      .then(setMeetings)
      .catch(() => setError("Failed to load meetings"));
  }, []);

  // When selectedMeeting changes:
  // 1. Load attendees from attendees API
  // 2. Load minutes if exists
  useEffect(() => {
    if (!selectedMeeting) {
      setSelectedAttendees([]);
      agendaRef.current.value = "";
      decisionsRef.current.value = "";
      setMinutesId(null);
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    // Fetch attendees for meeting
    fetch(`http://localhost:8000/api/attendees/meeting/${selectedMeeting.value}`)
      .then((res) => res.json())
      .then((attendeesData) => {
        const options = attendeesData.map((att) => ({
          value: att.user.email,
          label: att.user.name,
        }));
        setSelectedAttendees(options);
      })
      .catch(() => setError("Failed to load attendees"))
      .finally(() => setLoading(false));

    // Fetch existing minutes for meeting
    setLoading(true);
    fetch(`http://localhost:8000/api/minutes/${selectedMeeting.value}`)
      .then((res) => {
        if (!res.ok) throw new Error("No minutes found for this meeting");
        return res.json();
      })
      .then((minutes) => {
        agendaRef.current.value = minutes.action_items || "";
        decisionsRef.current.value = minutes.decisions || "";
        setMinutesId(minutes.id); // store minutes ID for update/delete
      })
      .catch(() => {
        // No minutes yet for this meeting
        agendaRef.current.value = "";
        decisionsRef.current.value = "";
        setMinutesId(null);
      })
      .finally(() => setLoading(false));
  }, [selectedMeeting]);

  const validate = () => {
    if (!selectedMeeting) {
      setError("Please select a meeting.");
      return false;
    }
    if (!agendaRef.current.value.trim()) {
      setError("Agenda is required.");
      return false;
    }
    if (!decisionsRef.current.value.trim()) {
      setError("Decisions are required.");
      return false;
    }
    if (selectedAttendees.length === 0) {
      setError("Please select at least one attendee.");
      return false;
    }
    setError("");
    return true;
  };

  const saveMinutes = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");
    setStatus("");

    const payload = {
      meeting_id: selectedMeeting.value,
      action_items: agendaRef.current.value,
      decisions: decisionsRef.current.value,
      attendees: selectedAttendees.map((a) => a.value), // emails
      file_url: null,
    };

    try {
      const url = minutesId
        ? `http://localhost:8000/api/minutes/${minutesId}`
        : "http://localhost:8000/api/minutes";

      const method = minutesId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to save minutes: ${text}`);
      }

      const data = await res.json();
      setMinutesId(data.id);
      setStatus(`✅ Minutes ${minutesId ? "updated" : "saved"} successfully!`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMinutes = async () => {
    if (!minutesId) {
      setError("No minutes to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete these minutes?")) return;

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const res = await fetch(`http://localhost:8000/api/minutes/${minutesId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete minutes");

      setStatus("🗑️ Minutes deleted successfully!");
      setMinutesId(null);
      agendaRef.current.value = "";
      decisionsRef.current.value = "";
      setSelectedAttendees([]);
      setSelectedMeeting(null);
      onClose?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex justify-center items-start py-8">
      <div className="max-w-5xl bg-white rounded-3xl shadow-lg p-8 w-full">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-4">
          Minutes of Meeting
        </h1>

        <div className="mb-6">
          <label className="block text-[#2c2e5f] font-semibold mb-2">Select Meeting</label>
          <Select
            options={meetings.map((m) => ({
              value: m.id,
              label: m.name || `Meeting #${m.id}`,
            }))}
            value={
              selectedMeeting
                ? { value: selectedMeeting.value, label: selectedMeeting.label }
                : null
            }
            onChange={setSelectedMeeting}
            placeholder="Choose a meeting..."
            isClearable
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#2c2e5f] font-semibold mb-2">Select Attendees</label>
          <Select
            isMulti
            options={selectedMeeting?.attendees || selectedAttendees}
            value={selectedAttendees}
            onChange={setSelectedAttendees}
            placeholder="Select attendees..."
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
            isDisabled={!selectedMeeting}
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#2c2e5f] font-semibold mb-2">Agenda Items</label>
          <textarea
            ref={agendaRef}
            rows={5}
            placeholder="Enter agenda items..."
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d65fb] text-[#2c2e5f]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#2c2e5f] font-semibold mb-2">Discussion & Decisions</label>
          <textarea
            ref={decisionsRef}
            rows={7}
            placeholder="Enter discussion points and decisions..."
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c7e0] text-[#2c2e5f]"
          />
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {status && <p className="text-green-600 mb-4">{status}</p>}
        {loading && <p>Loading...</p>}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={saveMinutes}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl"
            disabled={loading || !selectedMeeting}
          >
            {minutesId ? "Update Minutes" : "Save Minutes"}
          </button>

          {minutesId && (
            <button
              onClick={deleteMinutes}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
              disabled={loading}
            >
              Delete Minutes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import { FaTrash, FaEdit, FaEye, FaChevronDown, FaChevronUp } from "react-icons/fa";

export const MinutesEditor = () => {
  const agendaRef = useRef();
  const decisionsRef = useRef();

  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [minutesId, setMinutesId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [allMinutes, setAllMinutes] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // For delete confirmation modal
  const [deleteConfirmMinutesId, setDeleteConfirmMinutesId] = useState(null);

  // Fetch all meetings
  useEffect(() => {
    fetch("http://localhost:8000/api/meetings")
      .then((res) => res.json())
      .then((data) =>
        setMeetings(
          data.map((m) => ({
            value: m.id,
            label: m.title || m.name || `Meeting #${m.id}`,
          }))
        )
      )
      .catch(() => setError("Failed to load meetings"));
  }, []);

  // Fetch all minutes
  const loadAllMinutes = () => {
    fetch("http://localhost:8000/api/minutes")
      .then((res) => res.json())
      .then(setAllMinutes)
      .catch(() => setError("Failed to load minutes"));
  };
  useEffect(() => {
    loadAllMinutes();
  }, []);

  // Fetch attendees and minutes when a meeting is selected,
  // but only if not editing existing minutes (minutesId is null)
  useEffect(() => {
    if (!selectedMeeting) {
      clearForm();
      return;
    }

    if (minutesId) {
      // We already have minutes loaded (editing), skip fetch to avoid overwriting inputs
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    fetch(`http://localhost:8000/api/attendees/meeting/${selectedMeeting.value}`)
      .then((res) => res.json())
      .then((attendees) => {
        setSelectedAttendees(
          attendees.map((a) => ({
            value: a.user.email,
            label: a.user.username || a.user.email,
          }))
        );
      })
      .catch(() => setError("Failed to load attendees"));

    fetch(`http://localhost:8000/api/minutes/meeting/${selectedMeeting.value}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((minutes) => {
        if (minutes) {
          setMinutesId(minutes.id);
          if (agendaRef.current) agendaRef.current.value = minutes.action_items || "";
          if (decisionsRef.current) decisionsRef.current.value = minutes.decisions || "";
        } else {
          if (agendaRef.current) agendaRef.current.value = "";
          if (decisionsRef.current) decisionsRef.current.value = "";
          setMinutesId(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedMeeting]);

  const validate = () => {
    if (
      !selectedMeeting ||
      !agendaRef.current.value.trim() ||
      !decisionsRef.current.value.trim() ||
      selectedAttendees.length === 0
    ) {
      setError("All fields are required.");
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
      attendees: selectedAttendees.map((a) => a.value),
      file_url: null,
    };

    try {
      const url = minutesId
        ? `http://localhost:8000/api/minutes/${minutesId}`
        : "http://localhost:8000/api/minutes";

      const res = await fetch(url, {
        method: minutesId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();
      setStatus(`Minutes ${minutesId ? "updated" : "saved"} successfully`);
      loadAllMinutes();
      clearForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const editFromTable = (minutes) => {
    const meetingObj = meetings.find((m) => m.value === minutes.meeting_id);
    setSelectedMeeting(meetingObj || null);

    if (minutes.attendees) {
      setSelectedAttendees(
        minutes.attendees.map((a) => ({
          value: a.user.email,
          label: a.user.username || a.user.email,
        }))
      );
    } else {
      setSelectedAttendees([]);
    }

    if (agendaRef.current) agendaRef.current.value = minutes.action_items || "";
    if (decisionsRef.current) decisionsRef.current.value = minutes.decisions || "";

    setMinutesId(minutes.id);
  };

  const viewFromTable = (minutes) => {
    alert(`Agenda:\n${minutes.action_items}\n\nDecisions:\n${minutes.decisions}`);
  };

  const clearForm = () => {
    setSelectedMeeting(null);
    setSelectedAttendees([]);
    if (agendaRef.current) agendaRef.current.value = "";
    if (decisionsRef.current) decisionsRef.current.value = "";
    setMinutesId(null);
    setError("");
    setStatus("");
  };

  // Delete modal handlers
  const cancelDelete = () => setDeleteConfirmMinutesId(null);

  const proceedDelete = () => {
    if (!deleteConfirmMinutesId) return;

    fetch(`http://localhost:8000/api/minutes/${deleteConfirmMinutesId}`, {
      method: "DELETE",
    }).then(() => {
      if (minutesId === deleteConfirmMinutesId) {
        clearForm();
      }
      setDeleteConfirmMinutesId(null);
      loadAllMinutes();
    });
  };

  const deleteFromTable = (minutes) => {
    setDeleteConfirmMinutesId(minutes.id);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const truncate = (text, maxLength = 60) =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-8 rounded-3xl shadow-md mb-10">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 border-b pb-2">
          Minutes of Meeting
        </h2>

        {/* Meeting Selection */}
        <div className="mb-5">
          <label className="font-semibold text-gray-700 mb-2 block">Select Meeting</label>
          <Select
            options={meetings}
            value={selectedMeeting}
            onChange={(val) => {
              setMinutesId(null); // Reset minutesId when user picks a new meeting manually
              setSelectedMeeting(val);
            }}
            placeholder="Choose a meeting..."
            isClearable
          />
        </div>

        {/* Attendees */}
        <div className="mb-5">
          <label className="font-semibold text-gray-700 mb-2 block">Attendees</label>
          <Select
            isMulti
            options={selectedAttendees}
            value={selectedAttendees}
            onChange={setSelectedAttendees}
            isDisabled={!selectedMeeting}
            placeholder="Select attendees"
          />
        </div>

        {/* Agenda */}
        <div className="mb-5">
          <label className="font-semibold text-gray-700 mb-2 block">Agenda</label>
          <textarea
            ref={agendaRef}
            rows={4}
            placeholder="Enter agenda items..."
            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Decisions */}
        <div className="mb-5">
          <label className="font-semibold text-gray-700 mb-2 block">Decisions</label>
          <textarea
            ref={decisionsRef}
            rows={4}
            placeholder="Enter decisions..."
            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Messages */}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {status && <p className="text-green-600 mb-2">{status}</p>}

        <div className="flex items-center">
          <button
            onClick={saveMinutes}
            disabled={loading || !selectedMeeting}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            {minutesId ? "Update" : "Save"} Minutes
          </button>

          <button
            type="button"
            onClick={clearForm}
            disabled={loading}
            className="ml-4 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Minutes Table */}
      <div className="w-full max-w-6xl bg-white p-6 rounded-3xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Minutes</h3>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border rounded-xl">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left p-3">Meeting</th>
                <th className="text-left p-3 max-w-xs">Agenda</th>
                <th className="text-left p-3 max-w-xs">Decisions</th>
                <th className="text-left p-3 w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allMinutes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No minutes available.
                  </td>
                </tr>
              ) : (
                allMinutes.map((m, index) => {
                  const meeting = meetings.find((meet) => meet.value === m.meeting_id);
                  const isExpanded = expandedRows.has(m.id);
                  const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";

                  return (
                    <React.Fragment key={m.id}>
                      <tr
                        className={`hover:bg-indigo-50 cursor-pointer ${rowBg}`}
                        onClick={() => toggleRow(m.id)}
                      >
                        <td className="p-3 align-top">{meeting?.label || `Meeting #${m.meeting_id}`}</td>
                        <td className="p-3 max-w-xs truncate align-top" title={m.action_items}>
                          {truncate(m.action_items, 80)}
                        </td>
                        <td className="p-3 max-w-xs truncate align-top" title={m.decisions}>
                          {truncate(m.decisions, 80)}
                        </td>
                        <td className="p-3 flex items-center space-x-3 justify-start">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editFromTable(m);
                            }}
                            title="Edit"
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Edit minutes"
                          >
                            <FaEdit />
                          </button>
                        
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFromTable(m);
                            }}
                            title="Delete"
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete minutes"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(m.id);
                            }}
                            title={isExpanded ? "Collapse" : "Expand"}
                            className="text-gray-600 hover:text-black"
                            aria-label={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-indigo-50">
                          <td colSpan="4" className="p-4 text-sm text-gray-700 whitespace-pre-wrap">
                            <strong>Full Agenda:</strong> {m.action_items || "None"}
                            <br />
                            <strong>Decisions:</strong> {m.decisions || "None"}
                            <br />
                            <strong>Attendees:</strong>{" "}
                            {m.attendees?.length
                              ? m.attendees.map((a) => a.user?.username || a.user?.email).join(", ")
                              : "No attendees"}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmMinutesId !== null && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this minutes entry?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={proceedDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

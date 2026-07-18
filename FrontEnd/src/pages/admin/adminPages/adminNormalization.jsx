import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "../../../lib/axiosInstance";

const AdminNormalization = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Create modal state ───────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [selectedRawInputs, setSelectedRawInputs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef(null);

  // ─── Merge modal state ────────────────────────────────────────────
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeLog, setMergeLog] = useState(null);
  // Each entry: { _id, raw_input, master_id }
  const [mergeRawInputs, setMergeRawInputs] = useState([]);
  const [mergeDisplayName, setMergeDisplayName] = useState("");
  const [mergeCanonicalId, setMergeCanonicalId] = useState("");
  const [mergeDropdownOpen, setMergeDropdownOpen] = useState(false);
  const [mergeDropdownSearch, setMergeDropdownSearch] = useState("");
  const mergeDropdownRef = useRef(null);
  // canonical-id picker dropdown
  const [mergeCanonicalOpen, setMergeCanonicalOpen] = useState(false);
  const mergeCanonicalRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/pending`
      );
      setLogs(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load normalization logs ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Close Create dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setDropdownSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close Merge raw-input dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (mergeDropdownRef.current && !mergeDropdownRef.current.contains(e.target)) {
        setMergeDropdownOpen(false);
        setMergeDropdownSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close Merge canonical-id dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (mergeCanonicalRef.current && !mergeCanonicalRef.current.contains(e.target)) {
        setMergeCanonicalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Create modal helpers ─────────────────────────────────────────

  const openCreateModal = (log) => {
    setSelectedLog(log);
    setDisplayName(log.raw_input);
    setSelectedRawInputs([{ _id: log._id, raw_input: log.raw_input }]);
    setDropdownOpen(false);
    setDropdownSearch("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedLog(null);
    setDisplayName("");
    setSelectedRawInputs([]);
    setDropdownOpen(false);
    setDropdownSearch("");
  };

  const addRawInput = (log) => {
    if (selectedRawInputs.some((r) => r._id === log._id)) return;
    setSelectedRawInputs((prev) => [...prev, { _id: log._id, raw_input: log.raw_input }]);
    setDropdownSearch("");
    setDropdownOpen(false);
  };

  const removeRawInput = (id) => {
    setSelectedRawInputs((prev) => prev.filter((r, i) => i === 0 || r._id !== id));
  };

  const availableToAdd = selectedLog
    ? logs.filter(
        (l) =>
          l.entity_type === selectedLog.entity_type &&
          !selectedRawInputs.some((r) => r._id === l._id)
      )
    : [];

  const filteredAvailable = dropdownSearch.trim()
    ? availableToAdd.filter((l) =>
        l.raw_input.toLowerCase().includes(dropdownSearch.toLowerCase())
      )
    : availableToAdd;

  const handleCreateEntity = async () => {
    if (!displayName.trim()) {
      alert("Display name required");
      return;
    }
    const additionalLogIds = selectedRawInputs.slice(1).map((r) => r._id);
    try {
      await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/${selectedLog._id}/create`,
        { displayName, additionalLogIds }
      );
      alert("Canonical entity created ✅");
      closeCreateModal();
      await fetchLogs();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create entity ❌");
    }
  };

  // ─── Merge modal helpers ──────────────────────────────────────────

  const openMergeModal = (log) => {
    setMergeLog(log);
    setMergeRawInputs([{ _id: log._id, raw_input: log.raw_input, master_id: log.master_id }]);
    setMergeDisplayName(log.matched_display_name || "");
    setMergeCanonicalId(log.suggested_canonical_id || "");
    setMergeDropdownOpen(false);
    setMergeDropdownSearch("");
    setMergeCanonicalOpen(false);
    setShowMergeModal(true);
  };

  const closeMergeModal = () => {
    setShowMergeModal(false);
    setMergeLog(null);
    setMergeRawInputs([]);
    setMergeDisplayName("");
    setMergeCanonicalId("");
    setMergeDropdownOpen(false);
    setMergeDropdownSearch("");
    setMergeCanonicalOpen(false);
  };

  const addMergeRawInput = (log) => {
    if (mergeRawInputs.some((r) => r._id === log._id)) return;
    setMergeRawInputs((prev) => [
      ...prev,
      { _id: log._id, raw_input: log.raw_input, master_id: log.master_id },
    ]);
    setMergeDropdownSearch("");
    setMergeDropdownOpen(false);
  };

  const removeMergeRawInput = (id) => {
    setMergeRawInputs((prev) => prev.filter((r, i) => i === 0 || r._id !== id));
  };

  // Logs available for merge: same entity_type, fuzzy match only (must have a master_id), not already selected
  const mergeAvailableToAdd = mergeLog
    ? logs.filter(
        (l) =>
          l.entity_type === mergeLog.entity_type &&
          l.match_type === "fuzzy" &&
          l.master_id &&
          !mergeRawInputs.some((r) => r._id === l._id)
      )
    : [];

  const mergeFilteredAvailable = mergeDropdownSearch.trim()
    ? mergeAvailableToAdd.filter((l) =>
        l.raw_input.toLowerCase().includes(mergeDropdownSearch.toLowerCase())
      )
    : mergeAvailableToAdd;

  // Unique canonical IDs from selected merge raw inputs (for picker dropdown)
  const mergeCanonicalOptions = [
    ...new Set(
      mergeRawInputs
        .map((r) => {
          const full = logs.find((l) => l._id === r._id);
          return full?.suggested_canonical_id || null;
        })
        .filter(Boolean)
    ),
  ];

  const handleMergeEntity = async () => {
    if (!mergeDisplayName.trim()) {
      alert("Display name required");
      return;
    }
    if (!mergeCanonicalId.trim()) {
      alert("Canonical ID required");
      return;
    }

    // Collect unique, non-null master_ids from selected raw inputs
    const masterIds = [
      ...new Set(
        mergeRawInputs.map((r) => r.master_id).filter(Boolean)
      ),
    ];

    if (masterIds.length === 0) {
      alert("No master IDs found on selected raw inputs");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/merge`,
        {
          masterId: masterIds,
          canonicalId: mergeCanonicalId.trim(),
          displayName: mergeDisplayName.trim(),
        }
      );
      alert("Merged successfully ✅");
      closeMergeModal();
      await fetchLogs();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Merge failed ❌");
    }
  };

  // ─── Other handlers ───────────────────────────────────────────────

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this normalization?")) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/${id}/approve`
      );
      alert("Approved successfully ✅");
      await fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Approval failed ❌");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this normalization?")) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/${id}/reject`
      );
      alert("Rejected successfully ❌");
      await fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Reject failed ❌");
    }
  };

  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Normalization Review</h1>
        <button
          onClick={fetchLogs}
          className="bg-[#143694] text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">No pending reviews 🎉</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Raw Input</th>
                <th className="p-4 text-left">Suggested Match</th>
                <th className="p-4 text-left">Canonical ID</th>
                <th className="p-4 text-left">Confidence</th>
                <th className="p-4 text-left">Match Type</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b">

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.entity_type === "company"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {log.entity_type}
                    </span>
                  </td>

                  <td className="p-4">{log.raw_input}</td>
                  <td className="p-4">{log.matched_display_name || "-"}</td>
                  <td className="p-4">{log.suggested_canonical_id || "-"}</td>
                  <td className="p-4">{log.confidence ?? "-"}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.match_type === "fuzzy"
                          ? "bg-yellow-100 text-yellow-700"
                          : log.match_type === "alias"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.match_type}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-1 w-full">
                      {log.match_type === "fuzzy" ? (
                        <button
                          onClick={() => openMergeModal(log)}
                          className="flex-1 bg-purple-600 text-white rounded px-2 py-1 text-xs"
                        >
                          Merge
                        </button>
                      ) : (
                        log.suggested_canonical_id && (
                          <button
                            onClick={() => handleApprove(log._id)}
                            className="flex-1 bg-green-600 text-white rounded px-2 py-1 text-xs"
                          >
                            Approve
                          </button>
                        )
                      )}
                      {log.match_type !== "fuzzy" && (
                        <button
                          onClick={() => openCreateModal(log)}
                          className="flex-1 bg-blue-600 text-white rounded px-2 py-1 text-xs"
                        >
                          Create
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(log._id)}
                        className="flex-1 bg-red-600 text-white rounded px-2 py-1 text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Create Canonical Entity Modal ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">

            <h2 className="text-xl font-bold mb-4">Create Canonical Entity</h2>

            {/* Raw Inputs */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Raw Input</label>

              {availableToAdd.length > 0 && (
                <div className="relative mb-2" ref={dropdownRef}>
                  <div
                    className="flex items-center border rounded-lg px-3 py-2 gap-2 cursor-text"
                    onClick={() => setDropdownOpen(true)}
                  >
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                      value={dropdownSearch}
                      onChange={(e) => { setDropdownSearch(e.target.value); setDropdownOpen(true); }}
                      onFocus={() => setDropdownOpen(true)}
                      placeholder="Search and add raw inputs..."
                      className="flex-1 text-sm outline-none bg-transparent"
                    />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                      <ul className="max-h-48 overflow-y-auto divide-y">
                        {filteredAvailable.length === 0 ? (
                          <li className="px-3 py-2 text-sm text-gray-400">No results</li>
                        ) : (
                          filteredAvailable.map((l) => (
                            <li
                              key={l._id}
                              onMouseDown={(e) => { e.preventDefault(); addRawInput(l); }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              {l.raw_input}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedRawInputs.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedRawInputs.map((r, i) => (
                    <span
                      key={r._id}
                      className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-sm px-2 py-1 rounded-md"
                    >
                      {r.raw_input}
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => removeRawInput(r._id)}
                          className="text-gray-400 hover:text-red-500 leading-none ml-1"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Display Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeCreateModal} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleCreateEntity} className="px-4 py-2 bg-[#143694] text-white rounded">
                Create
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── Merge Canonical Entity Modal ─── */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">

            <h2 className="text-xl font-bold mb-4">Merge Into Canonical Entity</h2>

            {/* Raw Inputs */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Raw Inputs</label>

              {mergeAvailableToAdd.length > 0 && (
                <div className="relative mb-2" ref={mergeDropdownRef}>
                  <div
                    className="flex items-center border rounded-lg px-3 py-2 gap-2 cursor-text"
                    onClick={() => setMergeDropdownOpen(true)}
                  >
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                      value={mergeDropdownSearch}
                      onChange={(e) => { setMergeDropdownSearch(e.target.value); setMergeDropdownOpen(true); }}
                      onFocus={() => setMergeDropdownOpen(true)}
                      placeholder="Search and add raw inputs..."
                      className="flex-1 text-sm outline-none bg-transparent"
                    />
                  </div>

                  {mergeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                      <ul className="max-h-48 overflow-y-auto divide-y">
                        {mergeFilteredAvailable.length === 0 ? (
                          <li className="px-3 py-2 text-sm text-gray-400">No results</li>
                        ) : (
                          mergeFilteredAvailable.map((l) => (
                            <li
                              key={l._id}
                              onMouseDown={(e) => { e.preventDefault(); addMergeRawInput(l); }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              <span>{l.raw_input}</span>
                              {l.master_id && (
                                <span className="ml-2 text-xs text-gray-400">
                                  master: {l.master_id}
                                </span>
                              )}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {mergeRawInputs.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {mergeRawInputs.map((r, i) => (
                    <span
                      key={r._id}
                      className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-sm px-2 py-1 rounded-md"
                    >
                      <span>{r.raw_input}</span>
                      {r.master_id && (
                        <span className="text-xs text-gray-400 ml-1">
                          ({r.master_id})
                        </span>
                      )}
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => removeMergeRawInput(r._id)}
                          className="text-gray-400 hover:text-red-500 leading-none ml-1"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Display Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                value={mergeDisplayName}
                onChange={(e) => setMergeDisplayName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Display name for the canonical entity"
              />
            </div>

            {/* Canonical ID — text input + quick-pick dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Canonical ID</label>
              <div className="flex gap-2">
                <input
                  value={mergeCanonicalId}
                  onChange={(e) => setMergeCanonicalId(e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder="Canonical ID"
                />
                {mergeCanonicalOptions.length > 0 && (
                  <div className="relative" ref={mergeCanonicalRef}>
                    <button
                      type="button"
                      onClick={() => setMergeCanonicalOpen((v) => !v)}
                      className="h-full px-3 border rounded bg-gray-50 hover:bg-gray-100 text-sm text-gray-600"
                    >
                      ▾ Pick
                    </button>
                    {mergeCanonicalOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
                        <ul className="max-h-40 overflow-y-auto divide-y">
                          {mergeCanonicalOptions.map((cid) => (
                            <li
                              key={cid}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setMergeCanonicalId(cid);
                                setMergeCanonicalOpen(false);
                              }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              {cid}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeMergeModal} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleMergeEntity} className="px-4 py-2 bg-purple-600 text-white rounded">
                Merge
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminNormalization;

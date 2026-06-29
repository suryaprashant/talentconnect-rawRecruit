import React, {
  useEffect,
  useState,
} from "react";

import axios from "../../../lib/axiosInstance";

const AdminNormalization = () => {
  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [showCreateModal, setShowCreateModal] =
    useState(false);

    const [selectedLog, setSelectedLog] =
    useState(null);

    const [displayName, setDisplayName] =
    useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res =
        await axios.get(
          `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/pending`
        );

      setLogs(
        res.data.data || []
      );

    } catch (err) {
      console.error(err);
      alert(
        "Failed to load normalization logs ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreateEntity =
  async () => {

    if (!displayName.trim()) {
      alert("Display name required");
      return;
    }

    try {

      await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/${selectedLog._id}/create`,
        {
          displayName,
        }
      );

      alert(
        "Canonical entity created ✅"
      );

      setShowCreateModal(false);
      setSelectedLog(null);
      setDisplayName("");

      await fetchLogs();
    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Failed to create entity ❌"
      );
    }
  };
  const handleApprove =
    async (id) => {
      const confirmed =
        window.confirm(
          "Approve this normalization?"
        );

      if (!confirmed) return;

      try {
        await axios.patch(
          `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/${id}/approve`
        );

        alert(
          "Approved successfully ✅"
        );

        await fetchLogs();

      } catch (err) {
        console.error(err);

        alert(
          "Approval failed ❌"
        );
      }
    };

  const handleReject =
    async (id) => {
      const confirmed =
        window.confirm(
          "Reject this normalization?"
        );

      if (!confirmed) return;

      try {
        await axios.patch(
          `${import.meta.env.VITE_Backend_URL}/api/admin/normalization/${id}/reject`
        );

        alert(
          "Rejected successfully ❌"
        );

        await fetchLogs();

      } catch (err) {
        console.error(err);

        alert(
          "Reject failed ❌"
        );
      }
    };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Normalization Review
        </h1>

        <button
          onClick={fetchLogs}
          className="bg-[#143694] text-white px-4 py-2 rounded"
        >
          Refresh
        </button>

      </div>

      {loading ? (
        <div>
          Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No pending reviews 🎉
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Raw Input
                </th>

                <th className="p-4 text-left">
                  Suggested Match
                </th>

                <th className="p-4 text-left">
                  Canonical ID
                </th>

                <th className="p-4 text-left">
                  Confidence
                </th>

                <th className="p-4 text-left">
                  Match Type
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b"
                >

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        log.entity_type ===
                        "company"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {log.entity_type}
                    </span>
                  </td>

                  <td className="p-4">
                    {log.raw_input}
                  </td>

                  <td className="p-4">
                    {log.matched_display_name ||
                      "-"}
                  </td>

                  <td className="p-4">
                    {log.suggested_canonical_id ||
                      "-"}
                  </td>

                  <td className="p-4">
                    {log.confidence ??
                      "-"}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        log.match_type ===
                        "fuzzy"
                          ? "bg-yellow-100 text-yellow-700"
                          : log.match_type ===
                            "alias"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.match_type}
                    </span>

                  </td>

                  <td className="p-4 flex gap-2">

                    {log.suggested_canonical_id ? (

                        <button
                        onClick={() =>
                            handleApprove(log._id)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                        Approve
                        </button>

                    ) : (

                        <button
                        onClick={() => {

                            setSelectedLog(log);

                            setDisplayName(
                            log.raw_input
                            );

                            setShowCreateModal(true);

                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                        Create
                        </button>

                    )}

                    <button
                        onClick={() =>
                        handleReject(log._id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Reject
                    </button>

                    </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
{showCreateModal && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl p-6 w-[450px]">

      <h2 className="text-xl font-bold mb-4">
        Create Canonical Entity
      </h2>

      <div className="mb-4">

        <label className="block text-sm mb-2">
          Raw Input
        </label>

        <input
          value={selectedLog?.raw_input || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />

      </div>

      <div className="mb-4">

        <label className="block text-sm mb-2">
          Display Name
        </label>

        <input
          value={displayName}
          onChange={(e) =>
            setDisplayName(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

      </div>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => {

            setShowCreateModal(false);

            setSelectedLog(null);

            setDisplayName("");

          }}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleCreateEntity}
          className="px-4 py-2 bg-[#143694] text-white rounded"
        >
          Create
        </button>

      </div>

    </div>

  </div>

)}
    </div>
  );
};

export default AdminNormalization;
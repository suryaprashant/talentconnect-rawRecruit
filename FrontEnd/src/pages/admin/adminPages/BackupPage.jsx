"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import createAxiosClient from "@/lib/createAxiosClient";

const axiosClient = createAxiosClient();

console.log("axiosclient",axiosClient);

import {
  DatabaseBackup,
  ShieldCheck,
  RotateCcw,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_Backend_URL;

export default function BackupPage() {
  const [verified, setVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  });

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /*
   * Send OTP
   */
  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      setError("");
      setMessage("");

      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        email: import.meta.env.VITE_Email,
        usertype: "admin",
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to send OTP");
      }

      setShowOtpModal(true);
      setOtp("");
      setTimer(60);

      setMessage("OTP has been sent to the founder's email.");
    } catch (error) {
      console.error("Send backup OTP error:", error);

      setError(
        error.response?.data?.message || error.message || "Failed to send OTP.",
      );
    } finally {
      setSendingOtp(false);
    }
  };

  /*
   * Verify OTP
   */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6 digit OTP.");
      return;
    }

    try {
      setOtpLoading(true);
      setError("");

      const response = await axiosClient.post(`/api/auth/verify-otp`, {
        otp,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Invalid OTP");
      }
      sessionStorage.setItem("backupAccessVerified", "true");

      setVerified(true);
      setShowOtpModal(false);
      setOtp("");
      setMessage("Backup access verified successfully.");
    } catch (error) {
      console.error("Verify backup OTP error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Invalid or expired OTP.",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      setAction("create");
      setError("");
      setMessage("");

      const response = await axiosClient.post(`/api/backup/create`, {});

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to create backup.");
      }

      setMessage("Backup created and uploaded successfully.");
    } catch (error) {
      console.error("Create backup error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create backup.",
      );
    } finally {
      setLoading(false);
      setAction("");
    }
  };

  /*
   * Restore backup
   */
  const handleRestoreBackup = async () => {
    const key = window.prompt("Enter backup key:");

    if (!key?.trim()) return;

    const confirmed = window.confirm(
      "WARNING: Restore will overwrite current database data. Are you sure?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setAction("restore");
      setError("");
      setMessage("");

      const response = await axiosClient.post(`/api/backup/restore`, {
        key: key.trim(),
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to restore backup.");
      }

      setMessage("Database restored successfully.");
    } catch (error) {
      console.error("Restore backup error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to restore database.",
      );
    } finally {
      setLoading(false);
      setAction("");
    }
  };

  const handleCleanup = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cleanup old backups?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setAction("cleanup");
      setError("");
      setMessage("");

      const response = await axiosClient.post(`/api/backup/cleanup`, {});

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to cleanup backups.");
      }

      setMessage("Old backups cleaned successfully.");
    } catch (error) {
      console.error("Cleanup backup error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to cleanup backups.",
      );
    } finally {
      setLoading(false);
      setAction("");
    }
  };

  if (!verified) {
    return (
      <>
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <DatabaseBackup size={32} className="text-blue-600" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold">Backup Management</h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              This section contains sensitive database operations. OTP
              verification is required to continue.
            </p>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sendingOtp ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Verify Backup Access
                </>
              )}
            </button>
          </div>
        </div>

        {/* OTP MODAL */}

        {showOtpModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <ShieldCheck size={32} className="text-blue-600" />
                </div>
              </div>

              <h2 className="mt-5 text-center text-xl font-semibold">
                Verify Backup Access
              </h2>

              <p className="mt-2 text-center text-sm text-gray-500">
                Enter the 6 digit OTP sent to the founder's registered email.
              </p>

              {message && (
                <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                placeholder="Enter OTP"
                className="mt-6 w-full rounded-xl border px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.length !== 6}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Verify OTP
                  </>
                )}
              </button>

              <div className="mt-5 text-center">
                {timer > 0 ? (
                  <span className="text-sm text-gray-500">
                    Resend OTP in {timer}s
                  </span>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="text-sm font-medium text-blue-600"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
   * BACKUP DASHBOARD
   */
  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <DatabaseBackup size={30} className="text-blue-600" />

          <div>
            <h1 className="text-2xl font-semibold">Backup Management</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage database backups and restoration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
          <ShieldCheck size={16} />
          OTP Verified
        </div>
      </div>

      {/* Messages */}

      {message && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Warning */}

      <div className="mt-6 flex gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <AlertTriangle size={20} className="shrink-0 text-yellow-600" />

        <div>
          <p className="font-medium text-yellow-800">
            Sensitive database operations
          </p>

          <p className="mt-1 text-sm text-yellow-700">
            Restore operations can overwrite production database data. Please
            verify the backup before restoring.
          </p>
        </div>
      </div>

      {/* Cards */}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Create */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <DatabaseBackup size={24} className="text-blue-600" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">Create Backup</h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Create a new database backup and upload it to your configured
            storage.
          </p>

          <button
            onClick={handleCreateBackup}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {action === "create" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <DatabaseBackup size={18} />
                Create Backup
              </>
            )}
          </button>
        </div>

        {/* Restore */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
            <RotateCcw size={24} className="text-orange-600" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">Restore Backup</h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Restore the database from an existing backup.
          </p>

          <button
            onClick={handleRestoreBackup}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {action === "restore" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                Restore Backup
              </>
            )}
          </button>
        </div>

        {/* Cleanup */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <Trash2 size={24} className="text-red-600" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">Cleanup Backups</h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Delete old backups according to your retention policy.
          </p>

          <button
            onClick={handleCleanup}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {action === "cleanup" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Cleaning...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Cleanup Backups
              </>
            )}
          </button>
        </div>
      </div>

      {/* Automatic backup */}

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw size={22} className="text-gray-700" />

            <div>
              <h2 className="font-semibold">Automatic Backups</h2>

              <p className="mt-1 text-sm text-gray-500">
                Scheduled backups are handled automatically by the backend cron
                job.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

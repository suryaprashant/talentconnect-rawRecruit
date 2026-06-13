// src/workers/index.js

console.log("🚀 Starting workers...");

await import("./scoreWorker.js");
await import("./jobNotificationWorker.js");
await import("./alumniNetworkWorker.js");

console.log("✅ All workers loaded");
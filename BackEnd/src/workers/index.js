// src/workers/index.js

console.log("🚀 Starting workers...");

await import("./scoreWorker.js");
await import("./jobNotificationWorker.js");
await import("./alumniNetworkWorker.js");
await import("./welcomeEmailWorker.js");
await import("./newReqinfoWorker.js");
await import("./resolveInfoWorker.js");

console.log("✅ All workers loaded");
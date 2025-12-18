// test-linkedin-userinfo.js
import axios from "axios";

async function main() {
  console.log(
    "HTTP(S)_PROXY:",
    process.env.HTTP_PROXY || process.env.HTTPS_PROXY || "none"
  );

  try {
    const res = await axios.get("https://api.linkedin.com/v2/userinfo", {
      timeout: 15000,
      // no Authorization header on purpose; we just care about TCP/SSL
    });
    console.log("Status:", res.status);
    console.log("Body (first 100 chars):", String(res.data).slice(0, 100));
  } catch (err) {
    console.error("Axios to api.linkedin.com failed:");
    console.error("  message:", err.message);
    console.error("  code   :", err.code);
    console.error("  errno  :", err.errno);
    console.error("  syscall:", err.syscall);
    console.error("  host   :", err.hostname || err.host);
  }
}

main();

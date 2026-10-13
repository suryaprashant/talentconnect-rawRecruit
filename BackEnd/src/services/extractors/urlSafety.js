// Shared SSRF protection used by the controller, the HTTP fetcher and Playwright.
import net from "node:net";
import dns from "node:dns";
import { lookup as dnsLookup } from "node:dns/promises";
import { Agent } from "undici";

const blocked = new net.BlockList();
for (const [addr, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
])
  blocked.addSubnet(addr, prefix, "ipv4");
for (const [addr, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["100::", 64],
  ["2001::", 23],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
])
  blocked.addSubnet(addr, prefix, "ipv6");

export function isPrivateIp(ip) {
  const clean = String(ip || "")
    .replace(/^\[|\]$/g, "")
    .split("%")[0];
  if (net.isIPv4(clean)) return blocked.check(clean, "ipv4");
  if (net.isIPv6(clean)) {
    // IPv4-mapped (::ffff:a.b.c.d / ::ffff:7f00:1) never appears in legitimate public DNS answers.
    // (Not done via BlockList: Node would then also match plain IPv4 addresses against it.)
    if (/^(0{0,4}:){0,5}ffff:/i.test(clean) || /^::ffff:/i.test(clean))
      return true;
    return blocked.check(clean, "ipv6");
  }
  return true; // not an IP at all -> treat as unsafe
}

const BLOCKED_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".test",
  ".lan",
  ".home.arpa",
];

export class UnsafeUrlError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnsafeUrlError";
    this.code = "UNSAFE_URL";
  }
}

/** Synchronous checks (protocol, credentials, literal IPs, reserved names). */
export function assertPublicUrlShape(input) {
  let url;
  try {
    url = input instanceof URL ? input : new URL(String(input).trim());
  } catch {
    throw new UnsafeUrlError("A valid URL is required.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new UnsafeUrlError("Only public HTTP/HTTPS URLs are allowed.");
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    !host ||
    host === "localhost" ||
    (!host.includes(".") && !net.isIP(host)) ||
    BLOCKED_SUFFIXES.some((s) => host.endsWith(s))
  ) {
    throw new UnsafeUrlError("Private URLs are not allowed.");
  }
  if (net.isIP(host) && isPrivateIp(host)) {
    throw new UnsafeUrlError("Private IP addresses are not allowed.");
  }
  if (url.port && !["80", "443", "8080", "8443"].includes(url.port)) {
    throw new UnsafeUrlError("Unsupported port.");
  }
  return url;
}

/** Full check including DNS resolution (used by controller & Playwright). */
export async function assertPublicHttpUrl(input, { resolve = true } = {}) {
  const url = assertPublicUrlShape(input);
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (resolve && !net.isIP(host)) {
    let records;
    try {
      records = await dnsLookup(host, { all: true, verbatim: true });
    } catch {
      throw new UnsafeUrlError("Unable to resolve the URL hostname.");
    }
    if (!records.length || records.some((r) => isPrivateIp(r.address))) {
      throw new UnsafeUrlError(
        "URL host must resolve only to public IP addresses.",
      );
    }
  }
  return url;
}

// undici dispatcher that validates the IP at connect time, which defeats DNS
// rebinding and also covers every redirect hop.
export const safeDispatcher = new Agent({
  connect: {
    lookup(hostname, options, callback) {
      dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
        if (err) return callback(err);
        if (
          !addresses.length ||
          addresses.some((a) => isPrivateIp(a.address))
        ) {
          return callback(
            new UnsafeUrlError("Resolved to a non-public address."),
          );
        }
        if (options?.all) return callback(null, addresses);
        return callback(null, addresses[0].address, addresses[0].family);
      });
    },
  },
});

/**
 * Strip tracking parameters and fragments so that the same job maps to one
 * cache key.
 */
const TRACKING =
  /^(utm_|fbclid$|gclid$|msclkid$|mc_cid$|mc_eid$|igshid$|_hs|ref$|referrer$|trk$|trackingid$|refid$|src$|source$|lipi$)/i;
export function canonicalizeUrl(url) {
  const u = new URL(url.toString());
  u.hash = "";
  u.hostname = u.hostname.toLowerCase();
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING.test(key)) u.searchParams.delete(key);
  }
  u.searchParams.sort();
  return u;
}

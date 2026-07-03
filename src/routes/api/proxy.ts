import { createFileRoute } from "@tanstack/react-router";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "host",
  "cookie",
]);

function buildUpstreamHeaders(request: Request, headersParam: string): Headers {
  const upstreamHeaders = new Headers();

  for (const [name, value] of request.headers.entries()) {
    if (HOP_BY_HOP_HEADERS.has(name.toLowerCase())) continue;
    upstreamHeaders.set(name, value);
  }

  upstreamHeaders.set(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  if (headersParam) {
    const urlSearchParams = new URLSearchParams(headersParam);
    for (const [key, val] of urlSearchParams.entries()) {
      const headerName = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      upstreamHeaders.set(headerName, val);
    }
  }

  if (!upstreamHeaders.has("Referer")) {
    try {
      const targetOrigin = new URL(request.url).origin;
      upstreamHeaders.set("Referer", `${targetOrigin}/`);
    } catch {
      // ignore
    }
  }

  if (!upstreamHeaders.has("Origin")) {
    try {
      upstreamHeaders.set("Origin", new URL(request.url).origin);
    } catch {
      // ignore
    }
  }

  return upstreamHeaders;
}

function rewriteManifest(
  manifestText: string,
  baseUrl: string,
  proxyOrigin: string,
  suffix: string,
): string {
  const lines = manifestText.split("\n");
  const suffixQuery = suffix ? `|${suffix}` : "";

  const rewrittenLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;

    if (trimmed.startsWith("#")) {
      // Rewrite URIs in tags (like #EXT-X-KEY or #EXT-X-STREAM-INF)
      return trimmed.replace(/(URI|url|URL)="([^"]+)"/g, (match, attr, val) => {
        if (val.startsWith("data:")) return match;
        try {
          const absoluteUrl = new URL(val, baseUrl).href;
          const proxiedUrl = `${absoluteUrl}${suffixQuery}`;
          return `${attr}="${proxyOrigin}/api/proxy?url=${encodeURIComponent(proxiedUrl)}"`;
        } catch {
          return match;
        }
      });
    }

    // Direct stream URLs
    try {
      const absoluteUrl = new URL(trimmed, baseUrl).href;
      const proxiedUrl = `${absoluteUrl}${suffixQuery}`;
      return `${proxyOrigin}/api/proxy?url=${encodeURIComponent(proxiedUrl)}`;
    } catch {
      return line;
    }
  });

  return rewrittenLines.join("\n");
}

export const Route = createFileRoute("/api/proxy")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "*",
          },
        }),
      HEAD: async ({ request }) => {
        const urlParam = new URL(request.url).searchParams.get("url");
        if (!urlParam) {
          return new Response("Missing url parameter", { status: 400 });
        }

        try {
          const decodedUrl = decodeURIComponent(urlParam);
          const parts = decodedUrl.split("|");
          const targetUrl = parts[0];
          const headersParam = parts[1] || "";

          const res = await fetch(targetUrl, {
            method: "HEAD",
            headers: buildUpstreamHeaders(request, headersParam),
          });

          const responseHeaders = new Headers();
          responseHeaders.set("Access-Control-Allow-Origin", "*");
          responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
          responseHeaders.set("Access-Control-Allow-Headers", "*");

          const contentType = res.headers.get("content-type") || "application/octet-stream";
          responseHeaders.set("Content-Type", contentType);

          const contentLength = res.headers.get("content-length");
          if (contentLength) responseHeaders.set("Content-Length", contentLength);

          return new Response(null, {
            status: res.status,
            headers: responseHeaders,
          });
        } catch (err: any) {
          return new Response(`Proxy error: ${err.message}`, {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      },
      GET: async ({ request }) => {
        const urlParam = new URL(request.url).searchParams.get("url");
        if (!urlParam) {
          return new Response("Missing url parameter", { status: 400 });
        }

        try {
          const decodedUrl = decodeURIComponent(urlParam);
          const parts = decodedUrl.split("|");
          const targetUrl = parts[0];
          const headersParam = parts[1] || "";

          // Fetch from the target stream url
          const res = await fetch(targetUrl, {
            headers: buildUpstreamHeaders(request, headersParam),
          });

          if (!res.ok) {
            return new Response(`Failed to fetch remote stream: ${res.statusText}`, {
              status: res.status,
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            });
          }

          const contentType = res.headers.get("content-type") || "";
          const isPlaylist =
            contentType.includes("mpegurl") ||
            contentType.includes("m3u8") ||
            targetUrl.toLowerCase().split("?")[0].endsWith(".m3u8");

          const responseHeaders = new Headers();
          responseHeaders.set("Access-Control-Allow-Origin", "*");
          responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
          responseHeaders.set("Access-Control-Allow-Headers", "*");
          responseHeaders.set("Content-Type", contentType || "application/octet-stream");

          const contentLength = res.headers.get("content-length");
          if (contentLength) responseHeaders.set("Content-Length", contentLength);
          const contentRange = res.headers.get("content-range");
          if (contentRange) responseHeaders.set("Content-Range", contentRange);
          const acceptRanges = res.headers.get("accept-ranges");
          if (acceptRanges) responseHeaders.set("Accept-Ranges", acceptRanges);

          if (isPlaylist) {
            const text = await res.text();
            const finalUrl = res.url || targetUrl;
            const baseUrl = finalUrl.substring(0, finalUrl.lastIndexOf("/") + 1);

            const requestUrlObj = new URL(request.url);
            const proxyOrigin = requestUrlObj.origin;

            const rewritten = rewriteManifest(text, baseUrl, proxyOrigin, headersParam);
            return new Response(rewritten, {
              headers: responseHeaders,
            });
          } else {
            // Return segment binary body directly
            const body = res.body;
            return new Response(body, {
              headers: responseHeaders,
            });
          }
        } catch (err: any) {
          return new Response(`Proxy error: ${err.message}`, {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      },
    },
  },
});

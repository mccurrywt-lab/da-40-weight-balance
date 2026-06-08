const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const awcHeaders = {
  "Accept": "application/json",
  "User-Agent": "MTSU-DA40-Preflight/1.0",
};

async function fetchAwcJson(path: string) {
  const response = await fetch(`https://aviationweather.gov${path}`, { headers: awcHeaders });
  if (response.status === 204) return [];
  if (!response.ok) {
    throw new Error(`Aviation Weather Center returned ${response.status} for ${path}`);
  }
  return response.json();
}

function numberOrNull(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseVisibility(value: unknown) {
  if (typeof value === "number") return value;
  const text = String(value ?? "").replace("+", "").replace("P", "").replace("SM", "").trim();
  if (!text) return null;
  if (text.includes("/")) {
    const [whole, fraction] = text.split(" ");
    const [num, den] = (fraction || whole).split("/").map(Number);
    const base = fraction ? Number(whole) : 0;
    return Number.isFinite(num) && Number.isFinite(den) && den ? base + num / den : null;
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function ceilingFromClouds(clouds: unknown) {
  if (!Array.isArray(clouds)) return null;
  const ceiling = clouds
    .map((cloud) => {
      const item = cloud as Record<string, unknown>;
      const cover = String(item.cover ?? item.type ?? "").toUpperCase();
      const base = numberOrNull(item.base);
      return ["BKN", "OVC", "VV"].includes(cover) && base !== null ? base : null;
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b)[0];
  return ceiling ?? null;
}

function periodStart(period: Record<string, unknown>) {
  const raw = period.timeFrom ?? period.validTimeFrom ?? period.startTime ?? period.fcstTimeFrom;
  const time = raw ? Date.parse(String(raw)) : NaN;
  return Number.isFinite(time) ? time : 0;
}

function extractKmbtTafForecast(tafPayload: unknown) {
  const tafRows = Array.isArray(tafPayload) ? tafPayload : [];
  const taf = tafRows[0] as Record<string, unknown> | undefined;
  const periods = Array.isArray(taf?.fcsts) ? taf.fcsts as Array<Record<string, unknown>> : [];
  if (!periods.length) return null;

  const normalized = periods.map((period) => {
    const wind = Math.max(numberOrNull(period.wspd) ?? 0, numberOrNull(period.wgst) ?? 0);
    return {
      wind,
      windDirection: numberOrNull(period.wdir),
      visibility: parseVisibility(period.visib),
      ceiling: ceilingFromClouds(period.clouds),
      start: periodStart(period),
    };
  });

  const maxWind = normalized.reduce((best, item) => item.wind > best.wind ? item : best, normalized[0]);
  const visValues = normalized.map((item) => item.visibility).filter((value): value is number => value !== null);
  const ceilingValues = normalized.map((item) => item.ceiling).filter((value): value is number => value !== null);

  return {
    kind: "kmbt-taf",
    source: "AWC KMBT TAF",
    wind: maxWind.wind || null,
    windDirection: maxWind.windDirection,
    visibility: visValues.length ? Math.min(...visValues) : null,
    ceiling: ceilingValues.length ? Math.min(...ceilingValues) : null,
    raw: taf?.rawTAF ?? taf?.rawOb ?? null,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const [metar, taf] = await Promise.all([
      fetchAwcJson("/api/data/metar?ids=KMBT&format=json"),
      fetchAwcJson("/api/data/taf?ids=KMBT&format=json"),
    ]);
    const tafForecast = extractKmbtTafForecast(taf);
    const forecast = tafForecast ?? {
      kind: "awc-gfa-required",
      source: "AWC GFA required",
      message: "AWC did not return a KMBT TAF. Do not substitute BNA or MQY TAF data; use AWC GFA Ceiling & Visibility, Clouds, and Winds products for the forecast window.",
    };

    return new Response(JSON.stringify({ metar, taf, forecast }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Weather fetch failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

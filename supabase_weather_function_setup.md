# KMBT Weather Autofill Supabase Edge Function

The browser app cannot reliably fetch Aviation Weather Center METAR data directly because browser/CORS behavior can block the request. The app is now wired to call this Supabase Edge Function instead:

`https://cxcwclznzimisklucivy.functions.supabase.co/kmbt-weather`

## Files Created

- `supabase_edge_kmbt_weather_index.ts`
- `supabase_edge_config.toml`

## What The Function Does

1. Receives a request from the app.
2. Fetches the latest KMBT METAR from Aviation Weather Center.
3. Returns the JSON with CORS headers so the iPhone/GitHub Pages app can read it.

## Deploy Shape

If using Supabase CLI, the files should be arranged like this in a Supabase project folder:

```text
supabase/
  config.toml
  functions/
    kmbt-weather/
      index.ts
```

Copy:

- `supabase_edge_kmbt_weather_index.ts` to `supabase/functions/kmbt-weather/index.ts`
- The contents of `supabase_edge_config.toml` into `supabase/config.toml`

Then deploy:

```bash
supabase functions deploy kmbt-weather
```

In the Supabase dashboard, make sure JWT verification is disabled for `kmbt-weather`, because this is a public read-only weather proxy.

## App Behavior After Deployment

On app load, current KMBT weather will auto-fill:

- Current wind
- Current visibility
- Current ceiling
- OAT in Celsius
- Altimeter in inches Hg
- Pressure altitude

Pressure altitude uses the standard aviation formula:

```text
(29.92 - altimeter setting) x 1000 + 614
```

`614 ft` is the KMBT field elevation.

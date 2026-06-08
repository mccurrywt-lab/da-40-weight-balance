# AWC Forecast Source Notes

The forecast column must not be filled from Nashville (KBNA), Smyrna (KMQY), or other nearby-airport TAFs when planning KMBT.

## App Rule

- Current weather: AWC KMBT METAR.
- Forecast auto-fill: AWC KMBT TAF only if AWC publishes one.
- If no KMBT TAF is returned, do not substitute another TAF. Use AWC GFA products for the forecast window.

## AWC Products To Use Manually When No KMBT TAF Exists

- GFA Ceiling & Visibility
- GFA Clouds
- GFA Winds
- G-AIRMET/SIGMET/CWA products as applicable

## Implementation Note

The AWC Data API supports METAR, TAF, G-AIRMET, SIGMET, CWA, forecast discussion, and wind/temp endpoints. The browser app uses a Supabase Edge Function because AWC does not permit direct browser cross-origin requests. The Edge Function now returns structured METAR data plus KMBT TAF forecast data only when AWC provides it.

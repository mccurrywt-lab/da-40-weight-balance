# DA-40 Preflight Assistant Workflow Map

Source worksheet: Middle Tennessee State University Preflight Worksheet - Dual, updated 8-16-2025.

Related extracted references:

- `preflight_scorecard_rules.md`
- `da40_performance_chart_map.md`

## Goal

Turn the current DA-40 weight-and-balance app into a broader preflight assistant that reduces repetitive 20-30 minute planning tasks while keeping the pilot/instructor verification flow visible.

## Proposed App Flow

1. Weight and balance gate
   - Aircraft N-number / MTU number
   - Reuse current Supabase aircraft lookup
   - Reuse current W&B calculator
   - Keep existing zero-fuel and total-weight plotting
   - Produce a W&B result for the scorecard/final worksheet
   - W&B should be completed before the rest of the preflight scorecard

2. Flight setup
   - Aircraft N-number / MTU number
   - Student
   - Instructor
   - Local or cross-country route
   - Estimated departure time
   - Estimated flight time

3. Weather risk
   Worksheet categories:
   - Wind
   - Crosswind
   - Visibility
   - Ceilings
   - AIRMETs
   - SIGMETs
   - Convective SIGMETs/CWAs/Outlook
   - PIREPs

   Data-source plan:
   - Use Aviation Weather Center data for KMBT where available
   - Pull METAR for current weather
   - Pull TAF for forecast weather if KMBT has one; otherwise use the approved nearby forecast source once confirmed
   - Pull AIRMET/SIGMET/Convective SIGMET/CWA/PIREP products from Aviation Weather Center APIs where possible
   - ForeFlight may remain a pilot verification/reference source unless a supported API path is available
   - 1800WXBrief may remain a briefing/verification workflow unless a supported API path is available

   App behavior:
   - Parse weather products into the worksheet categories
   - Score automatically once scorecard thresholds are provided
   - Preserve raw weather text/observation time for verification
   - Still require student/instructor verification

4. Flight time and fuel
   Worksheet calculation:
   - Calculate fuel for longest segment between fuel stops
   - Total fuel - fuel required = fuel at landing
   - Score flight time
   - Score fuel

   Initial app version:
   - Fuel total defaults from DA-40 full tanks
   - User enters planned burn or fuel required
   - App calculates fuel at landing
   - User or app assigns fuel score once scoring thresholds are known

5. Instructor duty period
   Worksheet calculation:
   - Total instruction in prior 24 hours + estimated flight time = total instruction by end of flight
   - Instructors may not flight instruct more than 8 hours in a 24-hour period

   App behavior:
   - User enters prior 24-hour instruction time
   - App adds estimated flight time
   - App warns at or above 8 hours
   - App records duty-period score once score thresholds are known

6. Takeoff and landing distance
   Worksheet table fields:
   - Airport
   - No-obstacle takeoff distance
   - No-obstacle landing distance
   - 50-foot obstacle takeoff distance
   - 50-foot obstacle landing distance
   - Multi-engine accelerate-stop
   - Multi-engine single-engine climb rate

   DA-40 app behavior:
   - Use only relevant single-engine fields unless other aircraft types are added later
   - Allow multiple airport rows
   - First version: pilot enters calculated AFM distances from the takeoff/landing charts
   - App compares entered distances against runway length when runway data is provided
   - Later version: digitize DA-40 AFM charts and interpolate distances automatically

7. Additional approvals
   Worksheet approval items:
   - AIRMET/SIGMET/PIREP
   - Cirrus icing/altitude
   - Airport not on approved list
   - 24-hour flight instruction
   - Flight score 20-30
   - Flight score 30+

   App behavior:
   - Automatically flag approval needs when score/conditions trigger them
   - Provide instructor initials/approval fields
   - Keep final flight release summary clear

8. Verification checklist
   Worksheet S/I verification items:
   - Weather complies with Safety Practices and Procedures
   - Checked known traffic delays
   - Checked NOTAMs
   - Checked TFRs
   - Pilot documents current and onboard
   - Airports approved or approval received
   - W&B verified from takeoff to landing
   - Takeoff and landing distances safe
   - IMSAFE checklist passed
   - Cross-country standard briefing completed

   App behavior:
   - Checklist with student and instructor columns
   - Keep unchecked items visible in final summary
   - Final print/share view includes all required checks

9. Risk score summary
   Worksheet categories:
   - Wind
   - Crosswind
   - Visibility
   - Ceilings
   - AIRMETs
   - SIGMETs
   - Convective SIGMETs/CWAs/Outlook
   - PIREPs
   - Flight Time
   - Fuel
   - 24-Hour Flight Instruction
   - Duty Day
   - IFR Conditions
   - Night/CFI+CFI Conditions
   - Cirrus Icing, Altitude, Oxygen

   App behavior:
   - Sum category scores
   - Show total risk score
   - Show approval requirement based on total score

## Needed Confirmations

The scorecard rules have now been extracted into `preflight_scorecard_rules.md`.

Still needed:

- Takeoff and landing performance charts
- The required forecast station/source if KMBT does not publish a TAF
- Confirmation for score boundary inclusivity at exactly 20 and exactly 30 points

Until then, the safest app version should allow manual score entry and automate only totals, warnings, approvals, and summaries.

## Recommended First Expansion

Build a new Preflight workflow with:

- W&B gate first
- Flight Details
- Route
- Weather Score Card backed by KMBT weather data where possible
- Fuel and flight-time calculator
- Instructor duty calculator
- Takeoff/landing distance table
- Approval triggers
- Student/instructor verification checklist
- Final print summary

Keep W&B as its own section inside the same workflow.

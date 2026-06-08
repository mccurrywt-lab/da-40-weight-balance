# DA-40 AFM Performance Chart Map

Source: `DA-40-180 AFM 2023.pdf`, provided as the two large PDFs. They appear to be duplicate copies of the same 270-page AFM.

## Located Pages

| PDF Page | AFM Section | Use |
|---:|---|---|
| 155 | 5.3.6 Take-Off Distance | Conditions, assumptions, correction notes |
| 157 | DA-40 Take-Off Distance chart | Takeoff distance graph |
| 162 | 5.3.10 Landing Distance - Flaps LDG | Landing conditions and notes |
| 165 | DA-40 Landing Distance - Flaps LDG chart | Landing distance graph |

## Takeoff Chart Inputs

From the AFM takeoff-distance page:

- Throttle: max power
- RPM lever: 2700 RPM
- Flaps: T/O
- Lift-off speed: approximately 59 KIAS
- Climb-out speed: approximately 66 KIAS
- Runway: level asphalt surface
- Wind: not included in the baseline chart; correction notes apply

Correction notes visible from AFM:

- For takeoff distance, headwind may be accounted for by decreasing takeoff roll by 10% for each 10 kt headwind.
- Tailwind up to 10 kt may be accounted for by increasing takeoff roll by 10% for each 2 kt tailwind.
- Grass up to 5 cm increases takeoff roll by 10%.
- Grass 5-10 cm increases takeoff roll by 15%.
- Grass longer than 10 cm with at least 25% increase in takeoff roll.
- Grass longer than 25 cm: takeoff should not be attempted.
- Wet grass: further 10% increase in takeoff roll must be expected.
- Uphill slope of 2% increases takeoff roll by approximately 10%.

## Landing Chart Inputs

From the AFM landing-distance page:

- Throttle: idle
- RPM lever: high RPM
- Flaps: LDG
- Approach speeds vary by weight:
  - 73 KIAS at 2,646 lb
  - 71 KIAS at 2,535 lb
  - 68 KIAS at 2,205 lb
  - 60 KIAS at 1,874 lb
  - 55 KIAS at 1,543 lb
- Runway: level asphalt surface

Corrections visible from AFM:

- Landing distance over a 50 ft obstacle and ground roll are charted.
- Grass up to 5 cm increases landing roll by 5%.
- Grass 5-10 cm increases landing roll by 15%.
- Grass longer than 10 cm increases landing roll by at least 25%.
- Wet grass: further 10% increase in landing roll must be expected.
- Downhill slope of 2% increases landing distance by approximately 10%.

## Implementation Recommendation

Because the DA-40 AFM takeoff and landing charts are graphical, not simple text tables, the first app version should:

The app now has a first digitized chart model for KMBT row 1. It automates:

- Pressure altitude
- Temperature
- Weight
- Headwind/tailwind correction
- Takeoff ground roll
- Takeoff over 50 ft obstacle
- Landing ground roll
- Landing over 50 ft obstacle

Still manual/future:

- Grass/slope/wet runway corrections
- Additional airport runway-condition inputs
- Additional validation against hand-calculated AFM examples

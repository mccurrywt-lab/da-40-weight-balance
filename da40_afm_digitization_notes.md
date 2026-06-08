# DA-40 AFM Chart Digitization Notes

Source PDF: `work/da40_afm_2023.pdf`

Native chart images extracted:

- Takeoff distance chart: PDF page 157, image `work/performance_pages/chart_page_157_Image2_upright.png`
- Landing distance chart: PDF page 165, image `work/performance_pages/chart_page_165_Image2_upright.png`

## Current App Model

The app now uses digitized chart tables for baseline paved, level-runway ground roll:

- Pressure altitude axis: 0, 2,000, 4,000, 6,000, 8,000, 10,000 ft
- OAT axis: -20, 0, 20, 40, 50 C
- Takeoff table: DA-40 takeoff ground roll, max gross baseline
- Landing table: DA-40 landing ground roll, flaps LDG, max gross baseline

The app then applies:

- Weight correction from the AFM mass correction panel
- Headwind/tailwind correction
- 50 ft obstacle conversion
- 5% conservative factor
- Round up to the next 10 ft

## Chart Checkpoints

The chart examples are used as sanity checks:

- Takeoff example: 2,000 ft PA, 15 C, 2,205 lb, 10 kt headwind gives 558 ft ground roll and 985 ft over 50 ft obstacle.
- Landing example: 2,000 ft PA, 15 C, 2,205 lb, 10 kt headwind gives 624 ft ground roll and 1,329 ft over 50 ft obstacle.

The app intentionally rounds up, so automatic values may be slightly higher than the printed example.

## Safety Notes

This is a digitized planning model, not a replacement for required AFM verification. Keep the pilot/instructor verification item checked only after comparing the result to the AFM chart or approved school procedure.

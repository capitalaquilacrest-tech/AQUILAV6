# Official Capital Reserve Growth Schedule

Use this schedule only for eligible Capital Reserve computations. It does not
apply to Regular Deposit / Passive Yield.

## Exact piecewise growth formula

For an integer selected maturity day `d` from 7 through 365:

- Days 7–60: `growthPercent = 12 + ((d - 7) × 78 ÷ 53)`
- Days 61–120: `growthPercent = 90 + ((d - 60) × 1.5)`
- Days 121–180: `growthPercent = 180 + ((d - 120) × 1.8)`
- Days 181–365: `growthPercent = 288 + ((d - 180) × 387 ÷ 185)`

Display the Growth Rate rounded to two decimal places, removing unnecessary
trailing zeroes. Calculate the multiplier from the unrounded growth value:

`multiplier = roundTo3Decimals(1 + (growthPercent ÷ 100))`

Then calculate:

- `Projected Maturity Value = Principal × multiplier`
- `Projected Profit = Projected Maturity Value − Principal`

Round peso results to two decimal places. Always label them as projected, not
guaranteed or already credited.

## Verification anchors

Use these known points to confirm the computation:

| Day | Growth Rate | Multiplier |
| ---: | ---: | ---: |
| 7 | 12% | 1.12 |
| 8 | 13.47% | 1.135 |
| 30 | 45.85% | 1.458 |
| 60 | 90% | 1.9 |
| 61 | 91.5% | 1.915 |
| 90 | 135% | 2.35 |
| 120 | 180% | 2.8 |
| 121 | 181.8% | 2.818 |
| 180 | 288% | 3.88 |
| 181 | 290.09% | 3.901 |
| 200 | 329.84% | 4.298 |
| 300 | 539.03% | 6.39 |
| 365 | 675% | 7.75 |

## Eligibility before computing

First confirm the principal and selected integer maturity day. The principal
must meet the amount-based minimum maturity rule already defined in the main
Aquila policy prompt, and the selected day must not exceed 365. If the selected
day is below the applicable minimum, explain the minimum allowed day instead of
showing it as an eligible projection.

For every financial computation, finish with the standard reminder that the
official credited amount and final status are based on the approved transaction
record and dashboard.

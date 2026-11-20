# LO855 local UI demo

Two local pages share the same original styles, fonts, and images.

- `payment-list.html`: Commission and Share calculators, selected using the existing view dropdown.
- `result.html`: the captured daily result report.
- `calculators/`: the calculator feature CSS and JavaScript for server integration.
- `demo/`: local testing and navigation tools; these are not backend replacements.
- `assets/`: shared original display assets.

## Run locally

Open `payment-list.html`, or run this command inside the project folder:

```sh
python3 -m http.server 8550 --bind 127.0.0.1
```

Then open http://localhost:8550/payment-list.html.

## Local testing

The view dropdown switches between captured Commission and Share reports.
Click report amounts, including blank USD cells, to edit them. Editing a daily
amount updates its column total; the total row can also be edited directly.
Edits persist while switching views and reset on page reload.

Commission has blank, editable 2D/3D rates applied separately to riel and USD.
Share starts at 20% and highlights negative results in red. Amounts are read
from current report totals and update automatically when the report changes.
Dollar values have two decimal places; currency symbols follow amounts.
Matching cell colors identify report sources and calculator fields.
The saved report filters do not load data from the real server.

## Integrate with the real server

1. Keep the real page, authentication, filters, and report AJAX loading.
2. Copy `#commissionCalculator` and `#shareCalculator` from `payment-list.html`
   below the existing report, outside `#accountingList`.
3. Include `calculators/calculators.css` and `calculators/calculators.js` after
   the calculator markup. They use existing `#accountingList` and `#viewType`.
4. Keep the preview templates, `demo/` scripts, and demo CSS out of production.
   Do not deploy either saved HTML page as a replacement for a server page.
5. Optional: include `demo/show-sources.js` and its CSS if source highlighting
   is also desired on the real page. It does not change report amounts.

The original view values are `1` for Commission and `0` for Share.

### Named source totals

Add these attributes to the appropriate report total cells and preserve them
when returning updated HTML from the backend:

- Commission 2D riel: `data-total="2d-khr"`
- Commission 2D USD: `data-total="2d-usd"`
- Commission 3D riel: `data-total="3d-khr"`
- Commission 3D USD: `data-total="3d-usd"`
- Share result riel: `data-total="result-khr"`
- Share result USD: `data-total="result-usd"`

Example: `<th class="classtd" data-total="2d-khr">1,242,000</th>`.

The calculator supports existing column positions as a fallback: 11 cells
for the Commission report and 13 for Share. Update the mapping if the backend
changes that structure. Riel and USD are never converted or added together.
Calculator results do not adjust the original report balances.

## Repository contents

Original browser downloads and the old handoff ZIP are stored outside this
project in a sibling backup folder. This project contains captured report
amounts and customer labels; use a private repository or anonymize them before
sharing more broadly. Git does not publish or deploy the real website.

## Sources across the two pages

The November 1 date in either payment report links to the saved daily result
page. Matching colors identify its raw 2D/3D amounts for Commission or its
rounded daily result for Share. Use the payment menu link to return to the
same calculator view. Only November 1 has a captured detail page.

The Commission report totals sum the raw daily amounts across the date range.
The Share report uses rounded daily results: on November 1 this is 948,700៛,
while the detail's unrounded intermediate result is 948,740៛. Do not use that
intermediate result as the Share source. The links explain the captured data;
editing local demo values does not alter the separate saved result snapshot.
`demo/result-sources.js` and `demo/cross-sources.css` are demo-only additions.

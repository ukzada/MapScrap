# Scrapify

<p align="center">
  <img src="assets/brand/scrapify-mark.svg" alt="Scrapify mark" width="84" />
</p>

<p align="center">
  <strong style="font-size: 32px;">Scrapify</strong>
</p>

<p align="center">
  <strong>SCRAPE . ENRICH . EXPORT</strong>
</p>

<p align="center">
  Google Maps lead workflow for focused data collection in a Manifest V3 Chrome extension.
</p>




## Why People Use Scrapify

- No build pipeline. Load the repository directly into Chrome and start using it.
- Focused Google Maps scraping with filters for rating, review count, website, phone, and email availability.
- Deep website enrichment that checks the homepage first, prioritizes contact-style pages, and selectively explores internal links.
- Parallel enrichment workers, with support for up to `6` concurrent workers.
- Challenge-aware enrichment that can wait for manual CAPTCHA resolution or skip challenged tabs for unattended runs.
- Built-in results viewer for live review, CSV import/export, and manual follow-up tracking.
- Session and UI persistence in `chrome.storage.local`, with regular and incognito sessions kept separate.

## What Scrapify Captures

- From Google Maps: place ID, business name, rating, review count, category, address, hours, Maps URL, website, listing phone, and Facebook link when available.
- From website enrichment: unified best email and phone fields, raw owner/contact details, source URLs, confidence metadata, and crawl status details.

## Installation

There is no build step.

1. Open Chrome and go to `chrome://extensions/`.
2. Turn on `Developer mode`.
3. Click `Load unpacked`.
4. Select this repository folder.
5. Optional: enable `Allow in Incognito` if you want isolated incognito runs too.

## Quick Start

1. Open Google Maps and run a search such as `dentists in chicago`.
2. Click the Scrapify extension icon to open the control panel.
3. Set `Max rows` and any lead filters you want.
4. Optional: enable `Enrich websites (Deep Crawl)` to collect emails and phone numbers from public sites.
5. Choose your preferred email and phone output mode.
6. Click `Start Scrape`.
7. Open `Viewer` to review the run and export CSV.

## Enrichment, Workers, and CAPTCHA

### Website enrichment

When `Enrich websites` is enabled, Scrapify continues after the Maps scrape and scans public business websites for contact data. The crawl is intentionally focused:

- homepage first
- contact, about, team, and careers routes first
- selective internal link exploration after that
- Facebook fallback when useful contact details are still missing

Use `Collect emails` and `Collect phone numbers` to narrow the goal, and switch `Email columns` / `Phone columns` between best-only exports and raw detail exports.

### Parallel workers

Scrapify now supports concurrent enrichment workers.

- `Parallel workers` controls how many enrichment tabs run at once.
- The default is `3`, and the current max is `6`.
- More workers can speed up large runs, but they also increase the chance of anti-bot checks and CAPTCHAs.

### CAPTCHA and challenge handling

Challenges are normal during enrichment. Depending on the site or provider, a CAPTCHA or verification page can appear after only a small number of rows or tabs.

For the best data yield:

- Keep `Challenge handling` on `Try once, then wait (rec.)`.
- Leave `Keep going while waiting` on `1 more worker (rec.)` or raise it if you want limited parallel progress while one tab is blocked.
- When Scrapify shows `CAPTCHA needs your attention`, use the `Focus` action in the control panel, solve the challenge in that tab, and Scrapify will resume automatically when the page clears.

If you do not want manual intervention, change the challenge setting before you start the run:

- `Try once, then skip` keeps the run mostly automatic and skips challenged tabs after one automatic checkbox attempt.
- `Skip immediately` keeps the run fully automatic and never waits on a challenge.

## Results Viewer

The built-in viewer is a separate extension page for review and export.

It can:

- show live run data
- open a saved run view
- import an existing CSV
- export the current dataset back to CSV
- resize and auto-fit columns
- add a final tracking checkbox column that you can rename to something like `Contacted` or `Qualified`

For large runs, the browser table previews the first `1000` rows for performance, but CSV export uses the full loaded dataset.

## Permissions

Scrapify requests these permissions because they are required for the workflow above:

| Permission | Why it is needed |
| --- | --- |
| `activeTab` | Starts a scrape from the current Google Maps tab. |
| `tabs` | Opens and manages the control panel, results viewer, and enrichment tabs. |
| `storage` | Saves settings, sessions, rows, and selected export columns. |
| `downloads` | Saves exported CSV files. |
| `scripting` | Runs extraction and enrichment logic in tabs. |
| host access to `https://www.google.com/maps/*` | Reads Google Maps results. |
| host access to `http://*/*` and `https://*/*` | Visits public websites during enrichment. |

## Limitations

- Works on `https://www.google.com/maps/*` only in the current build.
- You need to start from a Google Maps search results page, not an arbitrary website tab.
- Google Maps DOM changes can break selectors and require code updates.
- Website enrichment is best-effort and depends on publicly visible contact data.
- Some sites block automation, loading, or script access; those rows are skipped or marked accordingly.
- The current selector strategy is English-leaning, so some localized Maps UIs may be less reliable.
- Only one active scrape/enrichment run should be treated as authoritative at a time.
- Regular and incognito sessions are intentionally isolated from each other.


## Compliance

You are responsible for using this extension in a way that complies with Google Maps terms, the target sites' terms, local law, privacy obligations, and your own data-handling requirements.

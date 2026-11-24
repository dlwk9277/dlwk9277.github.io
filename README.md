# Jie: freelance website

Live site: **https://dlwk9277.github.io/**

Plain HTML, CSS and JavaScript. There's no build step: what's in this folder is exactly what GitHub Pages serves.

```
index.html        The main page (all sections)
privacy.html      Privacy notice (Meta Pixel + WhatsApp)
404.html          "Page not found" page
js/config.js      ← YOUR SETTINGS: WhatsApp, prices, Instagram, Pixel, portfolio
js/site.js        Site behaviour (you normally don't need to touch this)
css/style.css     All styling
assets/           Images, icons, fonts, social share image
robots.txt, sitemap.xml   For Google
```

Almost everything you'll want to change lives in **`js/config.js`**. Open it in any text editor. Keep the quotes `""` and the commas at the end of lines.

---

## 1. Add your photo

1. Choose a friendly, well-lit photo of yourself: head and shoulders, plain background.
2. Crop it to **portrait shape, about 6:7** (for example **600 × 700 pixels**). Keep it under **200 KB**. You can resize and compress it for free at [squoosh.app](https://squoosh.app).
3. Name it exactly **`darren.jpg`** (lowercase).
4. Put it in the **`assets`** folder: `assets/darren.jpg`.
5. Push to GitHub (step 6).

Until the photo exists, the contact section shows a blue "DL" monogram instead.

## 2. Add your Instagram handle

In `js/config.js`, find:

```js
instagramHandle: "",
```

Type your handle **without the @**:

```js
instagramHandle: "jiebuilds",
```

The Instagram link appears in the footer automatically. While it's empty, the link stays hidden.

## 3. Set up the Meta Pixel (for Instagram ads)

The Pixel lets Meta tell you which ads lead to WhatsApp messages. The site fires a **`Contact`** event every time someone taps any WhatsApp button.

**Create the Pixel**
1. Go to [business.facebook.com/events_manager](https://business.facebook.com/events_manager) (Meta Events Manager). Log in with the account that runs your ads.
2. Click **Connect data sources**, choose **Web**, then **Meta Pixel**, and give it a name (e.g. "Jie website").
3. When it asks for your website, enter `https://dlwk9277.github.io`. When it offers ways to install the code, **choose to install the code manually**, then close the setup. You don't need to copy its code, because the site already includes it.
4. Your **Pixel ID** is the long number shown under the Pixel's name in Events Manager (for example `123456789012345`).

**Paste it into the site**

In `js/config.js`, change:

```js
metaPixelId: "YOUR_PIXEL_ID",
```

to your number (keep the quotes):

```js
metaPixelId: "123456789012345",
```

Push to GitHub (step 6). While it still says `YOUR_PIXEL_ID`, the Pixel does **not** load at all.

**Check it works**
1. Install the free **Meta Pixel Helper** extension for Chrome.
2. Open https://dlwk9277.github.io/ and click the extension icon. You should see your Pixel ID with a **PageView** event.
3. Tap any WhatsApp button. Pixel Helper should now also show a **Contact** event.
4. In Events Manager, the **Test events** tab shows events live as you browse.

When you set up an ad campaign aimed at messages or leads, choose this Pixel and the **Contact** event as the conversion.

## 4. Change prices, packages or WhatsApp messages

All in `js/config.js`:

- **Prices:** only two prices are ever shown, Starter and Business, in the `packages` list. `price` is the sale price and `oldPrice` is the full price. Type plain numbers with no `S$` and no commas. Keep every price between S$150 and S$300.
- **Calculator options:** the `calculator` block. `groups` sets the headings (Get found, Tools, Automation); each option has a `group` and a `needs` (the package it belongs to). Options that need a bigger package show the difference live (e.g. "+S$100"). `free: true` adds a small "free" tag (simple tools and chatbots are built free). `extra: 250` is the complex n8n automation add-on: it is shown on its own line ("+ S$250"), never added into the big price.
- **Care Plan:** the `carePlan` block (`pricePerMonth`). It is mentioned in the FAQ in `index.html`; update the FAQ answer if you change the price.
- **Other WhatsApp messages:** the `whatsappMessages` block. `hero` is the top button, `contact` is the bottom section, and `floating` is the round phone button. Write them normally; the site handles the link encoding.
- **WhatsApp number:** `whatsappNumber: "6592778104"`, as country code + number, digits only. This updates every button and the number shown on the page. If you ever change it, also find-and-replace `6592778104` and `+65 9277 8104` in `index.html`, `privacy.html` and `404.html` (fallback links and Google's business details). The comment in `config.js` lists the exact spots.

> If you change the starting price, also update the starting price (currently `S$150`) in the `<meta name="description">` line, the `priceRange` near the top of `index.html`, and the FAQ answer that mentions the Care Plan price. The share image `assets/og-image.png` also shows the Starter price; its source is kept outside this repo (`~/sites/brand/og/`), so ask for a re-render. After changing the image, bump `?v=` on the `og:image` and `twitter:image` lines so WhatsApp and Facebook fetch the new one.

### Sale calendar (the discount changes by itself)

The discount is shown as the current Singapore sale: "Christmas sale: from S$150 (was S$200) · until 31 Dec", in the blue bar that floats at the top of the page while visitors scroll, and as the crossed-out price in the calculator. The site picks the sale from today's date (Singapore time), so you don't need to change anything when a sale ends.

- The list is `saleEvents` in `js/config.js`. Each line has a name, a first day and a last day.
- It runs to the end of 2027. **Before it runs out, add next year's sales** (copy a line, change the name and dates).
- Chinese New Year, Hari Raya and Deepavali move every year: check the dates on mom.gov.sg ("public holidays").
- **One full month a year has no sale** (July 2027, no public holiday or festival): the site shows the full original prices with no discount, so the "usual price" is a real price. Keep a month like this when you add next year's sales, ideally before the sales that follow. Any day not on the list also shows full prices.

### Price calculator

Visitors pick what they need and see the lowest package that covers it, with the sale price. The button sends their picks to you on WhatsApp. The options are `calculator` in `js/config.js` (see section 4).

## 5. Turn on testimonials (when you have real ones)

Only use **real** words from **real** clients, with their permission.

1. Open `index.html` and search for `TESTIMONIALS`.
2. Delete the line `<!-- TESTIMONIALS: enable when ...` **and** the `-->` line at the end of that block.
3. Replace `Paste the client's exact words here.`, `Client name` and `Business name` with the real details. Copy or delete a `<figure class="quote">…</figure>` block to add or remove a review.
4. Push to GitHub.

## 6. Push updates to GitHub and check the live site

From this folder on the server:

```bash
cd ~/dlwk9277.github.io
git add -A
git commit -m "Describe what you changed"
git push
```

Then:
1. Open **github.com/dlwk9277/dlwk9277.github.io**, go to the **Actions** tab, and wait for the "pages build and deployment" run to turn green (usually 1–2 minutes).
2. Open https://dlwk9277.github.io/ and refresh. If you still see the old version, do a hard refresh (Ctrl+Shift+R) or open it in a private window, because browsers cache pages.

You can also just ask Claude Code to "push my website changes".

## 7. Add a real project to "Recent work"

The **Recent work** section stays hidden until you add at least one project.

1. Take a screenshot of the client's site (ideally **1200 × 900**, under 250 KB) and save it as e.g. `assets/work/tan-aircon.jpg`. Create the `work` folder if it doesn't exist.
2. In `js/config.js`, find `projects: [` and add an entry:

```js
projects: [
  { name: "Tan Aircon Services", type: "Aircon servicing · Website + quote calculator", image: "assets/work/tan-aircon.jpg", url: "https://tanaircon.sg" },
],
```

3. Push to GitHub. The section and its card appear automatically. Add more entries (one per line, each ending with a comma) for more projects.

Only list work you actually did, and ask the client before showing their site.

## 8. Animations (how they work, how to turn them off)

The page has a dark theme with light motion. "More enquiries" has a marker-pen highlight that sweeps in at the start, wipes away as you scroll down and comes back as you scroll up. Headings slide up word by word, sections fade in as you scroll, and the before/after slider gives one small nudge the first time it's on screen.

- **Colours:** all in `:root` at the top of `css/style.css`. Ink black and paper white do most of the work. `--accent` (soft blue) is used as a solid colour (sale bar, quote card, picked options), never as a glow; `--accent-deep` (pen blue) is only the highlight behind "More enquiries". Keep it flat: no glows, gradients or grid backdrops.
- The rest of the motion lives at the bottom of `css/style.css` (the **MOTION** part) and `js/site.js` (the **MOTION** part).
- Visitors whose phone is set to "reduce motion" get a still page. So does anyone without JavaScript.
- **To switch all motion off:** in `index.html`, delete the small `<script>` block near the top that says `h.classList.add("motion")`.
- **Drag to compare:** the "before" (an old static site) and "after" (a clean site) in the browser window are drawn in `index.html` (search for `Same business`). They're an illustration, labelled "Example only".

## 9. Credits

- **Fonts:** [Archivo](https://fonts.google.com/specimen/Archivo) and [Atkinson Hyperlegible Next](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next), from Google Fonts under the SIL Open Font License. They're served from `assets/fonts/`, so visitors' browsers don't contact Google.
- **WhatsApp and Instagram icons:** [Simple Icons](https://simpleicons.org) (CC0). WhatsApp and Instagram are trademarks of Meta.
- **Images:** no stock photos are used. The browser-window mockup, social share image and icons were made for this site.

---

## After launch: free steps that help you get found

1. **Google Search Console:** go to [search.google.com/search-console](https://search.google.com/search-console), add `https://dlwk9277.github.io/` as a URL-prefix property, verify it (the HTML tag method works: send the tag to Claude Code to add), then submit `sitemap.xml`.
2. **Google Business Profile:** create one for yourself as a **service-area business** in Singapore (hide your home address), category "Website designer", and link this site.
3. **Your own domain** (optional, about S$20–60 a year): looks more professional and builds search authority you keep. If you add one, update the `https://dlwk9277.github.io` addresses in `index.html`, `privacy.html`, `robots.txt` and `sitemap.xml`.
4. **Instagram:** once you set your handle, also add it to the `JSON-LD` block near the top of `index.html` as `"sameAs": ["https://www.instagram.com/yourhandle/"]`.

## Notes for hosting at a different address

All links are relative, so the site also works at `username.github.io/repo-name/`. Only the **404 page** needs a tweak there: open `404.html` and change `var HOME = "/";` to `var HOME = "/repo-name/";`.

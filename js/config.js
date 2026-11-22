/* =====================================================================
   SITE SETTINGS — edit this file to change your details.
   ---------------------------------------------------------------------
   Rules for editing safely:
   - Keep the quotes "" around text.
   - Keep the commas at the end of each line inside { } and [ ].
   - Save the file, then push to GitHub (see README.md step 6).
   ===================================================================== */

window.SITE_CONFIG = {

  /* ---------- WhatsApp -------------------------------------------------
     Country code + number, digits only. No "+", no spaces.
     This updates every WhatsApp button and the number shown on the page.
     If you CHANGE your number, also replace 6592778104 / +65 9277 8104 in:
       - index.html  (the links' fallback addresses, and "telephone" +
                      "url" in the JSON-LD block near the top)
       - privacy.html (fallback link)
       - 404.html     (its WhatsApp link)
     Tip: use your editor's "Find and replace" for 6592778104.        */
  whatsappNumber: "6592778104",

  /* Pre-filled messages. Each WhatsApp button uses one of these.
     Write them normally; the site handles the link encoding for you.  */
  whatsappMessages: {
    general:  "Hi Darren, I saw your website. I'm interested in a website for my business.",
    hero:     "Hi Darren, I saw your website. I'm interested in a website for my business.",
    packages: "Hi Darren, I saw your packages. Can you help me choose the right one for my business?",
    contact:  "Hi Darren, I saw your website. I'd like to chat about a website for my business.",
    floating: "Hi Darren, I saw your website. I'm interested in a website for my business.",
    preview:  "Hi Darren, I'd like a free design preview for my business."
  },

  /* ---------- Instagram -------------------------------------------------
     Your handle WITHOUT the @, e.g. "darrenlee.web".
     Leave as "" and the Instagram link stays hidden.                   */
  instagramHandle: "",

  /* ---------- Meta Pixel ------------------------------------------------
     Paste your Pixel ID (a long number, e.g. "123456789012345").
     While it says "YOUR_PIXEL_ID" the pixel does NOT load.             */
  metaPixelId: "YOUR_PIXEL_ID",

  /* ---------- SALE CALENDAR ---------------------------------------------
     The discount is shown as the current Singapore sale, picked by date
     automatically (Singapore time). No need to edit the site each time.
     - name: shown on the site, e.g. "Christmas sale: 50% off until 31 Dec"
     - from / to: first and last day, written "YYYY-MM-DD"
     Add next year's sales before the list runs out.
     The sale banner floats at the top of the page during a sale.
     On any day with NO sale, the banner is hidden and the site shows the
     full original prices (oldPrice) with no discount. Keep one such week every year (this
     year: 5-11 Apr 2027) so the original price is a real price.
     Lunar dates (Chinese New Year, Hari Raya, Deepavali) move every year:
     check them on mom.gov.sg ("public holidays").                       */
  saleEvents: [
    { name: "Black Friday sale",      from: "2026-11-20", to: "2026-11-30" },
    { name: "12.12 sale",             from: "2026-12-01", to: "2026-12-12" },
    { name: "Christmas sale",         from: "2026-12-13", to: "2026-12-31" },
    { name: "New Year sale",          from: "2027-01-01", to: "2027-01-20" },
    { name: "Chinese New Year sale",  from: "2027-01-21", to: "2027-02-20" },  /* CNY 6-7 Feb 2027 */
    { name: "Hari Raya sale",         from: "2027-02-21", to: "2027-03-20" },  /* Hari Raya Puasa 10 Mar 2027 */
    { name: "Easter sale",            from: "2027-03-21", to: "2027-04-04" },  /* Good Friday 26 Mar 2027 */
    /* 5-11 Apr 2027: no sale. Full (original) prices for one week a year. */
    { name: "Labour Day sale",        from: "2027-04-12", to: "2027-05-15" },
    { name: "Vesak Day sale",         from: "2027-05-16", to: "2027-05-31" },
    { name: "Great Singapore Sale",   from: "2027-06-01", to: "2027-07-31" },
    { name: "National Day sale",      from: "2027-08-01", to: "2027-08-31" },
    { name: "9.9 sale",               from: "2027-09-01", to: "2027-09-09" },
    { name: "Mid-Autumn sale",        from: "2027-09-10", to: "2027-09-30" },  /* Mid-Autumn 15 Sep 2027 */
    { name: "10.10 sale",             from: "2027-10-01", to: "2027-10-10" },
    { name: "Deepavali sale",         from: "2027-10-11", to: "2027-10-31" },  /* check: about 28 Oct 2027 */
    { name: "11.11 sale",             from: "2027-11-01", to: "2027-11-19" },
    { name: "Black Friday sale",      from: "2027-11-20", to: "2027-11-30" },
    { name: "12.12 sale",             from: "2027-12-01", to: "2027-12-12" },
    { name: "Christmas sale",         from: "2027-12-13", to: "2027-12-31" }
  ],

  /* ---------- PRICE CALCULATOR + PACKAGES -------------------------------
     Only two prices are ever shown: Starter and Business.
     - price: the price during a sale. oldPrice: the full price (no sale).
       Prices are plain numbers in S$ (no "S$", no commas).
     - The calculator shows the LOWEST package that covers what the visitor
       picked. "needs" is the package id. Packages count as bigger the
       further down the list they are.
     - free: true shows a small "free" tag. Simple tools and chatbots are
       built free inside either package.
     - extra: a fixed add-on in S$ (complex n8n automation). It is shown on
       its own line, never added into the big number, so the headline price
       stays between S$150 and S$300.                                    */
  packages: [
    { id: "starter",  name: "Starter",  price: 150, oldPrice: 300 },
    { id: "business", name: "Business", price: 250, oldPrice: 300 }
  ],

  calculator: {
    /* The two site sizes. Each shows its price.
       selected: true = picked when the page opens (only one). */
    sizes: [
      { label: "One page",                hint: "Services, prices, photos, WhatsApp", needs: "starter" },
      { label: "A page for each service", hint: "4 to 6 pages",                       needs: "business", selected: true }
    ],
    /* Option groups, in the order shown. hint = small line under the group name. */
    groups: [
      { id: "found", label: "Get found" },
      { id: "tools", label: "Tools that answer customers", hint: "Free with any package" },
      { id: "auto",  label: "Automation" }
    ],
    /* Each option: group, needs (package id), and free: true or extra: 250.
       Options that need a bigger package show the price difference, e.g. "+S$100". */
    extras: [
      { label: "Photo gallery",          group: "found", needs: "starter" },
      { label: "Google Maps",            group: "found", needs: "business" },
      { label: "Google SEO",             group: "found", needs: "business" },
      { label: "Quote calculator",       group: "tools", free: true, needs: "starter" },
      { label: "Booking form",           group: "tools", free: true, needs: "starter" },
      { label: "WhatsApp auto-reply",    group: "tools", free: true, needs: "starter" },
      { label: "Chatbot",                group: "tools", free: true, needs: "starter" },
      { label: "Complex n8n automation", group: "auto",  extra: 250,  needs: "starter",
        hint: "Leads into Google Sheets, invoices, reminders, AI replies" }
    ],
    extraNote: "quoted on its own, confirmed on WhatsApp",
    message: "Hi Darren, I used your price calculator. I'd like the {package} package (from S${price}) with: {items}. Can we chat?"
  },

  /* Optional monthly add-on (mentioned in the FAQ). */
  carePlan: {
    name: "Care Plan",
    pricePerMonth: 50
  },

  /* ---------- PORTFOLIO (your real projects) ----------------------------
     Leave empty [] and the "Recent work" section stays hidden.
     To add a project, copy this example, remove the // at the start of
     each line, and fill it in. Put the screenshot in /assets/work/.

     {
       name: "Example Aircon Co.",
       type: "Aircon servicing · Website + quote calculator",
       image: "assets/work/example-aircon.jpg",
       url: "https://example.com"
     },
  */
  projects: [
    // { name: "", type: "", image: "assets/work/your-image.jpg", url: "https://" },
  ]
};

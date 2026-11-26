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
    general:  "Hi Jie, I saw your website. I'm interested in a website for my business.",
    hero:     "Hi Jie, I saw your website. I'm interested in a website for my business.",
    packages: "Hi Jie, I saw your packages. Can you help me choose the right one for my business?",
    contact:  "Hi Jie, I saw your website. I'd like to chat about a website for my business.",
    floating: "Hi Jie, I saw your website. I'm interested in a website for my business.",
    preview:  "Hi Jie, I'd like a free design preview for my business."
  },

  /* ---------- Instagram -------------------------------------------------
     Your handle WITHOUT the @, e.g. "darrenlee.web".
     Leave as "" and the Instagram link stays hidden.                   */
  instagramHandle: "jiebuilds",

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
     full original prices (oldPrice) with no discount. Keep one full-price month every year (this
     year: July 2027, no festivities) so the original price is a real price.
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
    { name: "Labour Day sale",        from: "2027-04-05", to: "2027-05-15" },
    { name: "Vesak Day sale",         from: "2027-05-16", to: "2027-05-31" },
    { name: "Great Singapore Sale",   from: "2027-06-01", to: "2027-06-30" },
    /* July 2027: no sale. Full (original) prices for the whole month (no public holiday or festival). */
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
     Four packages: Starter, Business, Business + Tool (1 to 3 tools) and Business + Tools (4 to 7).
     - price: the price during a sale. oldPrice: the full price (no sale).
       Prices are plain numbers in S$ (no "S$", no commas).
     - The calculator shows the LOWEST package that covers what the visitor
       picked. "needs" is the package id. Packages count as bigger the
       further down the list they are.
     - free: true shows a small "free" tag. Simple tools and chatbots are
       built free inside either package.
     - extra: a fixed add-on in S$ (complex n8n automation). It is shown on
       its own line, never added into the big number, so the headline price
       stays between S$250 and S$1500.                                    */
  packages: [
    { id: "starter",  name: "Starter",          price: 250,  oldPrice: 350 },
    { id: "business", name: "Business",         price: 300,  oldPrice: 400 },
    { id: "tool",     name: "Business + Tool",  price: 1000, oldPrice: 1500 },   /* 1 to 3 tools */
    { id: "tools",    name: "Business + Tools", price: 1500, oldPrice: 2200 }    /* 4 to 7 tools */
  ],

  calculator: {
    /* The site sizes. Each shows its price.
       selected: true = picked when the page opens (only one). */
    sizes: [
      { label: "One page",                hint: "Services, prices, photos, WhatsApp", needs: "starter" },
      { label: "A page for each service", hint: "4 to 6 pages",                       needs: "business", selected: true },
      { label: "Business site + tools",   hint: "Pick your tools below",              needs: "tool" }
    ],
    /* Price by number of tools picked in the group below: 1 to 3 tools = "tool" package,
       4 to 7 = "tools" package, 8 or more = quoted on WhatsApp (shown at the top price). */
    toolTiers: {
      group: "tools",
      tiers: [ { max: 3, needs: "tool" }, { max: 7, needs: "tools" } ],
      overNote: "8 or more tools: I quote the extra on WhatsApp"
    },
    /* Option groups, in the order shown. hint = small line under the group name. */
    groups: [
      { id: "found", label: "Get found" },
      { id: "tools", label: "Tools that answer customers", hint: "Up to 3 tools S$1,000 · up to 7 tools S$1,500" }
    ],
    /* After launch: the customer picks one plan (or self-host). Shown as three cards under the site size.
       monthly = S$ per month. selected: true = picked when the page opens (only one).
       The monthly total = the plan + the "monthly" price of every automation ticked below. It is
       shown on its own line under the quote, never added into the big price. Extra edits are
       hosting.extraEditPrice on either plan. */
    plansLabel: "After launch",
    plansHint: "Extra edits are S$50 each on either plan",
    plans: [
      { label: "Self-host", hint: "Free. You host it with my setup guide", monthly: 0 },
      { label: "Hosting",   hint: "Hosting, SSL and basic backups. No edits included", monthly: 50 },
      { label: "Full care", hint: "Hosting, updates, support and 2 edits a month, all handled by me", monthly: 150, selected: true }
    ],
    /* Each option: group, needs (package id), optional monthly (S$ per month).
       Options that need a bigger package show the price difference, e.g. "+S$700".
       monthly: 50 marks an automation (S$50 a month on either plan). */
    extras: [
      { label: "Photo gallery",          group: "found", needs: "starter" },
      { label: "Google Maps",            group: "found", needs: "business" },
      { label: "Google SEO",             group: "found", needs: "business" },
      { label: "Quote calculator",       group: "tools", needs: "tool" },
      { label: "Booking form",           group: "tools", needs: "tool" },
      { label: "Job roster for your team", group: "tools", needs: "tool",
        hint: "Who goes to which job, and when" },
      { label: "WhatsApp auto-reply",    group: "tools", needs: "tool", monthly: 50 },
      { label: "Chatbot",                group: "tools", needs: "tool", monthly: 50 },
      { label: "Staff leave tracker",    group: "tools", needs: "tool", monthly: 50,
        hint: "HR: leave requests and balances" },
      { label: "Attendance clock-in",    group: "tools", needs: "tool", monthly: 50,
        hint: "HR: staff clock in from their phone" },
      { label: "Claims and commission",  group: "tools", needs: "tool", monthly: 50,
        hint: "HR: staff claims, commission and payslip sums" },
      { label: "Complex n8n automation", group: "tools", needs: "tool", monthly: 50,
        hint: "Leads into Google Sheets, invoices, reminders, AI replies" }
    ],
    extraNote: "quoted on its own, confirmed on WhatsApp",
    message: "Hi Jie, I used your price calculator. I'd like the {package} package (from S${price}) with: {items}.{plan} Can we chat?"
  },

  /* Monthly plans, for reference (the calculator reads calculator.plans above; the FAQ text in
     index.html and js/i18n.js repeats these numbers). Replaces the old Care Plan. */
  hosting: {
    hostingPerMonth: 50,          /* hosting, SSL, basic backups, no edits */
    fullCarePerMonth: 150,        /* hosting, SSL, backups, updates, support, 2 edits a month */
    editsIncludedInFullCare: 2,
    extraEditPrice: 50,           /* on either plan */
    perAutomationPerMonth: 50     /* on either plan */
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
    // type/cta: English. typeZh/ctaZh: Chinese. Say "Free preview" until the owner has paid; OneStop is live on its own domain.
    {
      name: "OneStop Cooling",
      type: "Aircon servicing, Sengkang. Live website with a price calculator.",
      typeZh: "盛港冷气保养。含价格计算器的已上线网站。",
      cta: "Visit the site",
      ctaZh: "访问网站",
      image: "assets/work/onestop-cooling.webp",
      url: "https://onestopcooling.online/"
    }
  ]
};

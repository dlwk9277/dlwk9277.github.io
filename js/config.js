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

  /* ---------- REFER A FRIEND --------------------------------------------
     amount: S$ off for the friend, and the same S$ sent to the referrer.
     Stacks with any sale. 0 hides the banner strip and the calculator note.
     The terms are in the FAQ (index.html and the aircon / plumber pages):
     update them there if the amount or rules change.                    */
  referral: { amount: 100 },

  /* ---------- SALE CALENDAR ---------------------------------------------
     The discount is shown as the current Singapore sale, picked by date
     automatically (Singapore time). No need to edit the site each time.
     - name: shown on the site, e.g. "Christmas sale"
     - from / to: first and last day, written "YYYY-MM-DD"
     Add next year's sales before the list runs out.
     The banner floats at the top of the page. On any day with NO sale it names
     the next sale and its start date, and the site shows and charges the full
     original prices (oldPrice), so the original price stays a real price.
     Lunar dates (Chinese New Year, Hari Raya, Deepavali) move every year:
     check them on mom.gov.sg ("public holidays").                       */
  saleEvents: [
    /* Big events run about a month, small events one week. Days between sales are full price
       (oldPrice): quote and charge that price then, so the "was" price stays real. */
    { name: "Black Friday sale",     from: "2026-11-24", to: "2026-11-30" },
    { name: "Christmas sale",        from: "2026-12-01", to: "2026-12-31" },
    { name: "Chinese New Year sale", from: "2027-01-08", to: "2027-02-07" },  /* CNY 6-7 Feb 2027 */
    { name: "Hari Raya sale",        from: "2027-02-11", to: "2027-03-11" },  /* Hari Raya Puasa 10 Mar 2027 */
    { name: "Easter sale",           from: "2027-03-22", to: "2027-03-28" },  /* Good Friday 26 Mar 2027 */
    { name: "Labour Day sale",       from: "2027-04-26", to: "2027-05-02" },
    { name: "Vesak Day sale",        from: "2027-05-17", to: "2027-05-23" },
    { name: "Great Singapore Sale",  from: "2027-06-01", to: "2027-06-30" },
    { name: "National Day sale",     from: "2027-08-01", to: "2027-08-31" },
    { name: "9.9 sale",              from: "2027-09-03", to: "2027-09-09" },
    { name: "Mid-Autumn sale",       from: "2027-09-13", to: "2027-09-19" },  /* Mid-Autumn 15 Sep 2027 */
    { name: "10.10 sale",            from: "2027-10-04", to: "2027-10-10" },
    { name: "Deepavali sale",        from: "2027-10-23", to: "2027-10-29" },  /* check: about 28 Oct 2027 */
    { name: "11.11 sale",            from: "2027-11-05", to: "2027-11-11" },
    { name: "Black Friday sale",     from: "2027-11-22", to: "2027-11-28" },
    { name: "Christmas sale",        from: "2027-12-01", to: "2027-12-31" }
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
       stays between S$500 and S$4400.                                    */
  packages: [
    { id: "starter",  name: "Starter",          price: 500,  oldPrice: 700 },
    { id: "business", name: "Business",         price: 600,  oldPrice: 800 },
    { id: "tool",     name: "Business + Tool",  price: 2000, oldPrice: 3000 },   /* 1 to 3 tools */
    { id: "tools",    name: "Business + Tools", price: 3000, oldPrice: 4400 }    /* 4 to 7 tools */
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
      { id: "tools", label: "Tools that answer customers", hint: "Up to 3 tools {tool} · up to 7 tools {tools}" }   /* {tool}, {tools} = today's package price */
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

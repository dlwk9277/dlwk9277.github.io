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

  /* ---------- PACKAGES & PRICES -----------------------------------------
     Change names, prices and what's included here.
     - price: a number in S$ (no "S$", no commas), e.g. 1500
     - featured: true puts the "Most popular" tag on that package
     - message: the WhatsApp message for that package's button        */
  packages: [
    {
      id: "starter",            /* a short unique label, no spaces */
      name: "Starter",
      price: 300,
      bestFor: "New businesses that need to look legit online, fast.",
      includes: [
        "One-page website",
        "Your services, clearly listed",
        "Photo gallery of your work",
        "WhatsApp button on every screen",
        "Looks right on every phone",
        "Free hosting"
      ],
      featured: false,
      message: "Hi Darren, I'm interested in the Starter package."
    },
    {
      id: "business",
      name: "Business",
      price: 500,
      bestFor: "Established businesses that want more enquiries from Google.",
      includes: [
        "4 to 6 pages",
        "A page for each main service",
        "Project gallery",
        "Google Maps on your contact page",
        "Basic SEO setup",
        "Google Business Profile setup",
        "Free hosting"
      ],
      featured: true,
      message: "Hi Darren, I'm interested in the Business package."
    },
    {
      id: "business-tool",
      name: "Business + Tool",
      price: 1000,
      bestFor: "Businesses that get the same questions every day.",
      includes: [
        "Everything in Business",
        "A custom tool or automation, such as a quote calculator, booking flow or WhatsApp auto-reply",
        "Enquiries arrive on your WhatsApp with the details filled in",
        "Free hosting"
      ],
      featured: false,
      message: "Hi Darren, I'm interested in the Business + Tool package."
    }
  ],

  /* Optional monthly add-on shown under the packages. */
  carePlan: {
    name: "Care Plan",
    pricePerMonth: 50,
    description: "Text changes, new photos, price updates and small fixes whenever you need them. Optional.",
    message: "Hi Darren, I'd like to know more about the Care Plan."
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

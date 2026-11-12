// lib/blog.js
// Blog posts and their JSON-LD. Post bodies are structured blocks (no HTML strings), rendered by
// components/blog/PostBody.jsx. No JSX and relative imports only, so `node --test` can load this file.
//
// Block types:
//   { type: "p", text }                       paragraph
//   { type: "h2", id, text }                  section heading; listed in the table of contents
//   { type: "h3", text }                      sub-heading
//   { type: "ul", items: [text] }             bullet list
//   { type: "template", columns, rows }       the fillable two-column template table; rows: [{ label, bold? }]
//   { type: "table", caption, columns, rows: [{ cells, bold? }], note?, align? }  a filled-in table (worked
//                                             example); cells[0] is the row label
//   { type: "download", href, label }         a file download button
//   { type: "mistakes", items: [{ title, text }] }  numbered list with a bold lead-in per item
//
// Structured data, like lib/structured-data.js, never carries ratings, reviews or prices.

import { getSiteUrl } from "./site.js";

const CONTEXT = "https://schema.org";

/** Fields of the trip sheet template, in order. Shared by the post's table and the Excel generator. */
export const TRIP_SHEET_FIELDS = [
  { label: "Trip sheet no." },
  { label: "Date" },
  { label: "Customer" },
  { label: "Vehicle no." },
  { label: "Driver name & mobile" },
  { label: "From → To" },
  { label: "Departure (date/time)" },
  { label: "Arrival (date/time)" },
  { label: "Opening km" },
  { label: "Closing km" },
  { label: "Total km" },
  { label: "Goods / passengers" },
  { label: "Weight / quantity" },
  { label: "LR no." },
  { label: "E-way bill no." },
  { label: "Diesel (litres / ₹)" },
  { label: "Toll (₹)" },
  { label: "Loading / unloading (₹)" },
  { label: "Driver bata (₹)" },
  { label: "Other expenses (₹)" },
  { label: "Total expenses (₹)", bold: true },
  { label: "Advance given (₹)" },
  { label: "Balance (₹)" },
  { label: "Freight amount (₹)" },
  { label: "POD received? (Yes / No)" },
  { label: "Driver signature" },
  { label: "Office signature" }
];

export const TRIP_SHEET_DOWNLOAD = "/downloads/trip-sheet-template.xlsx";

export const BLOG_POSTS = [
  {
    // A buyer's guide, so it doesn't compete with the product page for "fleet management software
    // India" (that page's H1 is the keyword itself): this post answers what owners research before
    // buying and sends them to /fleet-management-software. Everything said about ZUGEE Fleet is
    // backed by lib/product-pages/fleet.js; the rest is general advice, not claims.
    slug: "fleet-management-software-buyers-guide",
    published: true,
    title: "Fleet Management Software in India: A Buyer's Guide",
    h1: "How to Choose Fleet Management Software for Your Transport Business in India",
    description:
      "How to choose fleet management software for a transport business in India: the features that matter, what to ask about GPS and WhatsApp, and how to switch.",
    category: "Fleet & Transport",
    // TODO(owner): founder name, ZUGEE. Until then the post is credited to the team (never render "TODO").
    author: "ZUGEE team",
    datePublished: "2026-11-12",
    dateModified: "2026-11-12",
    ogImage: "/og/blog-fleet-management-software-buyers-guide.jpg",
    relatedProductSlug: "fleet-management-software",
    cta: {
      heading: "See fleet management software built for Indian transport",
      textAfterProductName:
        "keeps your vehicles, drivers, bookings, trips, maintenance and GST billing in one system, and runs in a browser on office computers and Android phones. Our team sets it up for your fleet in 14 days.",
      button: "Book a free demo"
    },
    blocks: [
      {
        type: "p",
        text: "Most transport businesses in India start the same way: a logbook for trips, a WhatsApp group for drivers, an Excel sheet for bills and Tally for the accountant. With three or four vehicles it works. Somewhere past that, the owner spends the day on the phone asking where each lorry is, which trips are unbilled and when a vehicle was last serviced."
      },
      {
        type: "p",
        text: "Fleet management software puts all of that in one place. But there are many products, they all promise a lot, and the wrong choice costs months. This guide explains what the software should do for a transport business, what to check carefully before you pay, and how to switch without disturbing your trips."
      },
      { type: "h2", id: "what-it-does", text: "What fleet management software does" },
      {
        type: "p",
        text: "At its core, fleet management software is one record of your business that everyone works from. Instead of each person keeping their own notes, the office, the dispatch desk and the accounts team see the same vehicles, the same bookings and the same bills."
      },
      {
        type: "ul",
        items: [
          "Vehicles: every truck, tanker, cab or bus with its registration, type and history",
          "Drivers: their details and the trips each one has run",
          "Bookings: what the customer asked for, when, and at what rate",
          "Trips: which vehicle and driver ran which booking, on which route",
          "Maintenance: services, repairs and part changes for each vehicle, with costs",
          "Billing: bills raised from the trip, with GST, so no trip goes unbilled"
        ]
      },
      { type: "h2", id: "signs-you-need-it", text: "Signs your transport business needs it" },
      {
        type: "ul",
        items: [
          "You can't say how many trips a vehicle ran last month without counting logbook pages",
          "Drivers get their duty in WhatsApp messages that are buried by the next morning",
          "Bills are typed days after the trip, and now and then one is never raised",
          "Services are remembered rather than recorded, until a lorry breaks down loaded",
          "Only one person in the office knows the full picture, and the business stops when they are on leave"
        ]
      },
      {
        type: "table",
        caption: "Paper and WhatsApp, Excel, and fleet management software compared",
        align: "left",
        columns: ["Area", "Paper & WhatsApp", "Excel", "Fleet software"],
        rows: [
          { cells: ["Trip record", "Logbook, often late", "One sheet per person", "Saved against vehicle, driver and booking"] },
          { cells: ["Billing", "Typed from a diary", "Copied from sheets", "Raised from the trip"] },
          { cells: ["Maintenance", "From memory", "If someone updates it", "History per vehicle"] },
          { cells: ["Who knows what", "Whoever was on the call", "Whoever has the file", "Everyone with a login"] }
        ]
      },
      { type: "h2", id: "must-have-features", text: "Features that matter for Indian transport businesses" },
      { type: "h3", text: "Bookings and dispatch in one list" },
      {
        type: "p",
        text: "The dispatch desk should take a booking when the customer calls and assign a free vehicle and driver to it on the same screen. Check that you can see at a glance which vehicles are out, which are at the yard and which are in for service."
      },
      { type: "h3", text: "Digital trip sheets" },
      {
        type: "p",
        text: "Each trip should have its own record: the booking, vehicle, driver, route and charges. This replaces the paper trip sheet collected from the cabin at the end of the week, and it is what billing and profit reports are built from."
      },
      { type: "h3", text: "Maintenance history for every vehicle" },
      {
        type: "p",
        text: "Before a long run, the office should be able to check when the vehicle was last serviced and what was done. A history per vehicle also shows which lorries cost more to keep running than they earn."
      },
      { type: "h3", text: "GST billing from the trip record" },
      {
        type: "p",
        text: "The bill should come straight from the finished trip, with your business and customer details filled in. Ask how GST is handled for your customers, and have your CA confirm the treatment for your business."
      },
      { type: "h3", text: "Works with Tally, so your CA keeps their system" },
      {
        type: "p",
        text: "Most CAs in India work in Tally and won't want to change. Good fleet software runs your daily operations and billing, and gives your accountant the billing data they need for returns and audits."
      },
      { type: "h3", text: "Usable on an Android phone" },
      {
        type: "p",
        text: "Supervisors and staff are rarely at a desk. Check that the software opens on an ordinary Android phone, and that each person has their own login and sees only what their role needs."
      },
      { type: "h2", id: "ask-carefully", text: "What to check carefully before you pay" },
      {
        type: "p",
        text: "Some features sound simple in a sales call but depend on outside services, extra hardware or work that is still being built. Ask to see each one working, with your own example, before you count on it."
      },
      { type: "h3", text: "GPS tracking" },
      {
        type: "ul",
        items: [
          "Who supplies the GPS device or SIM-based tracking, and what does it cost per vehicle per month?",
          "Is tracking part of the software you are buying, or a separate provider's app?",
          "How is the driver's consent handled when tracking is by phone?"
        ]
      },
      { type: "h3", text: "WhatsApp messages to customers and drivers" },
      {
        type: "ul",
        items: [
          "Is WhatsApp sending live today, or planned?",
          "Does it use the official WhatsApp Business platform, and who pays the message charges?"
        ]
      },
      { type: "h3", text: "E-way bills, fuel and FASTag" },
      {
        type: "ul",
        items: [
          "Does the software generate e-way bills, or only record the number you created on the GST portal?",
          "Are fuel and FASTag entries typed in, or read from statements?"
        ]
      },
      {
        type: "p",
        text: "None of these is a reason to avoid a product. The point is to know exactly what you are getting on day one, and what is planned for later."
      },
      { type: "h2", id: "questions-to-ask", text: "6 questions to ask every vendor" },
      {
        type: "mistakes",
        items: [
          {
            title: "Who sets it up?",
            text: "Software you have to configure yourself often stays half set up. Ask whether the vendor's team maps your workflow and trains your staff."
          },
          {
            title: "Who moves my data across?",
            text: "Your vehicle list, drivers and customers already live in Excel or Tally. Ask who brings them across, and in what format they need it."
          },
          {
            title: "How long until we are live?",
            text: "Ask for a realistic timeline from signing to the first real booking, and what you need to provide each week."
          },
          {
            title: "How is it priced?",
            text: "Ask what the setup fee covers, what the monthly or yearly charge depends on (users, branches, vehicles) and whether there is any annual maintenance charge on top."
          },
          {
            title: "Can I export my data?",
            text: "Your trip and billing history belongs to you. Make sure you can export it at any time, and that leaving doesn't mean losing it."
          },
          {
            title: "Does it fit my vehicles?",
            text: "Trucks, tankers, cabs and buses run differently. Ask to see the software with your own vehicle numbers, routes and customers, not a generic demo."
          }
        ]
      },
      { type: "h2", id: "how-to-switch", text: "How to switch without disturbing your trips" },
      {
        type: "ul",
        items: [
          "Pick a quieter week, not the start of a peak season",
          "Start with the master lists: vehicles, drivers and customers",
          "Run new bookings in the software while finishing the old trips on paper",
          "Train the dispatch desk and the billing staff on their own screens first",
          "Once a full week of trips is billed from the software, retire the logbook"
        ]
      },
      { type: "h2", id: "where-zugee-fleet-fits", text: "Where ZUGEE Fleet fits" },
      {
        type: "p",
        text: "ZUGEE Fleet is fleet management software made for transport businesses in India: goods transport, truck and tanker owners, cab operators, tourist buses and school transport. It covers vehicles, drivers, bookings, trips, maintenance and GST billing, and runs in a web browser on office computers and Android phones."
      },
      {
        type: "p",
        text: "Our team sets it up for your business in 14 days, brings your vehicle, driver and customer lists across from Excel or your Tally exports, and trains your staff. Your accountant keeps Tally, and we export the billing data they need. WhatsApp sending is coming soon to ZUGEE products, and we will tell you on the demo call when it is ready."
      }
    ]
  },
  {
    // Topic and know-how drawn from the ZUGEE Fleet clickable prototype (fixed cost per day,
    // mileage checks, detention, lorry hire). Written as a guide: it claims nothing about what
    // ZUGEE Fleet does beyond its product page (lib/product-pages/fleet.js). Every ₹ figure is a
    // labelled example, not an industry average.
    slug: "truck-trip-profit-calculation",
    published: true,
    title: "How to Calculate Profit on Each Truck Trip (With Example)",
    h1: "How to Calculate Profit on Each Truck Trip (With Example)",
    description:
      "Freight minus diesel is not profit. How Indian truck owners can work out the real profit on each trip, with a fixed-cost formula and a worked example.",
    category: "Fleet & Transport",
    // TODO(owner): founder name, ZUGEE. Until then the post is credited to the team (never render "TODO").
    author: "ZUGEE team",
    datePublished: "2026-11-04",
    dateModified: "2026-11-04",
    ogImage: "/og/blog-truck-trip-profit-calculation.jpg",
    relatedProductSlug: "fleet-management-software",
    cta: {
      heading: "Keep every trip's numbers in one place",
      textAfterProductName:
        "saves each trip against its vehicle, driver and booking, keeps every vehicle's maintenance history and what it cost, and raises the bill from the trip record. Our team sets it up for your fleet in 14 days.",
      button: "Book a free demo"
    },
    blocks: [
      {
        type: "p",
        text: "Ask a transport owner how much a trip made, and the usual answer is the freight minus the diesel. That number feels good, but it is not your profit. It leaves out the empty return, the tolls, the driver's bata, tyre wear, and the EMI and insurance that have to be paid whether the lorry runs or not."
      },
      {
        type: "p",
        text: "This guide shows how to work out the real profit on one trip, step by step, with a worked example you can copy for your own lorries."
      },
      { type: "h2", id: "three-kinds-of-cost", text: "The three kinds of cost on every trip" },
      {
        type: "p",
        text: "Every rupee a lorry costs falls into one of three groups. Profit is what is left of the freight after all three."
      },
      { type: "h3", text: "1. Running costs: paid because the trip happened" },
      {
        type: "ul",
        items: [
          "Diesel, for the loaded leg and the return",
          "Tolls / FASTag deductions, both ways",
          "Driver bata and any helper's bata",
          "Loading and unloading charges you pay",
          "Other trip expenses: parking, weighbridge, police or check-post receipts"
        ]
      },
      { type: "h3", text: "2. Wear costs: paid per kilometre, but later" },
      {
        type: "ul",
        items: [
          "Tyres, which wear out with every kilometre",
          "Regular service: oil, filters, greasing",
          "Repairs that come with running: brakes, clutch, suspension"
        ]
      },
      {
        type: "p",
        text: "These don't come out of your pocket on the day of the trip, which is why they are easy to forget. Set aside a fixed amount per kilometre for them. Work it out from your own tyre and service bills over the last year divided by the kilometres run."
      },
      { type: "h3", text: "3. Fixed costs: paid whether the lorry runs or not" },
      {
        type: "ul",
        items: [
          "EMI on the vehicle loan",
          "Insurance premium",
          "Permit and road tax",
          "The driver's monthly salary, if you pay one on top of bata"
        ]
      },
      { type: "h2", id: "fixed-cost-per-day", text: "Work out your fixed cost per day" },
      {
        type: "p",
        text: "Fixed costs are billed monthly or yearly, but a trip takes days. Turn them into a cost per day, then charge each trip for the days it kept the lorry busy:"
      },
      {
        type: "p",
        text: "Fixed cost per day = (EMI × 12 + insurance + permit and road tax + driver salary × 12) ÷ 365"
      },
      {
        type: "table",
        caption: "Example fixed cost per day for one lorry",
        columns: ["Fixed cost (example)", "Per year"],
        rows: [
          { cells: ["EMI ₹45,000 × 12", "₹5,40,000"] },
          { cells: ["Insurance", "₹60,000"] },
          { cells: ["Permit and road tax", "₹40,000"] },
          { cells: ["Driver salary ₹18,000 × 12", "₹2,16,000"] },
          { cells: ["Total per year", "₹8,56,000"], bold: true },
          { cells: ["Per day (÷ 365)", "₹2,345"], bold: true }
        ],
        note: "Example figures for illustration. Use your own loan, policy and permit amounts."
      },
      {
        type: "p",
        text: "Divide by 365, not by the days the lorry actually ran. A lorry that stands idle for a week still pays its EMI that week, and spreading the cost over every day shows you what idle days really cost."
      },
      { type: "h2", id: "worked-example", text: "Worked example: one round trip" },
      {
        type: "p",
        text: "A 10-wheeler takes a 12-tonne load from Salem to Chennai for ₹28,000 freight and comes back empty. The round trip is 680 km and keeps the lorry busy for 2 days. The lorry normally gives 4 km per litre."
      },
      {
        type: "table",
        caption: "Example profit on one Salem to Chennai round trip",
        columns: ["Item (example)", "Amount"],
        rows: [
          { cells: ["Freight from the customer", "₹28,000"], bold: true },
          { cells: ["Diesel: 680 km ÷ 4 km/l = 170 L × ₹93", "− ₹15,810"] },
          { cells: ["Tolls, both ways", "− ₹3,200"] },
          { cells: ["Driver bata, 2 days", "− ₹1,000"] },
          { cells: ["Loading and unloading", "− ₹600"] },
          { cells: ["Other expenses", "− ₹300"] },
          { cells: ["Tyres and service: 680 km × ₹3", "− ₹2,040"] },
          { cells: ["Fixed cost: 2 days × ₹2,345", "− ₹4,690"] },
          { cells: ["Real profit on the trip", "₹360"], bold: true }
        ],
        note: "Example figures for illustration, not industry rates. Diesel price, mileage, tolls and bata vary by route and lorry."
      },
      {
        type: "p",
        text: "Freight minus the diesel to Chennai alone would have shown about ₹20,000. The real figure is ₹360. The lorry did not lose money, but it barely covered its costs, and only the full calculation shows that."
      },
      {
        type: "p",
        text: "The same sheet shows what would change the result. A return load from Chennai earns fresh freight while most of the return leg's costs are already counted above. Two days' detention billed to the customer, covered below, would turn ₹360 into several thousand."
      },
      { type: "h2", id: "check-diesel-mileage", text: "Check diesel mileage on every fill" },
      {
        type: "p",
        text: "Diesel is the biggest cost on most trips, so it is worth checking every time the tank is filled. Fill to full each time and note the odometer reading at the pump. Then:"
      },
      {
        type: "ul",
        items: [
          "Mileage = kilometres since the last full fill ÷ litres filled now",
          "Compare it with that lorry's normal figure, not the fleet average: an older lorry or a loaded tanker runs differently",
          "Decide how big a drop you will look into, for example 15 to 20% below normal, and check every fill that crosses it"
        ]
      },
      {
        type: "p",
        text: "A low figure has an explanation: a wrong odometer entry, a leak, tyre pressure, an overloaded trip, a hilly route, or diesel going missing. Asking the question on the day of the fill is far easier than a month later."
      },
      { type: "h2", id: "detention-charges", text: "Charge detention when the lorry is held" },
      {
        type: "p",
        text: "Every extra day a lorry waits at a factory gate costs you a day of fixed cost, and earns nothing unless you bill it. Detention only works if the terms are agreed before loading:"
      },
      {
        type: "ul",
        items: [
          "Free time at loading and at unloading, for example 24 hours",
          "A rate per day after that, by truck type",
          "Whether a part day counts as a full day",
          "Arrival and release times written on the LR or trip sheet and signed, so the bill can't be argued"
        ]
      },
      {
        type: "p",
        text: "Example: the lorry reaches the unloading point at 9 am Monday and is released at 1 pm Wednesday. That is 52 hours held. With 24 hours free, 28 hours are chargeable, which is 2 days if each started day counts. At ₹2,000 a day, add ₹4,000 to the freight bill."
      },
      { type: "h2", id: "market-lorry-trips", text: "If you hire a market lorry" },
      {
        type: "p",
        text: "When you carry a load in a hired lorry, the owner's running and fixed costs are not yours. Your margin on the trip is the freight from the customer minus the lorry hire, minus anything you pay on the owner's behalf. Two habits protect that margin:"
      },
      {
        type: "ul",
        items: [
          "Pay the owner's balance only after the signed LR (proof of delivery) reaches your office",
          "Write in the hire memo that shortage or damage in transit is deducted from the balance"
        ]
      },
      { type: "h2", id: "mistakes-that-hide-losses", text: "5 mistakes that hide losses" },
      {
        type: "mistakes",
        items: [
          {
            title: "Ignoring the empty return.",
            text: "A one-way load still burns diesel and tolls on the way back. Price the trip on the round trip unless a return load is confirmed."
          },
          {
            title: "Leaving out fixed costs.",
            text: "EMI, insurance and permits don't appear on a trip sheet, so they get forgotten. Charge every trip its days of fixed cost."
          },
          {
            title: "No provision for tyres and service.",
            text: "A set of tyres paid for in one month makes that month look terrible and the others look better than they were. A per-km provision spreads it fairly."
          },
          {
            title: "Not billing detention.",
            text: "If the waiting time isn't written down and signed, it can't be billed. Record arrival and release times on every trip."
          },
          {
            title: "Working from memory.",
            text: "Profit worked out at month end from a diary and phone calls is a guess. Each trip needs its own record of freight and expenses, written while the trip runs."
          }
        ]
      },
      { type: "h2", id: "keep-numbers-per-trip", text: "Keep the numbers per trip" },
      {
        type: "p",
        text: "None of this works without a record for every trip: the vehicle, the driver, the route, the freight and each expense. A proper trip sheet is the place to start. Once each trip has its own record, the profit sum above takes minutes, and patterns show up: which routes pay, which customers hold your lorries, and which lorry costs more than it earns."
      }
    ]
  },
  {
    slug: "trip-sheet-format",
    published: true,
    title: "Trip Sheet Format for Transport Businesses (Free Template)",
    h1: "Trip Sheet Format for Transport Businesses (Free Template)",
    description:
      "A simple trip sheet format for truck, tanker, cab and bus operators in India — what fields to include, a ready template, and common mistakes to avoid.",
    category: "Fleet & Transport",
    // TODO(owner): founder name, ZUGEE. Until then the post is credited to the team (never render "TODO").
    author: "ZUGEE team",
    datePublished: "2026-10-31",
    dateModified: "2026-10-31",
    ogImage: "/og/blog-trip-sheet-format.jpg",
    relatedProductSlug: "fleet-management-software",
    cta: {
      heading: "Stop chasing paper trip sheets",
      // Rendered after the related product's name, read from lib/products.js at render time.
      textAfterProductName:
        "keeps every trip, vehicle, driver and bill in one place. Our team sets it up for your fleet in 14 days and moves your records across from Excel.",
      button: "Book a free demo"
    },
    blocks: [
      {
        type: "p",
        text: "If you run trucks, tankers, cabs or buses, the trip sheet is the most important paper in your business. It decides what you bill, what you pay the driver, and whether a trip made money or lost it."
      },
      {
        type: "p",
        text: "Yet in many transport offices, trip sheets are half-filled, collected days late, or lost in the driver's cabin. This guide gives you a clear trip sheet format you can start using today, and explains what each field is for."
      },
      { type: "h2", id: "what-is-a-trip-sheet", text: "What is a trip sheet?" },
      {
        type: "p",
        text: "A trip sheet is a record of one trip by one vehicle. It notes where the vehicle went, who drove it, how far it travelled, what was carried, and what was spent on the way. The office uses it to:"
      },
      {
        type: "ul",
        items: [
          "Bill the customer correctly",
          "Settle the driver's advance and expenses",
          "Track fuel use and vehicle running",
          "Work out the profit on each trip"
        ]
      },
      { type: "h2", id: "fields-to-include", text: "Trip sheet format: fields to include" },
      { type: "h3", text: "1. Trip details" },
      {
        type: "ul",
        items: ["Trip sheet number (running, never repeated)", "Date", "Booking or order reference", "Customer name"]
      },
      { type: "h3", text: "2. Vehicle and driver" },
      {
        type: "ul",
        items: ["Registration number", "Vehicle type", "Driver name and mobile", "Helper or cleaner name, if any"]
      },
      { type: "h3", text: "3. Route" },
      {
        type: "ul",
        items: ["From", "To", "Stops in between", "Departure date and time", "Arrival date and time"]
      },
      { type: "h3", text: "4. Distance" },
      { type: "ul", items: ["Opening odometer", "Closing odometer", "Total km"] },
      { type: "h3", text: "5. Load details" },
      {
        type: "ul",
        items: [
          "Goods carried (or passengers)",
          "Weight or quantity",
          "LR / consignment note number",
          "E-way bill number, if one was generated"
        ]
      },
      { type: "h3", text: "6. Expenses during the trip" },
      {
        type: "ul",
        items: ["Diesel (litres and ₹)", "Toll / FASTag", "Loading and unloading", "Driver bata", "Other expenses", "Total"]
      },
      { type: "h3", text: "7. Money" },
      {
        type: "ul",
        items: [
          "Advance given",
          "Expenses paid by the driver",
          "Balance to return or pay",
          "Freight amount agreed with the customer"
        ]
      },
      { type: "h3", text: "8. Sign-off" },
      { type: "ul", items: ["Driver signature", "Office signature", "Proof of delivery received (yes/no)"] },
      { type: "h2", id: "trip-sheet-template", text: "Ready-to-use trip sheet template" },
      { type: "p", text: "Copy this into Excel or Google Sheets, or print it:" },
      { type: "template", caption: "Trip sheet", columns: ["Field", "Entry"], rows: TRIP_SHEET_FIELDS },
      { type: "download", href: TRIP_SHEET_DOWNLOAD, label: "Download Excel template" },
      { type: "h2", id: "common-mistakes", text: "5 common trip sheet mistakes" },
      {
        type: "mistakes",
        items: [
          {
            title: "Not recording the odometer reading at the start.",
            text: "Without the opening reading, you can't check the kilometres or the diesel claimed. Make the driver note it before leaving the yard."
          },
          {
            title: "Collecting trip sheets at the end of the week.",
            text: "By then, receipts are lost and details are forgotten. Collect them as soon as the trip ends."
          },
          {
            title: "No running number.",
            text: "If trip sheets aren't numbered, a missing sheet means a trip that never gets billed. Number every sheet, and check for gaps."
          },
          {
            title: "Expenses without bills.",
            text: "Ask for a photo of every fuel slip and toll receipt. It protects both the owner and an honest driver."
          },
          {
            title: "Billing from memory.",
            text: "Raise the customer's bill from the trip sheet, not from a diary or a phone call. The trip sheet is your proof."
          }
        ]
      },
      { type: "h2", id: "when-paper-stops-working", text: "When paper trip sheets stop working" },
      {
        type: "p",
        text: "Paper works fine with one or two vehicles. As the fleet grows, problems pile up: sheets get lost, totals are added up wrongly, and no one can say how many trips a vehicle ran this month without counting pages."
      },
      {
        type: "p",
        text: "That's when transport owners move to digital trip sheets. Each trip is saved against its vehicle, driver and booking. Expenses are added as they happen, and the bill is raised straight from the trip record, so no trip is missed."
      }
    ]
  }
];

/** A post by slug, or null. Unpublished posts are returned too (the page route only builds published ones). */
export function getPost(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

/** Published posts, newest first. The blog list, the post routes and the sitemap all read this. */
export function publishedPosts() {
  return BLOG_POSTS.filter((post) => post.published !== false).sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );
}

/** The post's URL path ("/blog/trip-sheet-format"). */
export function postPath(post) {
  return `/blog/${post.slug}`;
}

/** Table of contents: the post's H2s, in order. */
export function postHeadings(post) {
  return post.blocks.filter((block) => block.type === "h2").map(({ id, text }) => ({ id, text }));
}

/** The first paragraph, for list-page excerpts. */
export function postExcerpt(post) {
  return post.blocks.find((block) => block.type === "p")?.text || post.description;
}

/** Article JSON-LD. Credited to the Organization until a named author is published. */
export function articleSchema(post, siteUrl = getSiteUrl()) {
  const url = `${siteUrl}${postPath(post)}`;
  const organization = { "@id": `${siteUrl}/#organization` };
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.h1,
    description: post.description,
    image: `${siteUrl}${post.ogImage}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: { "@type": "Organization", name: "ZUGEE", ...organization },
    publisher: organization,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    inLanguage: "en-IN"
  };
}

/** BreadcrumbList matching the post's visible breadcrumb: Home / Blog / post title. */
export function blogBreadcrumbSchema(post, siteUrl = getSiteUrl()) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", item: `${siteUrl}/` },
      { name: "Blog", item: `${siteUrl}/blog` },
      { name: post.h1, item: `${siteUrl}${postPath(post)}` }
    ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb }))
  };
}

/** Both schemas in one graph, for the post page's <script type="application/ld+json">. */
export function postPageSchema(post, siteUrl = getSiteUrl()) {
  return { "@context": CONTEXT, "@graph": [articleSchema(post, siteUrl), blogBreadcrumbSchema(post, siteUrl)] };
}

/** "31 October 2026" (en-IN). Parsed as UTC so the date never shifts with the server's time zone. */
export function formatPostDate(isoDate) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`)
  );
}

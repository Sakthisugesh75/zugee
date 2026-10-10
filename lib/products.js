// lib/products.js
// Single source of truth for the ZUGEE product catalog: the marketing product grid, the lead
// form's business types, the admin lead filter and the JSON-LD all read from here.
//
// STATUS RULE (docs/ZUGEE-PLATFORM-PLAN.md §F): a product may only be "available" after it passes
// the Live checklist — a real deployment, a real business using it (or founder sign-off after a
// full end-to-end test), and every module listed below working. Until then use "in_development"
// or "coming_soon". Never list a module the product can't do today.
//
// 2026-09-25: the founder confirmed every product in the brief's "existing / ready" list is ready,
// with sales run through a demo meeting (founder sign-off, per the checklist). Phase 2/3 products
// stay "coming_soon" until they're built. Logistics stays "coming_soon": the brief lists it both as
// existing and as Phase 3, and its navigation puts it under Coming Soon.
//
// 2026-10-05: the founder confirmed Hospital Management, now Clinivance (slug "medical"), is live and working end to
// end, with every module listed, and approved its description and modules.
//
// 2026-10-10: every product renamed (founder brief). Only `name` changed: slugs (stored on leads),
// category labels and modules are as before. Old names must not appear on the site
// (tests/product-pages.test.mjs). The same day the founder confirmed four more modules (Fabrova
// "Bill of materials", Scholora "Parent communication", Campora "Faculty", Resortique "Services")
// and Fabrova's garment / textile positioning.

// categoryLabel  the eyebrow on the product card and the product page's breadcrumb.
// replaces       what the product replaces, shown on the card and the product page.
// pageSlug       the product's landing page (/fleet-management-software). The page's copy lives in
//                lib/product-pages.js, kept out of this file because client components import it.
//                `slug` stays the product id: leads store it, so it must never change.

export const PRODUCT_STATUS = {
  available: { label: "Available", tone: "available" },
  in_development: { label: "In Development", tone: "progress" },
  coming_soon: { label: "Coming Soon", tone: "soon" }
};

export const PRODUCT_CATEGORIES = [
  { id: "business", label: "Business Management" },
  { id: "industry", label: "Industry Solutions" }
];

export const PRODUCTS = [
  {
    slug: "core-erp",
    name: "Zugee Omni",
    categoryLabel: "Business Platform",
    replaces: "Excel + WhatsApp + standalone Tally",
    pageSlug: "erp-crm-software",
    category: "business",
    industry: "Any business",
    description: "Customers, leads, products, sales, billing, payments and inventory for a general business.",
    modules: ["Customers", "Leads", "Products", "Sales & billing", "Payments", "Inventory"],
    status: "available"
  },
  {
    slug: "transposs",
    name: "Fleetova",
    categoryLabel: "Fleet Management",
    replaces: "Paper logbooks + WhatsApp driver dispatch",
    pageSlug: "fleet-management-software",
    category: "industry",
    industry: "Fleet & transport",
    description: "Manage vehicles, drivers, bookings, trips, maintenance and fleet expenses.",
    modules: ["Vehicles", "Drivers", "Bookings", "Trips", "Maintenance", "Billing"],
    status: "available"
  },
  {
    slug: "tours-travels",
    name: "Tourvana",
    categoryLabel: "Travel & Tourism",
    replaces: "Word doc quotations + scattered email PDFs",
    pageSlug: "tours-and-travels-crm",
    category: "industry",
    industry: "Travel agencies",
    description: "Take an enquiry through follow-up, package, quotation and booking to payment.",
    modules: ["Enquiries", "Leads", "Packages", "Quotations", "Bookings", "Payments"],
    status: "available"
  },
  {
    slug: "aqua-erp",
    name: "Aqurix",
    categoryLabel: "Water Operations",
    replaces: "Pocket diary route delivery records",
    pageSlug: "water-supply-erp",
    category: "industry",
    industry: "Packaged drinking water",
    description: "Orders, can deliveries, routes, drivers and outstanding payments for water businesses.",
    modules: ["Customers", "Orders", "Deliveries", "Routes", "Payments", "Outstanding"],
    status: "available"
  },
  {
    slug: "real-estate",
    name: "Estatova",
    categoryLabel: "Real Estate",
    replaces: "Fragmented spreadsheets + broker chats",
    pageSlug: "real-estate-crm",
    category: "industry",
    industry: "Real estate",
    description: "Projects, properties, leads, site visits, follow-ups and bookings in one place.",
    modules: ["Projects", "Properties", "Leads", "Site visits", "Bookings", "Payments"],
    status: "available"
  },
  {
    slug: "manuflow",
    name: "Fabrova",
    categoryLabel: "Manufacturing",
    replaces: "Manual job cards + offline inventory logs",
    pageSlug: "garment-manufacturing-erp",
    category: "industry",
    industry: "Manufacturing",
    description: "Job cards, BOM, cutting, job work, quality checks, packing and dispatch for garment and textile units.",
    modules: ["Raw materials", "Bill of materials", "Work orders", "Production", "Inventory", "Sales"],
    status: "available"
  },
  {
    slug: "school-erp",
    name: "Scholora",
    categoryLabel: "Education",
    replaces: "Paper attendance sheets + manual fee receipts",
    pageSlug: "school-management-software",
    category: "industry",
    industry: "Schools",
    description: "Students, classes, attendance, fees, exams and parent communication.",
    modules: ["Students", "Attendance", "Fees", "Exams", "Timetable", "Parent communication"],
    status: "available"
  },
  {
    slug: "college",
    name: "Campora",
    categoryLabel: "College ERP",
    replaces: "Legacy college servers + manual desk fees",
    pageSlug: "college-management-software",
    category: "industry",
    industry: "Colleges",
    description: "Departments, courses, faculty, attendance, fees and exams.",
    modules: ["Departments", "Courses", "Faculty", "Attendance", "Fees", "Exams"],
    status: "available"
  },
  {
    slug: "pg-management",
    name: "Roomora",
    categoryLabel: "Hospitality",
    replaces: "Paper rent registers + cash deposit slips",
    pageSlug: "pg-management-software",
    category: "industry",
    industry: "PGs & hostels",
    description: "Rooms, beds, tenants, rent, deposits and complaints for PG operators.",
    modules: ["Rooms & beds", "Tenants", "Rent", "Deposits", "Complaints"],
    status: "available"
  },
  {
    slug: "resort",
    name: "Resortique",
    categoryLabel: "Resort Suite",
    replaces: "Separate booking calendar + desk invoices",
    pageSlug: "resort-management-software",
    category: "industry",
    industry: "Resorts",
    description: "Rooms, bookings, guests, check-in, check-out and services.",
    modules: ["Rooms", "Bookings", "Guests", "Check-in/out", "Services", "Payments"],
    status: "available"
  },
  {
    slug: "logistics",
    name: "Logistics Management",
    categoryLabel: "Logistics",
    category: "industry",
    industry: "Logistics & delivery",
    description: "Shipments, pickups, dispatch, delivery tracking and proof of delivery.",
    modules: ["Shipments", "Dispatch", "Delivery status", "Proof of delivery"],
    status: "coming_soon"
  },
  {
    slug: "gym",
    name: "Gym CRM & ERP",
    categoryLabel: "Fitness & Wellness",
    replaces: "Card-based membership logs",
    category: "industry",
    industry: "Gyms & fitness",
    description: "Members, renewals, trainers and payments for gyms and studios.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "salon",
    name: "Salon CRM & ERP",
    categoryLabel: "Beauty & Salon",
    replaces: "Paper appointment books",
    category: "industry",
    industry: "Salons & spas",
    description: "Appointments, customers, services and staff for salons.",
    modules: [],
    status: "coming_soon"
  },
  {
    // Slug kept as "medical" (it replaced "Medical CRM" in place) so existing leads stored as
    // "medical" keep their label.
    slug: "medical",
    name: "Clinivance",
    categoryLabel: "Healthcare",
    replaces: "Paper OP registers + manual billing",
    pageSlug: "hospital-management-software",
    category: "industry",
    industry: "Hospitals & clinics",
    description: "Patients, appointments, doctors, admissions, billing, pharmacy and lab reports for hospitals and clinics.",
    modules: [
      "Patients (registration, history)",
      "Appointments",
      "Doctors & departments",
      "OP & IP admissions",
      "Billing",
      "Pharmacy",
      "Lab reports"
    ],
    status: "available"
  },
  {
    slug: "construction",
    name: "Civil Construction Management",
    categoryLabel: "Construction",
    replaces: "Site notebook muster rolls",
    category: "industry",
    industry: "Construction",
    description: "Projects, sites, materials and contractor payments.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "warehouse",
    name: "Warehouse Management",
    categoryLabel: "Warehousing",
    replaces: "Bin cards + manual tallying",
    category: "industry",
    industry: "Warehousing",
    description: "Stock locations, inward, outward and transfers.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "tasks",
    name: "Task Management",
    categoryLabel: "Productivity",
    replaces: "Scattered WhatsApp task reminders",
    category: "business",
    industry: "Any team",
    description: "Assign, track and follow up on work across your team.",
    modules: [],
    status: "coming_soon"
  }
];

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

/**
 * Products a business can use today, in catalog order. The homepage (hero icons, industry grid,
 * product details) and the SoftwareApplication structured data all read this, so they always
 * list the same products. Coming Soon products stay in PRODUCTS but are not shown.
 */
export function availableProducts() {
  return PRODUCTS.filter((p) => p.status === "available");
}

/**
 * The homepage anchor for a product's details ("product-transposs"). The industry grid links to it,
 * the details list uses it as the element id, and the SoftwareApplication @id and url point at it.
 */
export function productAnchor(slug) {
  return `product-${slug}`;
}

/**
 * "Fleetova by ZUGEE": the product's full name for page titles, the hero eyebrow and JSON-LD.
 * A name that already carries the brand ("Zugee Omni") is used as it is.
 */
export function productFullName(product) {
  return /^zugee\b/i.test(product.name) ? product.name : `${product.name} by ZUGEE`;
}

/** The product's landing page path ("/fleet-management-software"), or null if it has none. */
export function productPagePath(product) {
  return product?.pageSlug ? `/${product.pageSlug}` : null;
}

// Lead form "business type" options: every catalog product plus "other". Stored in leads.industry.
export const BUSINESS_TYPES = [
  ...PRODUCTS.map((p) => ({ id: p.slug, label: `${p.industry} — ${p.name}` })),
  { id: "other", label: "Something else" }
];

// What the public demo form offers: Available products plus "other", so nobody can book a demo of
// a Coming Soon product (those businesses choose "Something else"). The API and the admin filter
// keep the full BUSINESS_TYPES list, so older leads keep their labels.
export const DEMO_FORM_BUSINESS_TYPES = BUSINESS_TYPES.filter(
  (b) => b.id === "other" || availableProducts().some((p) => p.slug === b.id)
);

// Leads captured before the product catalog existed used the old vertical ids. Kept only so the
// admin portal can still label and filter them.
export const LEGACY_LEAD_INDUSTRIES = {
  education: "Education (legacy)",
  hospitality: "Hospitality (legacy)",
  real_estate: "Real estate (legacy)",
  logistics: "Logistics (legacy)",
  healthcare: "Healthcare (legacy)",
  professional_services: "Professional services (legacy)",
  manufacturing: "Manufacturing (legacy)",
  retail: "Retail (legacy)",
  fitness: "Fitness (legacy)",
  facility_management: "Facility management (legacy)",
  events: "Events (legacy)"
};

export function businessTypeLabel(id) {
  return BUSINESS_TYPES.find((b) => b.id === id)?.label || LEGACY_LEAD_INDUSTRIES[id] || id;
}

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
    name: "ZUGEE ERP / CRM",
    category: "business",
    industry: "Any business",
    description: "Customers, leads, products, sales, billing, payments and inventory for a general business.",
    modules: ["Customers", "Leads", "Products", "Sales & billing", "Payments", "Inventory"],
    status: "available"
  },
  {
    slug: "transposs",
    name: "Transposs",
    category: "industry",
    industry: "Fleet & transport",
    description: "Manage vehicles, drivers, bookings, trips, maintenance and fleet expenses.",
    modules: ["Vehicles", "Drivers", "Bookings", "Trips", "Maintenance", "Billing"],
    status: "available"
  },
  {
    slug: "tours-travels",
    name: "Tours & Travels CRM",
    category: "industry",
    industry: "Travel agencies",
    description: "Take an enquiry through follow-up, package, quotation and booking to payment.",
    modules: ["Enquiries", "Leads", "Packages", "Quotations", "Bookings", "Payments"],
    status: "available"
  },
  {
    slug: "aqua-erp",
    name: "Aqua ERP",
    category: "industry",
    industry: "Packaged drinking water",
    description: "Orders, can deliveries, routes, drivers and outstanding payments for water businesses.",
    modules: ["Customers", "Orders", "Deliveries", "Routes", "Payments", "Outstanding"],
    status: "available"
  },
  {
    slug: "real-estate",
    name: "Real Estate ERP",
    category: "industry",
    industry: "Real estate",
    description: "Projects, properties, leads, site visits, follow-ups and bookings in one place.",
    modules: ["Projects", "Properties", "Leads", "Site visits", "Bookings", "Payments"],
    status: "available"
  },
  {
    slug: "manuflow",
    name: "ManuFlow",
    category: "industry",
    industry: "Manufacturing",
    description: "Raw materials, bills of materials, work orders, production and finished goods.",
    modules: ["Raw materials", "BOM", "Work orders", "Production", "Inventory", "Sales"],
    status: "available"
  },
  {
    slug: "school-erp",
    name: "School ERP",
    category: "industry",
    industry: "Schools",
    description: "Students, classes, attendance, fees, exams and parent communication.",
    modules: ["Students", "Attendance", "Fees", "Exams", "Timetable"],
    status: "available"
  },
  {
    slug: "college",
    name: "College Management",
    category: "industry",
    industry: "Colleges",
    description: "Departments, courses, faculty, attendance, fees and exams.",
    modules: ["Departments", "Courses", "Attendance", "Fees", "Exams"],
    status: "available"
  },
  {
    slug: "pg-management",
    name: "PG Management",
    category: "industry",
    industry: "PGs & hostels",
    description: "Rooms, beds, tenants, rent, deposits and complaints for PG operators.",
    modules: ["Rooms & beds", "Tenants", "Rent", "Deposits", "Complaints"],
    status: "available"
  },
  {
    slug: "resort",
    name: "Resort Management",
    category: "industry",
    industry: "Resorts",
    description: "Rooms, bookings, guests, check-in, check-out and services.",
    modules: ["Rooms", "Bookings", "Guests", "Check-in/out", "Payments"],
    status: "available"
  },
  {
    slug: "logistics",
    name: "Logistics Management",
    category: "industry",
    industry: "Logistics & delivery",
    description: "Shipments, pickups, dispatch, delivery tracking and proof of delivery.",
    modules: ["Shipments", "Dispatch", "Delivery status", "Proof of delivery"],
    status: "coming_soon"
  },
  {
    slug: "gym",
    name: "Gym CRM & ERP",
    category: "industry",
    industry: "Gyms & fitness",
    description: "Members, renewals, trainers and payments for gyms and studios.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "salon",
    name: "Salon CRM & ERP",
    category: "industry",
    industry: "Salons & spas",
    description: "Appointments, customers, services and staff for salons.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "medical",
    name: "Medical CRM",
    category: "industry",
    industry: "Clinics",
    description: "Patients, appointments and follow-ups for clinics.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "construction",
    name: "Civil Construction Management",
    category: "industry",
    industry: "Construction",
    description: "Projects, sites, materials and contractor payments.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "warehouse",
    name: "Warehouse Management",
    category: "industry",
    industry: "Warehousing",
    description: "Stock locations, inward, outward and transfers.",
    modules: [],
    status: "coming_soon"
  },
  {
    slug: "tasks",
    name: "Task Management",
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

// Lead form "business type" options: every catalog product plus "other". Stored in leads.industry.
export const BUSINESS_TYPES = [
  ...PRODUCTS.map((p) => ({ id: p.slug, label: `${p.industry} — ${p.name}` })),
  { id: "other", label: "Something else" }
];

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

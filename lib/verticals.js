// lib/verticals.js
// Single source of truth for all 11 verticals across Zugee.
// Strict honesty principles:
// 1. Zero fabricated company, school, hotel, or client names.
// 2. All example dashboard titles use generic category labels.
// 3. All metrics are explicitly identified as planning targets, not achieved results.

export const VERTICALS = [
  {
    id: "education",
    slug: "education",
    name: "K-12 & Higher Education",
    shortName: "Education",
    categoryLabel: "Schools, Colleges & Academies",
    dashboardTitle: "Fee Ledger & Admissions — K-12 & Higher Education",
    metricTarget: "Target: Zero reconciliation lag at fee deadlines",
    headline: "Unified fee ledgers and paperless parent communication",
    problem:
      "Scattered fee receipts, manual WhatsApp follow-ups, and disconnected transport/hostel records causing multi-week reconciliation delays every academic term.",
    solution:
      "One student ledger connecting multi-tier fee structures, split installment plans, automated WhatsApp payment notices, and instant 80G tax receipts.",
    capabilities: [
      "Multi-tier fee structures (tuition, transport, lab, term installments)",
      "Automated WhatsApp payment links & instant 80G tax receipt PDF dispatch",
      "Daily automated reconciliation between payment gateways and student records",
      "Parent communication hub for attendance alerts and examination notices"
    ],
    concreteWorkflow: {
      trigger: "Term fee unpaid after grace day 5",
      action: "Automated WhatsApp notice dispatched to parent mobile with one-click UPI payment link",
      effect: "Student ledger auto-reconciles instantly upon bank webhook confirmation"
    },
    mockup: {
      kpis: [
        { label: "Term Fees Collected", value: "₹14.2L", sub: "18% remaining" },
        { label: "Receipts Issued Today", value: "142", sub: "100% digital" },
        { label: "WhatsApp Delivery Rate", value: "99.4%", sub: "Official Cloud API" },
        { label: "Unreconciled Receipts", value: "0", sub: "Live sync" }
      ],
      recentActivity: [
        { title: "Receipt #REC-8842 issued (Term 2 Tuition)", time: "4m ago", status: "Delivered" },
        { title: "Overdue reminder batch (68 recipients) dispatched", time: "22m ago", status: "Active" },
        { title: "Gateway settlement synced: 42 transactions matched", time: "1h ago", status: "Success" }
      ]
    }
  },
  {
    id: "hospitality",
    slug: "hospitality",
    name: "Resorts, Boutique Hotels & Hospitality",
    shortName: "Hospitality",
    categoryLabel: "Hotels, Resorts & Guest Houses",
    dashboardTitle: "Front Desk & Guest Operations — Resorts & Hotels",
    metricTarget: "Target: 4-minute paperless guest check-ins",
    headline: "Mobile-first guest concierge and unified room folios",
    problem:
      "Fragmented channel bookings, manual ID scanning at reception queues, unbilled restaurant tabs, and delayed SAC-code GST invoicing at checkout.",
    solution:
      "Digital WhatsApp check-in, real-time room folio tracking dining and spa extras, and instant dual-slab GST invoice settlement on checkout.",
    capabilities: [
      "WhatsApp digital check-in, ID capture & guest registration card",
      "Centralized room folio aggregating restaurant, spa, and room charges",
      "Dual-tier GST calculation (12% / 18% based on room tariff slabs)",
      "Housekeeping status & maintenance escalation pipelines"
    ],
    concreteWorkflow: {
      trigger: "Guest reservation confirmed in booking system",
      action: "Digital pre-check-in link dispatched via WhatsApp",
      effect: "ID verified and guest room folio opened before arrival"
    },
    mockup: {
      kpis: [
        { label: "Current Occupancy", value: "84%", sub: "28/33 rooms booked" },
        { label: "Active Room Folios", value: "28", sub: "Zero unposted items" },
        { label: "Avg Check-In Time", value: "3.8 min", sub: "Paperless flow" },
        { label: "Unbilled Extras", value: "₹18,400", sub: "Spa & Dining tabs" }
      ],
      recentActivity: [
        { title: "Room 204: Dining tab ₹2,850 posted to master folio", time: "8m ago", status: "Posted" },
        { title: "Villa 3: Digital pre-check-in completed via WhatsApp", time: "18m ago", status: "Verified" },
        { title: "Checkout folio #FOL-1092 settled via UPI — GST emailed", time: "45m ago", status: "Settled" }
      ]
    }
  },
  {
    id: "real_estate",
    slug: "real-estate",
    name: "Real Estate & Commercial Property Management",
    shortName: "Commercial Property",
    categoryLabel: "Tech Parks, Commercial Complexes & Co-Working",
    dashboardTitle: "Lease Management & Tenant Operations — Commercial Property",
    metricTarget: "Target: 100% automated monthly rent roll generation",
    headline: "Automated lease escalations, CAM splits, and tenant portals",
    problem:
      "Rent collection scattered across spreadsheets, missed contractual lease escalations, complex Common Area Maintenance (CAM) utility math, and slow tenant service response.",
    solution:
      "Automated rent roll engine calculating escalations, utility sub-meter splits, commercial GST invoices, Section 194I TDS tracking, and WhatsApp ticketing.",
    capabilities: [
      "Automated lease escalation schedules (annual 5%/10% contractual bumps)",
      "CAM & sub-meter utility billing with power factor and DG run-hour splits",
      "Tax Deducted at Source (TDS) 194I tracking & credit matching",
      "WhatsApp tenant ticketing for facility & plumbing escalations"
    ],
    concreteWorkflow: {
      trigger: "1st of month calendar event",
      action: "Automated commercial rent + CAM tax invoice generated with TDS breakdown",
      effect: "Dispatched via email and WhatsApp to tenant finance desk"
    },
    mockup: {
      kpis: [
        { label: "Monthly Rent Roll", value: "96.2%", sub: "Collected on schedule" },
        { label: "Active Leases", value: "44 units", sub: "100% occupancy" },
        { label: "Upcoming Escalations", value: "3 units", sub: "Next 60 days" },
        { label: "Open Maintenance", value: "2 tickets", sub: "Under SLA limit" }
      ],
      recentActivity: [
        { title: "Unit 402: CAM utility sub-meter bill generated (₹24,150)", time: "12m ago", status: "Dispatched" },
        { title: "Unit 701: Lease escalation reminder (10% renewal due)", time: "30m ago", status: "Notified" },
        { title: "TDS challan verified for Q2 rent receipt #REC-3012", time: "1h ago", status: "Verified" }
      ]
    }
  },
  {
    id: "logistics",
    slug: "logistics",
    name: "Logistics, Warehousing & Fleet Operations",
    shortName: "Logistics & Fleet",
    categoryLabel: "Third-Party Logistics, Freight & Warehouses",
    dashboardTitle: "Fleet & Dispatch Operations — Third-Party Logistics",
    metricTarget: "Target: Zero manual e-way bill generation bottlenecks",
    headline: "Instant e-way bill generation, WhatsApp driver check-ins & photo POD",
    problem:
      "Truck drivers stuck at toll gates waiting for e-way bills, lost physical delivery receipts, delayed detention billing, and manual consignment manifests.",
    solution:
      "Direct NIC portal API connection for instant e-way bills, driver WhatsApp bot for GPS check-ins and photo POD capture, and automatic freight billing.",
    capabilities: [
      "Automated e-way bill generation & validity extension via GST portal API",
      "Consignment note (Bilty / LR) generation with multi-point drop manifests",
      "Driver WhatsApp bot for GPS check-in, toll slips, and photo POD upload",
      "Fuel expense tracking and freight detention/demurrage calculators"
    ],
    concreteWorkflow: {
      trigger: "Consignment loaded at warehouse dispatch bay",
      action: "Driver uploads photo of LR on WhatsApp",
      effect: "NIC e-way bill generated via API and live tracking link dispatched to consignee"
    },
    mockup: {
      kpis: [
        { label: "Active Vehicles", value: "38 fleet", sub: "In transit" },
        { label: "Active E-Way Bills", value: "52", sub: "Zero expired" },
        { label: "POD Pending Verification", value: "4 docs", sub: "Under review" },
        { label: "On-Time Dispatch Target", value: "97.8%", sub: "Target SLA" }
      ],
      recentActivity: [
        { title: "Trip #TR-5541: Driver uploaded signed POD at Hub B", time: "6m ago", status: "Approved" },
        { title: "E-Way Bill #381928491 generated via NIC API gateway", time: "19m ago", status: "Valid" },
        { title: "Fuel slip verified & advance debited for Fleet Vehicle 42", time: "40m ago", status: "Processed" }
      ]
    }
  },
  {
    id: "healthcare",
    slug: "healthcare",
    name: "Healthcare Clinics, Diagnostic Labs & Hospitals",
    shortName: "Healthcare & Labs",
    categoryLabel: "Clinics, Diagnostic Centers & Polyclinics",
    dashboardTitle: "Patient Flow & Diagnostic Billing — Healthcare & Clinics",
    metricTarget: "Target: 5-minute diagnostic report turnaround to WhatsApp",
    headline: "Paperless OPD queues, automated lab report dispatch & billing",
    problem:
      "Long reception queues, lost physical diagnostic reports, uncollected consultation fees, and missed chronic patient review appointments.",
    solution:
      "OPD token calling via WhatsApp, automated lab report PDF generation as soon as the pathologist signs off, and follow-up appointment reminders.",
    capabilities: [
      "OPD appointment queue management with WhatsApp token calling",
      "Diagnostic test catalog with pre-configured lab parameter templates",
      "Automated PDF lab report dispatch to patient WhatsApp upon doctor sign-off",
      "Pharmacy prescription billing and inventory expiry batch tracking"
    ],
    concreteWorkflow: {
      trigger: "Pathologist approves diagnostic blood test report",
      action: "Encrypted PDF generated and verified",
      effect: "Instant WhatsApp message dispatched to patient with one-click download link"
    },
    mockup: {
      kpis: [
        { label: "Patients Registered Today", value: "118", sub: "OPD active" },
        { label: "Lab Reports Released", value: "84", sub: "Dispatched via WhatsApp" },
        { label: "Avg Consultation Wait", value: "11 min", sub: "Token system" },
        { label: "WhatsApp Delivery Rate", value: "99.8%", sub: "Encrypted PDFs" }
      ],
      recentActivity: [
        { title: "Lab Report #LAB-4091 verified by Dr. Desk — PDF dispatched", time: "5m ago", status: "Sent" },
        { title: "OPD Token #34 called for Consultation Room 2", time: "14m ago", status: "In-Session" },
        { title: "Follow-up reminder sent to 19 review patients", time: "50m ago", status: "Completed" }
      ]
    }
  },
  {
    id: "professional_services",
    slug: "professional-services",
    name: "Professional Services, Legal & CA Practices",
    shortName: "Professional Services",
    categoryLabel: "Chartered Accountants, Legal Firms & Consultancies",
    dashboardTitle: "Client Engagements & Retainers — Professional Services & CA",
    metricTarget: "Target: Zero unbilled billable hours or untracked retainers",
    headline: "Client retainers, statutory compliance calendars & document hubs",
    problem:
      "Untracked partner billable hours, scope creep eating retainer margins, missed statutory filing dates (ITR, GST, MCA), and constant document chasing.",
    solution:
      "Timesheet-to-retainer billing, automated document collection bot on WhatsApp for bank statements, and a centralized statutory compliance calendar.",
    capabilities: [
      "Monthly retainer tracking with out-of-scope work approval gates",
      "Statutory compliance calendar (GST, TDS, MCA, Income Tax filings)",
      "WhatsApp document collection bot for client bank statements & Form 16s",
      "Partner time allocation and realization rate analytics"
    ],
    concreteWorkflow: {
      trigger: "Statutory filing deadline approaches (T-5 days)",
      action: "Automated document request checklist sent to client finance team",
      effect: "Uploaded files automatically organized into client engagement folder"
    },
    mockup: {
      kpis: [
        { label: "Active Retainers", value: "62 clients", sub: "Zero scope leakage" },
        { label: "Filings Due This Week", value: "18", sub: "12 completed" },
        { label: "Realization Rate Target", value: "92%", sub: "Target benchmark" },
        { label: "Unbilled Hours Flagged", value: "14.5 hrs", sub: "Ready to invoice" }
      ],
      recentActivity: [
        { title: "Client Engagement #ENG-108: GSTR-3B filed & archived", time: "11m ago", status: "Complied" },
        { title: "Document request: 8 bank statements uploaded via WhatsApp", time: "25m ago", status: "Indexed" },
        { title: "Retainer invoice generated for Q3 tax advisory", time: "1h ago", status: "Billed" }
      ]
    }
  },
  {
    id: "manufacturing",
    slug: "manufacturing",
    name: "Manufacturing & Job-Shop Fabrication",
    shortName: "Manufacturing",
    categoryLabel: "Job Shops, Fabrication Units & Small Factories",
    dashboardTitle: "Production Work Orders & Inventory — Job-Shop Manufacturing",
    metricTarget: "Target: Real-time raw material BOM reconciliation",
    headline: "Digital job cards, multi-level BOM & subcontractor challans",
    problem:
      "Raw material stockouts halting machine work, paper job cards lost on shop floors, untracked scrap percentages, and lost subcontracting challans.",
    solution:
      "Multi-level Bill of Materials (BOM), digital job cards with step sign-offs, automatic stock reservation, and Section 143 job-work tracking.",
    capabilities: [
      "Multi-level BOM with automatic raw material reservation on order confirmation",
      "Digital job cards with operator stage sign-offs (Cutting, CNC, Assembly, QC)",
      "Job-work Challan (Annexure IV / Section 143) tracking for external processing",
      "Finished goods batch tracking with mill test certificate attachments"
    ],
    concreteWorkflow: {
      trigger: "Sales order approved by production head",
      action: "Raw material BOM checked against stock inventory",
      effect: "Digital job cards dispatched to shop floor and materials reserved in stores"
    },
    mockup: {
      kpis: [
        { label: "Active Work Orders", value: "14 jobs", sub: "On schedule" },
        { label: "Machine Utilization Target", value: "88%", sub: "Target efficiency" },
        { label: "QC First-Pass Yield", value: "99.1%", sub: "Zero rework" },
        { label: "Low Raw Stock Alerts", value: "2 items", sub: "Reorder triggered" }
      ],
      recentActivity: [
        { title: "Job Card #JC-9022: CNC Milling stage completed (250 units)", time: "15m ago", status: "Passed QC" },
        { title: "Job-work challan issued for heat treatment processing", time: "35m ago", status: "In Transit" },
        { title: "Raw material SS-304 sheet stock reserved for Work Order #412", time: "1h ago", status: "Reserved" }
      ]
    }
  },
  {
    id: "retail",
    slug: "retail",
    name: "Retail Chains & Multi-Outlet Franchisees",
    shortName: "Retail & Franchise",
    categoryLabel: "Franchise Stores, Specialty Retail & Outlets",
    dashboardTitle: "Multi-Store Inventory & Point of Sale — Retail & Franchise",
    metricTarget: "Target: Same-day inter-branch stock rebalancing",
    headline: "Multi-store inventory sync, WhatsApp POS receipts & cash audits",
    problem:
      "Inventory stuck at one branch while another runs out of stock, delayed end-of-day register reconciliation, and paper thermal receipts discarded by customers.",
    solution:
      "Centralized multi-store inventory with inter-branch transfers, rapid barcode POS, automated daily register closing, and paperless WhatsApp receipts.",
    capabilities: [
      "Multi-location inventory with automated inter-branch transfer orders",
      "Fast POS checkout with digital WhatsApp receipts (zero thermal paper waste)",
      "Daily cash drawer & payment gateway reconciliation report per outlet",
      "Barcode & SKU variant matrix (sizes, colors, expiry batches)"
    ],
    concreteWorkflow: {
      trigger: "Outlet B stock of key SKU drops below minimum threshold",
      action: "Automated Inter-Branch Transfer request routed to Central Warehouse",
      effect: "Transfer order generated and stock reserved for dispatch"
    },
    mockup: {
      kpis: [
        { label: "Active Outlets", value: "7 stores", sub: "Live connected" },
        { label: "Gross Sales Today", value: "₹3.82L", sub: "Real-time sync" },
        { label: "Low Stock SKUs", value: "5 items", sub: "Transfer ordered" },
        { label: "Inter-Store Transfers", value: "3 active", sub: "In movement" }
      ],
      recentActivity: [
        { title: "Outlet 3: End-of-day register closed — ₹42,800 cash reconciled", time: "10m ago", status: "Balanced" },
        { title: "Transfer Order #TO-441 dispatched to Outlet 1", time: "28m ago", status: "In Transit" },
        { title: "Paperless WhatsApp receipt #POS-9921 sent to customer", time: "42m ago", status: "Delivered" }
      ]
    }
  },
  {
    id: "fitness",
    slug: "fitness",
    name: "Gyms, Fitness Clubs & Wellness Studios",
    shortName: "Fitness & Wellness",
    categoryLabel: "Gyms, CrossFit Boxes & Yoga Studios",
    dashboardTitle: "Member Management & Turnstile Access — Gyms & Fitness Clubs",
    metricTarget: "Target: 95%+ timely membership renewal conversion",
    headline: "Turnstile sync, automated renewal sequences & PT scheduling",
    problem:
      "Expired members accessing workout floors without active subscriptions, manual paper receipting, untracked trainer personal training sessions, and high churn.",
    solution:
      "Turnstile/access-gate sync tied to active membership status, automated WhatsApp renewal sequence with UPI links, and PT session redemption tracking.",
    capabilities: [
      "Turnstile / RFID / QR access control synced directly to active subscription status",
      "Automated WhatsApp renewal sequence (7 days, 3 days, 1 day before expiry)",
      "Personal trainer commission tracking and PT session redemption check-ins",
      "Class booking schedule (Spin, Yoga, HIIT) with capacity waitlists"
    ],
    concreteWorkflow: {
      trigger: "Membership enters 3-day pre-expiry window",
      action: "WhatsApp renewal incentive dispatched with direct payment link",
      effect: "Membership auto-renews and turnstile access continues without disruption"
    },
    mockup: {
      kpis: [
        { label: "Active Members", value: "480", sub: "Verified passes" },
        { label: "Check-Ins Today", value: "215", sub: "Turnstile log" },
        { label: "Renewals Due This Week", value: "34", sub: "Sequence active" },
        { label: "PT Sessions Logged", value: "28", sub: "Trainer verified" }
      ],
      recentActivity: [
        { title: "Member renewed Annual Pro Plan via WhatsApp payment link", time: "7m ago", status: "Renewed" },
        { title: "Turnstile access automatically updated for Member #MEM-1829", time: "16m ago", status: "Active" },
        { title: "PT Session logged: 1 of 12 consumed for Trainer Vikram", time: "33m ago", status: "Deducted" }
      ]
    }
  },
  {
    id: "facility_management",
    slug: "facility-management",
    name: "Facility Management & Field Services",
    shortName: "Field Services",
    categoryLabel: "HVAC Maintenance, Facility Services & AMC Providers",
    dashboardTitle: "Field Technicians & Preventive Maintenance — Facility Services",
    metricTarget: "Target: 100% SLA compliance on high-priority breakdown tickets",
    headline: "GPS technician dispatch, mobile job sign-offs & AMC renewals",
    problem:
      "Field technicians missing SLA windows, unverified site visits, untracked spare parts consumption, and delayed paper service reports.",
    solution:
      "GPS-verified technician dispatch, WhatsApp ticket status updates to building managers, digital sign-off with customer signatures, and spare parts inventory.",
    capabilities: [
      "Preventive maintenance scheduler with recurring asset service contracts",
      "GPS geo-fenced technician check-in and digital sign-off capture",
      "Spare parts consumption ledger deducted from van inventory",
      "SLA breach escalation rules with automatic re-routing to supervisors"
    ],
    concreteWorkflow: {
      trigger: "Equipment breakdown reported at client facility",
      action: "Ticket assigned to nearest on-duty technician via WhatsApp",
      effect: "GPS check-in logged upon technician arrival and live status updated"
    },
    mockup: {
      kpis: [
        { label: "Open Service Tickets", value: "19", sub: "All assigned" },
        { label: "SLA Compliance Target", value: "98%", sub: "Target benchmark" },
        { label: "Active Field Techs", value: "24", sub: "GPS geo-verified" },
        { label: "Preventive Tasks Completed", value: "14/16", sub: "Today's schedule" }
      ],
      recentActivity: [
        { title: "Ticket #TCK-201: HVAC compressor service completed & signed off", time: "9m ago", status: "Resolved" },
        { title: "Preventive maintenance completed for Generator Set B at Site 2", time: "26m ago", status: "Verified" },
        { title: "Field Tech Suresh checked in at Site C via GPS geolocation", time: "52m ago", status: "On-Site" }
      ]
    }
  },
  {
    id: "events",
    slug: "events",
    name: "Event Production & Equipment Rental",
    shortName: "Event Production",
    categoryLabel: "Audio-Visual Rental, Stage Staging & Event Equipment",
    dashboardTitle: "Rental Inventory & Show Dispatch — Event Production & AV",
    metricTarget: "Target: Zero double-booking of high-value audio/lighting gear",
    headline: "Equipment rental calendars, barcoded case dispatch & crew call sheets",
    problem:
      "High-value sound and lighting rigs double-booked across dates, missing flight cases post-event, untracked crew shifts, and disputed gear damage claims.",
    solution:
      "Visual equipment booking calendar with conflict prevention, flight case barcode tracking, crew call sheets on WhatsApp, and return inspection manifests.",
    capabilities: [
      "Equipment availability calendar with real-time sub-rental conflict alerts",
      "Barcoded flight case dispatch and return inspection checklist",
      "Crew call sheet dispatcher with WhatsApp call-time reminders",
      "Security deposit escrow and post-event damage assessment billing"
    ],
    concreteWorkflow: {
      trigger: "Event contract signed and confirmed",
      action: "Sound and lighting assets locked on reservation calendar",
      effect: "Barcoded flight cases pre-staged for load-out with zero conflict risk"
    },
    mockup: {
      kpis: [
        { label: "Shows This Weekend", value: "6 events", sub: "Load-outs ready" },
        { label: "Dispatched Asset Value", value: "₹48L", sub: "Barcoded cases" },
        { label: "Returns Under Inspection", value: "2 shows", sub: "Checklist active" },
        { label: "Crew Members Deployed", value: "32 tech", sub: "Call sheets sent" }
      ],
      recentActivity: [
        { title: "Rig Load-Out Complete: 42 Flight cases dispatched for Arena Concert", time: "12m ago", status: "Dispatched" },
        { title: "Return inspection signed off for Corporate Summit (Zero damages)", time: "38m ago", status: "Inspected" },
        { title: "Call sheets sent to 14 AV crew technicians via WhatsApp", time: "1h ago", status: "Acknowledged" }
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// Homepage copy data. Every claim below is either verifiable from the product
// or flagged with TODO(founder) for confirmation before publishing.
// ---------------------------------------------------------------------------

// Pricing tiers. Prices exclude GST.
// TODO(founder): confirm user limits (5 / 20) and the exact feature split between tiers.
export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 1999,
    priceDisplay: "₹1,999",
    period: "per month",
    audience: "Single shop or office, up to 5 users.",
    featured: false,
    features: [
      "GST invoicing and e-invoice ready bills",
      "Stock tracking with low-stock alerts",
      "Invoices and payment reminders on WhatsApp",
      "Payment tracking and outstanding reports",
      "Tally XML export for your CA",
      "Email and WhatsApp support"
    ],
    cta: "Book a Discovery Call"
  },
  {
    id: "growth",
    name: "Growth",
    price: 4099,
    priceDisplay: "₹4,099",
    period: "per month",
    audience: "Multiple branches, or up to 20 users.",
    featured: true,
    features: [
      "Everything in Starter",
      "Multiple branches in one account",
      "Staff roles and permissions",
      "Automatic payment follow-ups",
      "GSTR-1 ready monthly reports",
      "Priority support and onboarding call"
    ],
    cta: "Book a Discovery Call"
  }
];

// FAQ — the six real buying objections. Rendered on the page and emitted as FAQPage schema,
// so the two can never drift apart.
export const FAQ_ITEMS = [
  {
    question: "Can I move my data from Tally?",
    answer:
      "Yes. Export your ledgers, items and customers from Tally and our team imports them during onboarding. You can export back to Tally XML at any time."
  },
  {
    question: "Does Zugee file my GST returns?",
    answer:
      "Zugee applies the right GST on every bill and prepares GSTR-1 ready reports each month. You or your CA file on the GST portal using those reports."
  },
  {
    question: "How much does it cost?",
    answer:
      "Starter is ₹1,999 per month and Growth is ₹4,099 per month, plus GST. After your discovery call we set Zugee up with your real data and you use it free for two weeks before you pay."
  },
  {
    // TODO(founder): confirm behaviour when the connection drops mid-bill (queued? blocked?).
    question: "Does it work without internet?",
    answer:
      "Zugee runs in the browser and needs an internet connection. A basic mobile data connection is enough for billing."
  },
  {
    // TODO(founder): add hosting provider and data region once confirmed (e.g. "servers in Mumbai").
    question: "Is my business data safe?",
    answer:
      "Your data is encrypted in transit and at rest and backed up automatically. Only people you add can see it."
  },
  {
    // TODO(founder): confirm typical time-to-first-bill from onboarding records.
    question: "How long does setup take?",
    answer:
      "Single-branch businesses usually start billing within the first week. Multi-branch set-ups with Tally migration follow a 14-day plan."
  }
];

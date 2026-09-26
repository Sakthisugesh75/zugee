// lib/industries.js
// Industry definitions and product mappings for the interactive industry selector

export const INDUSTRIES = [
  {
    id: "retail",
    name: "Retail & Distribution",
    icon: "🏪",
    description: "Complete business management for retail stores, distributors, and trading businesses.",
    color: "emerald", // emerald-500
    productSlugs: ["core-erp"]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "⚙️",
    description: "End-to-end production management from raw materials to finished goods.",
    color: "blue", // blue-500
    productSlugs: ["manuflow"]
  },
  {
    id: "travel",
    name: "Travel & Tourism",
    icon: "✈️",
    description: "Everything your travel business needs to manage enquiries, packages, quotations, and bookings.",
    color: "sky", // sky-500
    productSlugs: ["tours-travels"]
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏢",
    description: "Manage properties, leads, site visits, and bookings efficiently.",
    color: "violet", // violet-500
    productSlugs: ["real-estate"]
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    description: "Complete student management, attendance, fees, and academic workflows.",
    color: "amber", // amber-500
    productSlugs: ["school-erp", "college"]
  },
  {
    id: "fleet",
    name: "Fleet & Logistics",
    icon: "🚚",
    description: "Track vehicles, drivers, bookings, trips, and maintenance in one platform.",
    color: "orange", // orange-500
    productSlugs: ["transposs", "aqua-erp", "logistics"]
  },
  {
    id: "hospitality",
    name: "Hospitality",
    icon: "🏨",
    description: "Streamline bookings, guests, rooms, and services for hospitality businesses.",
    color: "pink", // pink-500
    productSlugs: ["resort", "pg-management"]
  },
  {
    id: "services",
    name: "Service Businesses",
    icon: "💼",
    description: "Customer management, appointments, and operations for service providers.",
    color: "cyan", // cyan-500
    productSlugs: ["gym", "salon", "medical", "core-erp"]
  }
];

export function getIndustry(id) {
  return INDUSTRIES.find((i) => i.id === id) || null;
}

export function getIndustryForProduct(productSlug) {
  return INDUSTRIES.find((i) => i.productSlugs.includes(productSlug)) || null;
}

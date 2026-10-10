// Fabrova (product id "manuflow"): /garment-manufacturing-erp. Field reference: lib/product-pages.js.
//
// Positioned as garment / textile manufacturing ERP (founder, 2026-10-10). Feature list from the
// founder's brief, which cites the ManuFlow docs/ARCHITECTURE.md. Rules for this page:
// - Say "cost insights", never "AI".
// - Make no claim of multi-user shared data, cloud storage or role-based access: most Fabrova
//   modules still keep their data in the browser (ARCHITECTURE.md §1, §7).
// - No internal technical details (stack, security design, file names).

const page = {
  primaryKeyword: "garment manufacturing ERP software",
  secondaryKeywords: [
    "textile ERP software India",
    "job card software for garments",
    "job work / outsourcing management",
    "cutting and waste tracking",
    "batch traceability for garments"
  ],
  title: "Garment Manufacturing ERP Software | Fabrova by ZUGEE",
  metaDescription:
    "Fabrova is garment manufacturing ERP software: job cards, BOM, cutting, job work, QC, packing and batch traceability for Indian apparel units. Book a demo.",
  h1: "Garment manufacturing ERP software for Indian apparel units",
  intro:
    "Fabrova follows every order from the buyer's enquiry to the packed carton: proforma and advance, job card and BOM, cutting, stitching, job work, quality checks and dispatch. Our team sets it up for your unit in 14 days, brings your buyers, styles and materials across and trains your staff in the language they read best.",
  sampleRows: [
    { name: "Job card #SAMPLE-JC-214", stage: "Stitching", value: "2,400 pcs", time: "Day 6" },
    { name: "Sample job worker · Embroidery", stage: "Out for job work", value: "800 pcs", time: "Due Fri" },
    { name: "Lot #SAMPLE-L07 · Cutting", stage: "Waste recorded", value: "3.2 kg", time: "Today" },
    { name: "Proforma #SAMPLE-PI-58", stage: "Advance received", value: "₹2,40,000", time: "Sample Exports" }
  ],
  problemsHeading: "Tracking orders on paper job cards, phone calls and a dozen job workers?",
  problems: [
    "Job cards are on paper, so finding where an order stands means walking the floor and calling the embroidery unit.",
    "Fabric goes to cutting, but nobody records how much came back as waste until the margin has already gone.",
    "Job workers take pieces for printing or washing, and the balance due back from each one sits in a notebook.",
    "When a buyer asks which lot a shipment came from, the answer takes a day of digging through registers."
  ],
  solutions: [
    "Each order has a job card with its BOM and stages, so you can see whether it is at cutting, stitching, washing or packing.",
    "Cutting output and waste are recorded per job card, so you compare what was planned with what was actually used.",
    "Pieces sent out for job work are recorded per vendor, with what came back, what is pending and what you owe them.",
    "Batches are traced from material receipt to packing, so a lot can be followed back through every stage."
  ],
  featuresHeading: "Textile ERP software for the whole order cycle",
  features: [
    {
      icon: "ClipboardList",
      title: "Job card software for garments",
      text: "Create a job card for each style or order with its bill of materials and the stages it will pass through: cutting, stitching, dyeing, printing, embroidery, washing, QC and packing. Move it stage by stage as work progresses."
    },
    {
      icon: "Handshake",
      title: "Job work / outsourcing management",
      text: "Record pieces sent to job workers for printing, embroidery or washing, what has come back and what is pending. Track vendor payments and rate each job worker, so the next order goes to the right unit."
    },
    {
      icon: "Scissors",
      title: "Cutting and waste tracking",
      text: "Record fabric issued to cutting, pieces cut and the waste from each lay. Over a season you can see which styles use fabric well and where it is being lost."
    },
    {
      icon: "ScanLine",
      title: "Batch traceability for garments",
      text: "Follow a batch from the fabric and trims received, through each stage, to the packed cartons. When a buyer raises a question about a lot, its history is already recorded."
    },
    {
      icon: "Package",
      title: "Textile ERP software India units use for purchase and stock",
      text: "Raise purchase orders for fabric, yarn and trims, record what arrives against them with a GRN, and keep inventory of raw materials and finished goods in one place."
    },
    {
      icon: "ClipboardCheck",
      title: "Quality control, packing and dispatch",
      text: "Record QC results before packing, pack against the order and record the dispatch. Rejected pieces are noted at the QC stage instead of being found by the buyer."
    }
  ],
  workflowHeading: "How a garment order runs in Fabrova",
  workflow: [
    {
      title: "Win the order and take the advance",
      text: "An enquiry from a Bengaluru brand for 5,000 polo T-shirts is entered as a lead. When the price is agreed, a proforma invoice goes out and the advance is recorded against it before production starts."
    },
    {
      title: "Plan, buy, cut and stitch",
      text: "A job card is made with the BOM for fabric, rib, buttons and labels. Fabric is bought on a purchase order and received with a GRN, then cut with the waste recorded, and moved on to stitching."
    },
    {
      title: "Job work, QC and dispatch",
      text: "Pieces go to a printing job worker and come back recorded against that vendor. After QC and packing the batch is dispatched, and its history stays traceable from fabric to carton."
    }
  ],
  audienceIntro:
    "Fabrova is built for the knitwear and garment units of India's textile clusters. An exporter in Tirupur shipping T-shirts, a home-textile unit in Karur, a job worker in Erode doing dyeing or printing for larger mills, a woollen knitwear maker in Ludhiana and an apparel manufacturer in Surat all run on job cards, job workers and thin margins on fabric. Beyond production, Fabrova also covers accounts, HR for your workers and cost insights that compare what an order really cost with what you quoted.",
  audiences: [
    "Garment exporters",
    "Knitwear units",
    "Textile job workers",
    "Apparel manufacturers",
    "Tirupur, Erode, Karur, Ludhiana and Surat clusters"
  ],
  setup: [
    "We study your process: the styles you make, the stages each order passes through, and which work goes to job workers.",
    "We show Fabrova with one of your real styles and its BOM, so your merchandiser and floor supervisor see their own order.",
    "We bring your buyers, job workers, materials and styles across from Excel or your Tally exports.",
    "Merchandising, stores and production staff are trained in their preferred language, and new orders start in Fabrova."
  ],
  faqSubtitle: "What garment and textile units ask us before they switch",
  faqs: [
    {
      q: "What is garment manufacturing ERP software?",
      a: "Garment manufacturing ERP software runs a garment unit's order cycle in one system: orders, materials, job cards, production stages, job work, quality and dispatch. Fabrova is ZUGEE's garment manufacturing ERP, made for apparel and knitwear units in India."
    },
    {
      q: "Is Fabrova suitable for a small garment unit or a job worker?",
      a: "Yes. A small unit feels a lost job card or unrecorded waste more than a big one does. Fabrova is set up around your own stages and volumes, so a small unit and a larger exporter follow the same job card flow."
    },
    {
      q: "Can I use Fabrova on a phone or tablet?",
      a: "Fabrova runs in a web browser, so it opens on a computer, a tablet or an Android phone. Which screens your team uses on which device depends on how your unit works, so we plan that with you during the 14-day setup."
    },
    {
      q: "Does Fabrova handle proforma invoices, advances and billing?",
      a: "Yes. Fabrova tracks proforma invoices and the advances received against them, and its accounts records what buyers pay you and what you pay suppliers and job workers. Your chartered accountant can keep using Tally for GST returns, and we export the data they need."
    },
    {
      q: "Does Fabrova work in Tamil, Hindi and other languages?",
      a: "Yes. Fabrova is available in 11 languages, so supervisors and stores staff can work in the language they read best. It also includes HR for your workers and cost insights that show what each order really cost."
    },
    // TODO(founder): add a starting price to this answer once it is confirmed.
    {
      q: "How much does Fabrova cost?",
      a: "Fabrova's price depends on the number of users and branches or units, plus a one-time setup fee for mapping your stages, bringing your data across and training staff. We share a clear quote on a short call."
    }
  ],
  related: ["erp-crm-software", "water-supply-erp", "fleet-management-software"]
};

export default page;

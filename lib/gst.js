// lib/gst.js
// Deterministic GST invoice maths for the website assistant (and anything else that needs it).
// Educational estimates only: it does not decide how a real transaction is taxed (rate, place of
// supply, whether a charge is part of the taxable value). That depends on the facts and on the law at
// the time, so every result carries its assumptions and a note to confirm with a tax professional.
// No JSX and relative imports only, so `node --test` can load this file.
//
// All arithmetic is in whole paise (integers), so results never carry floating-point error.
// Rounding: each computed amount is rounded to the nearest paisa (half away from zero).

// Common rates, used only to warn about an unusual rate, never to reject or "snap" one.
// GST rates change (docs/ZUGEE-PLATFORM-PLAN.md: never hardcode slabs as the only valid values).
const COMMON_RATES = [0, 0.1, 0.25, 1, 1.5, 3, 5, 6, 7.5, 12, 18, 28, 40];

export class GstInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "GstInputError";
  }
}

/** Rupees (number) → paise (integer), rejecting anything that is not a finite amount. */
function toPaise(rupees, field) {
  if (typeof rupees !== "number" || !Number.isFinite(rupees)) throw new GstInputError(`${field} must be a number`);
  if (rupees < 0) throw new GstInputError(`${field} cannot be negative`);
  if (rupees > 1e12) throw new GstInputError(`${field} is too large`);
  return Math.round(rupees * 100);
}

/** amountPaise × percent / 100, rounded to the nearest paisa (half away from zero). */
function percentOf(amountPaise, percent) {
  // Work in hundredths of a percent as integers to avoid 0.1 + 0.2-style error.
  const basisPoints = Math.round(percent * 100);
  const exact = (amountPaise * basisPoints) / 10000;
  return Math.sign(exact) * Math.round(Math.abs(exact));
}

function checkRate(rate, field) {
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new GstInputError(`${field} must be a percentage between 0 and 100`);
  }
}

/** Indian-format rupees from paise: 9062400 → "₹90,624.00". */
export function formatRupees(paise) {
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / 100);
  const fraction = String(abs % 100).padStart(2, "0");
  const digits = String(rupees);
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}` : last3;
  return `${sign}₹${grouped}.${fraction}`;
}

/**
 * @typedef {{ description?: string, quantity: number, unitPrice: number, gstRatePercent: number,
 *             discountPercent?: number, discountAmount?: number }} GstLine
 * @typedef {{ label: string, amount: number, gstRatePercent?: number, taxable?: boolean }} GstCharge
 *
 * @param {{ lines: GstLine[], charges?: GstCharge[], pricesIncludeGst?: boolean, roundOffTotal?: boolean }} input
 *   lines            goods or services; unitPrice in rupees. A discount is either a percent or an amount for the line.
 *   charges          extra invoice charges such as transport or packing. taxable defaults to true; when
 *                    taxable and gstRatePercent is omitted, the charge takes the rate of the lines (only
 *                    allowed when all lines share one rate).
 *   pricesIncludeGst unit prices already include GST (MRP-style): the taxable value is backed out.
 *   roundOffTotal    also give the invoice total rounded to the nearest rupee, with the round-off line.
 */
export function calculateGstInvoice(input) {
  if (!input || !Array.isArray(input.lines) || input.lines.length === 0) {
    throw new GstInputError("at least one line (quantity, unit price, GST rate) is needed");
  }
  if (input.lines.length > 50) throw new GstInputError("too many lines (50 at most)");
  const charges = input.charges ?? [];
  if (!Array.isArray(charges) || charges.length > 20) throw new GstInputError("charges must be a list (20 at most)");
  const pricesIncludeGst = Boolean(input.pricesIncludeGst);
  const warnings = [];

  const lineRates = new Set();
  const lines = input.lines.map((line, i) => {
    const n = i + 1;
    if (!line || typeof line !== "object") throw new GstInputError(`line ${n} is invalid`);
    if (typeof line.quantity !== "number" || !Number.isFinite(line.quantity) || line.quantity <= 0 || line.quantity > 1e9) {
      throw new GstInputError(`line ${n}: quantity must be a positive number`);
    }
    checkRate(line.gstRatePercent, `line ${n}: GST rate`);
    lineRates.add(line.gstRatePercent);
    const unitPaise = toPaise(line.unitPrice, `line ${n}: unit price`);
    // Quantity may be fractional (kg, litres); value rounded to the paisa.
    let grossPaise = Math.round(unitPaise * line.quantity);
    if (pricesIncludeGst) {
      // Back out GST: value = price × 100 / (100 + rate).
      grossPaise = Math.round((grossPaise * 10000) / (10000 + Math.round(line.gstRatePercent * 100)));
    }

    if (line.discountPercent != null && line.discountAmount != null) {
      throw new GstInputError(`line ${n}: give a discount percent or a discount amount, not both`);
    }
    let discountPaise = 0;
    if (line.discountPercent != null) {
      if (typeof line.discountPercent !== "number" || line.discountPercent < 0 || line.discountPercent > 100) {
        throw new GstInputError(`line ${n}: discount percent must be between 0 and 100`);
      }
      discountPaise = percentOf(grossPaise, line.discountPercent);
    } else if (line.discountAmount != null) {
      discountPaise = toPaise(line.discountAmount, `line ${n}: discount amount`);
      if (discountPaise > grossPaise) throw new GstInputError(`line ${n}: discount is larger than the line value`);
    }
    return {
      description: typeof line.description === "string" ? line.description.slice(0, 80) : `Line ${n}`,
      quantity: line.quantity,
      gstRatePercent: line.gstRatePercent,
      grossPaise,
      discountPaise,
      taxablePaise: grossPaise - discountPaise
    };
  });

  for (const rate of lineRates) {
    if (!COMMON_RATES.includes(rate)) warnings.push(`${rate}% is not a common GST rate; check the rate for this item.`);
  }

  const chargeRows = charges.map((charge, i) => {
    const n = i + 1;
    if (!charge || typeof charge !== "object") throw new GstInputError(`charge ${n} is invalid`);
    const taxable = charge.taxable !== false;
    let rate = 0;
    if (taxable) {
      if (charge.gstRatePercent != null) {
        checkRate(charge.gstRatePercent, `charge ${n}: GST rate`);
        rate = charge.gstRatePercent;
      } else if (lineRates.size === 1) {
        rate = [...lineRates][0];
      } else {
        throw new GstInputError(`charge ${n}: the lines have different GST rates, so give this charge its own rate`);
      }
    }
    const amountPaise = toPaise(charge.amount, `charge ${n}: amount`);
    return {
      label: typeof charge.label === "string" && charge.label.trim() ? charge.label.slice(0, 60) : `Charge ${n}`,
      taxable,
      gstRatePercent: rate,
      amountPaise,
      taxablePaise: taxable ? amountPaise : 0
    };
  });

  // Tax is computed per rate on the combined taxable value at that rate (as on a GST invoice summary).
  const byRate = new Map();
  for (const row of [...lines, ...chargeRows.filter((c) => c.taxable)]) {
    byRate.set(row.gstRatePercent, (byRate.get(row.gstRatePercent) ?? 0) + row.taxablePaise);
  }
  const taxByRate = [...byRate.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rate, taxablePaise]) => {
      const half = percentOf(taxablePaise, rate / 2);
      return { gstRatePercent: rate, taxablePaise, cgstPaise: half, sgstPaise: half, igstPaise: percentOf(taxablePaise, rate) };
    });

  const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);
  const grossGoodsPaise = sum(lines, "grossPaise");
  const discountPaise = sum(lines, "discountPaise");
  const goodsAfterDiscountPaise = sum(lines, "taxablePaise");
  const chargesTaxablePaise = sum(chargeRows.filter((c) => c.taxable), "amountPaise");
  const chargesExemptPaise = sum(chargeRows.filter((c) => !c.taxable), "amountPaise");
  const taxablePaise = goodsAfterDiscountPaise + chargesTaxablePaise;
  const cgstPaise = sum(taxByRate, "cgstPaise");
  const sgstPaise = sum(taxByRate, "sgstPaise");
  const igstPaise = sum(taxByRate, "igstPaise");

  const totalFor = (taxPaise) => {
    const exact = taxablePaise + taxPaise + chargesExemptPaise;
    if (!input.roundOffTotal) return { totalPaise: exact };
    const rounded = Math.round(exact / 100) * 100;
    return { totalPaise: exact, roundOffPaise: rounded - exact, roundedTotalPaise: rounded };
  };
  const intra = totalFor(cgstPaise + sgstPaise);
  const inter = totalFor(igstPaise);

  const assumptions = [
    "Educational estimate, not tax or legal advice and not a tax invoice.",
    "Discounts are shown on the invoice at the time of supply, so they reduce the taxable value.",
    "Intra-state supply (supplier and place of supply in the same state) is taxed as CGST + SGST; inter-state supply as IGST. Which applies depends on the place of supply.",
    pricesIncludeGst
      ? "Unit prices were treated as including GST, so the taxable value was backed out of them."
      : "Unit prices were treated as excluding GST."
  ];
  if (chargeRows.some((c) => c.taxable)) {
    assumptions.push(
      "Extra charges marked taxable (such as transport billed by the supplier) were added to the taxable value. Whether a charge is taxable, and at what rate, depends on the transaction (for example transport by a goods transport agency can be taxed differently)."
    );
  }
  if (cgstPaise + sgstPaise !== igstPaise) {
    warnings.push("CGST + SGST differs from IGST by a paisa because each half is rounded separately.");
  }

  const f = formatRupees;
  return {
    lines: lines.map((l) => ({ description: l.description, quantity: l.quantity, gstRatePercent: l.gstRatePercent, gross: f(l.grossPaise), discount: f(l.discountPaise), taxableValue: f(l.taxablePaise) })),
    charges: chargeRows.map((c) => ({ label: c.label, taxable: c.taxable, gstRatePercent: c.gstRatePercent, amount: f(c.amountPaise) })),
    grossGoodsValue: f(grossGoodsPaise),
    discount: f(discountPaise),
    goodsValueAfterDiscount: f(goodsAfterDiscountPaise),
    taxableCharges: f(chargesTaxablePaise),
    nonTaxableCharges: f(chargesExemptPaise),
    taxableValue: f(taxablePaise),
    taxByRate: taxByRate.map((t) => ({ gstRatePercent: t.gstRatePercent, taxableValue: f(t.taxablePaise), cgst: f(t.cgstPaise), sgst: f(t.sgstPaise), igst: f(t.igstPaise) })),
    intraState: {
      cgst: f(cgstPaise),
      sgst: f(sgstPaise),
      total: f(intra.totalPaise),
      ...(intra.roundOffPaise != null ? { roundOff: f(intra.roundOffPaise), roundedTotal: f(intra.roundedTotalPaise) } : {})
    },
    interState: {
      igst: f(igstPaise),
      total: f(inter.totalPaise),
      ...(inter.roundOffPaise != null ? { roundOff: f(inter.roundOffPaise), roundedTotal: f(inter.roundedTotalPaise) } : {})
    },
    assumptions,
    warnings,
    // The same totals in paise, for tests and callers that need numbers.
    paise: { grossGoodsPaise, discountPaise, taxablePaise, cgstPaise, sgstPaise, igstPaise, intraTotalPaise: intra.totalPaise, interTotalPaise: inter.totalPaise }
  };
}

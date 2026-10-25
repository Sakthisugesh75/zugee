// tests/gst.test.mjs
// The GST calculator the chat assistant calls. Exact expected values (paise and formatted ₹).
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGstInvoice, formatRupees, GstInputError } from "../lib/gst.js";

test("the reference invoice: 100 × ₹850, 12% discount, ₹2,000 transport, 18% GST", () => {
  const r = calculateGstInvoice({
    lines: [{ quantity: 100, unitPrice: 850, discountPercent: 12, gstRatePercent: 18 }],
    charges: [{ label: "Transportation", amount: 2000 }]
  });
  assert.equal(r.grossGoodsValue, "₹85,000.00");
  assert.equal(r.discount, "₹10,200.00");
  assert.equal(r.goodsValueAfterDiscount, "₹74,800.00");
  assert.equal(r.taxableCharges, "₹2,000.00");
  assert.equal(r.taxableValue, "₹76,800.00");
  assert.equal(r.intraState.cgst, "₹6,912.00");
  assert.equal(r.intraState.sgst, "₹6,912.00");
  assert.equal(r.interState.igst, "₹13,824.00");
  assert.equal(r.intraState.total, "₹90,624.00");
  assert.equal(r.interState.total, "₹90,624.00");
  assert.ok(r.assumptions.some((a) => /transport/i.test(a)), "the transport assumption is stated");
  assert.ok(r.assumptions.some((a) => /not tax or legal advice/i.test(a)));
});

test("CGST/SGST vs IGST and a paisa difference from rounding each half", () => {
  // 18% on ₹100.01: IGST 18.0018 → ₹18.00; each 9% half 9.0009 → ₹9.00 → same here.
  const a = calculateGstInvoice({ lines: [{ quantity: 1, unitPrice: 100.01, gstRatePercent: 18 }] });
  assert.equal(a.paise.igstPaise, 1800);
  assert.equal(a.paise.cgstPaise + a.paise.sgstPaise, 1800);
  // 5% on ₹0.30: IGST 1.5p → 2p; each 2.5% half 0.75p → 1p each → 2p. 5% on ₹0.10: IGST 0.5p → 1p; halves 0.25p → 0p each.
  const b = calculateGstInvoice({ lines: [{ quantity: 1, unitPrice: 0.1, gstRatePercent: 5 }] });
  assert.equal(b.paise.igstPaise, 1);
  assert.equal(b.paise.cgstPaise + b.paise.sgstPaise, 0);
  assert.ok(b.warnings.some((w) => /paisa/.test(w)));
});

test("multiple rates, a fixed discount, a non-taxable charge and round-off", () => {
  const r = calculateGstInvoice({
    lines: [
      { description: "Rice 25kg", quantity: 4, unitPrice: 1250, gstRatePercent: 5, discountAmount: 100 },
      { description: "Steel rack", quantity: 1, unitPrice: 3999.5, gstRatePercent: 18 }
    ],
    charges: [
      { label: "Packing", amount: 150, gstRatePercent: 18 },
      { label: "Govt fee (reimbursement)", amount: 75, taxable: false }
    ],
    roundOffTotal: true
  });
  // Rice: 5000 - 100 = 4900 @5% → 245.00. Rack 3999.50 + packing 150 = 4149.50 @18% → 746.91.
  assert.deepEqual(r.taxByRate.map((t) => [t.gstRatePercent, t.taxableValue, t.igst]), [
    [5, "₹4,900.00", "₹245.00"],
    [18, "₹4,149.50", "₹746.91"]
  ]);
  assert.equal(r.taxableValue, "₹9,049.50");
  assert.equal(r.nonTaxableCharges, "₹75.00");
  // 9049.50 + 991.91 + 75 = 10116.41 → rounded 10116.00, round-off -0.41
  assert.equal(r.interState.total, "₹10,116.41");
  assert.equal(r.interState.roundOff, "-₹0.41");
  assert.equal(r.interState.roundedTotal, "₹10,116.00");
  // CGST+SGST: 5% → 122.50+122.50; 18% → 373.46 (9% of 4149.50 = 373.455 → 373.46) ×2 = 746.92
  assert.equal(r.intraState.cgst, "₹495.96");
  assert.equal(r.intraState.total, "₹10,116.42");
});

test("prices that already include GST are backed out", () => {
  const r = calculateGstInvoice({ lines: [{ quantity: 1, unitPrice: 118, gstRatePercent: 18 }], pricesIncludeGst: true });
  assert.equal(r.taxableValue, "₹100.00");
  assert.equal(r.interState.igst, "₹18.00");
  assert.equal(r.interState.total, "₹118.00");
});

test("Indian number formatting", () => {
  assert.equal(formatRupees(0), "₹0.00");
  assert.equal(formatRupees(99), "₹0.99");
  assert.equal(formatRupees(10030000), "₹1,00,300.00");
  assert.equal(formatRupees(123456789012), "₹1,23,45,67,890.12");
  assert.equal(formatRupees(-41), "-₹0.41");
});

test("bad input is rejected with a clear message, never a wrong number", () => {
  const bad = [
    undefined,
    { lines: [] },
    { lines: [{ quantity: 0, unitPrice: 10, gstRatePercent: 18 }] },
    { lines: [{ quantity: 1, unitPrice: -5, gstRatePercent: 18 }] },
    { lines: [{ quantity: 1, unitPrice: "850", gstRatePercent: 18 }] },
    { lines: [{ quantity: 1, unitPrice: 10, gstRatePercent: 180 }] },
    { lines: [{ quantity: 1, unitPrice: 10, gstRatePercent: 18, discountPercent: 10, discountAmount: 1 }] },
    { lines: [{ quantity: 1, unitPrice: 10, gstRatePercent: 18, discountAmount: 11 }] },
    // Mixed line rates: a charge must state its own rate.
    { lines: [{ quantity: 1, unitPrice: 10, gstRatePercent: 5 }, { quantity: 1, unitPrice: 10, gstRatePercent: 18 }], charges: [{ label: "Freight", amount: 5 }] }
  ];
  for (const input of bad) assert.throws(() => calculateGstInvoice(input), GstInputError, JSON.stringify(input));
});

test("an unusual rate is calculated but flagged", () => {
  const r = calculateGstInvoice({ lines: [{ quantity: 1, unitPrice: 100, gstRatePercent: 14 }] });
  assert.equal(r.interState.igst, "₹14.00");
  assert.ok(r.warnings.some((w) => /not a common GST rate/.test(w)));
});

// lib/chatbot/tools.js
// Tools the chat assistant can call. The model decides when; the server runs the code. Arithmetic
// never comes from the model: calculate_gst_invoice runs lib/gst.js and returns formatted figures.
// No JSX and relative imports only, so `node --test` can load this file.

import { calculateGstInvoice, GstInputError } from "../gst.js";

// Gemini function declaration (OpenAPI-style schema subset).
export const GST_TOOL = {
  name: "calculate_gst_invoice",
  description:
    "Exact GST invoice maths for an educational estimate: taxable value, discount, CGST + SGST (intra-state), IGST (inter-state) and totals, with Indian-format rupee amounts and the assumptions used. Use it for every GST, discount or invoice-total calculation.",
  parameters: {
    type: "object",
    properties: {
      lines: {
        type: "array",
        description: "Goods or services on the invoice.",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            quantity: { type: "number", description: "Number of units (may be fractional, e.g. kg)." },
            unitPrice: { type: "number", description: "Price per unit in rupees." },
            gstRatePercent: { type: "number", description: "GST rate in percent, e.g. 18." },
            discountPercent: { type: "number", description: "Discount on this line in percent (use this or discountAmount)." },
            discountAmount: { type: "number", description: "Discount on this line in rupees (use this or discountPercent)." }
          },
          required: ["quantity", "unitPrice", "gstRatePercent"]
        }
      },
      charges: {
        type: "array",
        description: "Extra invoice charges such as transport, freight or packing.",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            amount: { type: "number", description: "Amount in rupees." },
            taxable: { type: "boolean", description: "Whether GST applies to this charge. Default true." },
            gstRatePercent: { type: "number", description: "Rate for this charge; defaults to the lines' rate when they share one." }
          },
          required: ["label", "amount"]
        }
      },
      pricesIncludeGst: { type: "boolean", description: "True if the unit prices already include GST (MRP-style)." },
      roundOffTotal: { type: "boolean", description: "Also give the total rounded to the nearest rupee." }
    },
    required: ["lines"]
  }
};

export const TOOL_DECLARATIONS = [GST_TOOL];

/**
 * Runs a tool call from the model. Never throws: errors become { error } so the model can explain
 * what input is missing instead of the conversation failing.
 * @returns {{ result?: object, error?: string }}
 */
export function runTool(name, args) {
  if (name !== GST_TOOL.name) return { error: `Unknown tool: ${name}` };
  try {
    const { paise, ...result } = calculateGstInvoice(args ?? {});
    void paise; // numbers for tests only; the model gets the formatted figures
    return { result };
  } catch (error) {
    if (error instanceof GstInputError) return { error: `Cannot calculate: ${error.message}.` };
    return { error: "Cannot calculate with these values." };
  }
}

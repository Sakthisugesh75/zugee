# Ask ZUGEE: the website chat assistant

The chat button on every public page. It answers visitor questions about ZUGEE products, setup,
pricing approach and GST invoice maths, and hands off to the demo form or WhatsApp when that helps.

## How it works

```
components/chat/ChatWidget.jsx         chat panel (marketing layout); conversation kept in the tab only
        │  POST /api/chat  { messages: [{ role, content }] }
        ▼
app/api/chat/route.js                  rate limit (6/min, 40/hour per IP), guest limits, validation,
        │                              demo-repeat note and demo guard, clean JSON errors; streams text
        ├─ lib/chatbot/guest-limits.js guest quota, cooldown, burst, signed cookie (+ guest-store-supabase.js)
        ├─ lib/chatbot/demo-guard.js   drops a closing demo pitch the visitor did not ask for
        ├─ lib/chatbot/validate.js     request shape and size limits
        ├─ lib/chatbot/knowledge.js    system prompt: rules + all product knowledge (no prices)
        │    └─ lib/chatbot/capabilities.js   feature status registry (authoritative)
        ├─ lib/chatbot/tools.js        tools the model may call → lib/gst.js
        └─ lib/chatbot/gemini.js       Gemini REST streaming + function-calling loop (max 3 rounds)
```

- **Model:** Google Gemini, `gemini-3.5-flash-lite` by default (`GEMINI_MODEL` to change). Server-side
  only; the key never reaches the browser and is sent in a header, not the URL.
- **Knowledge:** the whole knowledge (≈ 15k tokens) is in the system prompt. There is no vector
  retrieval: the corpus is small enough to fit, and full context avoids "retrieved the wrong chunk"
  errors. `findCapabilities()` is a simple keyword lookup used by tests.
- **Arithmetic:** never done by the model. For any GST/discount/total the model calls
  `calculate_gst_invoice`, which runs `lib/gst.js` (integer paise, tested) and returns formatted ₹
  figures plus the assumptions.
- **Demo hand-off:** the model ends a reply with `[[demo:<product id>]]` only when a demo genuinely
  helps; the widget hides the marker and shows a "Book a … demo" button that pre-selects the product
  in the demo form. Once a demo has been offered, the route adds a note so it is not offered again
  unless the visitor asks.
- **Data:** nothing is stored on our side. No customer data is available to the assistant, so there
  is no tenant data to isolate. Errors are logged without message content.

## Usage limits

| Who | Limits | Where |
|---|---|---|
| Everyone | 6 messages/min and 40/hour per IP (memory, per server instance) | `app/api/chat/route.js` |
| Guests | 10 messages/day (reset at midnight Asia/Kolkata), 3 s cooldown, 5 per 30 s, 1,000 characters; plus 30/day and 10 per 30 s per IP as a backstop | `lib/chatbot/guest-limits.js` |
| Signed in | none of the guest limits; 2,000 characters | `chatPolicy()` |

"Signed in" means a valid admin session (`zugee_admin_session`): the public site has no other sign-in.

- **Identity:** a random guest ID in an httpOnly cookie (`zugee_chat_guest`, 30 days), HMAC-signed
  with `CHAT_GUEST_SECRET` (or a key derived from `ADMIN_JWT_SECRET`). Refreshing and new tabs share
  it; an edited or forged cookie is replaced. Clearing cookies gets a new ID, which the per-IP
  backstop limits. IPs are stored only as a keyed hash.
- **Store:** Supabase table `chat_guest_usage` (migration `0004`), one row per key, updated with
  compare-and-swap on `version`, so concurrent requests are counted exactly. Rows older than two days
  are deleted. Without the table or Supabase, guests get "not available" (fails closed).
- **When a limit is hit:** HTTP 429 with `Retry-After` and JSON `{ error, reason: daily|cooldown|burst,
  retryAfterSeconds, remaining, limit }`. For the daily limit the message is the one in
  `lib/chatbot/guest-copy.js`. A message the model never answered is refunded.
- **UI:** `GET /api/chat` returns `{ guest, remaining, limit }`; responses carry
  `X-Chat-Guest-Remaining`. The widget shows "N of 10 free messages left today".

## Updating what the assistant knows

| To change | Edit | Then |
|---|---|---|
| A feature's availability ("can it do X?") | `lib/chatbot/capabilities.js`: set the `status`, write the `answer`, cite `sources` | `npm test` |
| Product facts | `lib/products.js` and `lib/product-pages/*.js` (they also feed the website) | `npm test` |
| Homepage FAQ | `lib/site-content.js` | `npm test` |
| How it behaves (tone, policy) | `RULES` in `lib/chatbot/knowledge.js` | `npm test`, then `npm run chat:eval` |

Status rules (also in the file header):

| Status | Use when | The assistant says |
|---|---|---|
| `confirmed` | stated in founder-approved site copy or the Terms | it's available |
| `limited` | only some products, partly, or done by our team | exactly which / what stays manual |
| `coming_soon` | named as planned in site copy or `docs/ZUGEE-PLATFORM-PLAN.md` | planned, not available, no date |
| `unsupported` | the copy says ZUGEE does not do it | not offered, and the usual alternative |
| `unverified` | no reliable source | can't confirm; offers a check by the team |

Never mark something `confirmed` without a source, never add a price, and never give a date for
`coming_soon`. `tests/chatbot.test.mjs` locks the statuses that must not drift without evidence; if
you change one on purpose, update that test with the reason in the commit.

## Tests

```bash
npm test                      # all offline tests (no network, no quota)
node --test tests/gst.test.mjs tests/chatbot.test.mjs   # just the assistant
npm run build && npm start    # then, in another terminal:
CHAT_EVAL_ADMIN_PASSWORD=… npm run chat:eval -- http://localhost:3000   # live checks, signed in
npm run chat:eval -- http://localhost:3000 "gst"    # only cases whose name matches (as a guest)
```

The full live run sends 18 messages, more than a guest's 10 a day, so sign in for it
(`CHAT_EVAL_ADMIN_PASSWORD` is the admin portal password; the script uses the normal login).

- `tests/guest-limits.test.mjs`: IST day boundaries, daily quota and midnight reset, cooldown, burst,
  concurrent requests (memory and a fake Supabase), signed cookies and forgery, the IP backstop, the
  429 shape, and signed-in users being exempt.

- `tests/gst.test.mjs`: exact GST results (reference invoice ₹90,624, CGST/SGST vs IGST, rounding,
  inclusive prices, Indian formatting, bad input).
- `tests/chatbot.test.mjs`: knowledge and registry, status locks, retrieval, request validation, the
  GST tool, Gemini stream parsing, the tool-call round trip, tool-loop limit, provider failures.
- `scripts/chat-eval.mjs`: live, property-based checks (figures present, no prices, right status
  words, no leaked prompt or keys, no repeated demo offers, sensitive data not echoed). It uses the
  free-tier quota and waits 11 s between messages; answers vary, so a single failure can be noise:
  re-run that case before changing the prompt.

## Configuration

| Variable | Where | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Vercel (Production, Preview) and `.env.local` | From Google AI Studio. Without it the widget shows "not available" with demo and WhatsApp buttons. |
| `GEMINI_MODEL` | optional | Default `gemini-3.5-flash-lite`. `gemini-3.8-flash` answers more carefully but is slower. |
| `CHAT_GUEST_SECRET` | optional | 32+ characters; signs guest cookies and hashes IPs. Derived from `ADMIN_JWT_SECRET` if unset. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | required in production | Guest counters live in `chat_guest_usage`; run migration `0004` first. |
| `CHAT_GUEST_ALLOW_MEMORY_STORE` | local testing only | Lets `next start` run without Supabase. Never in production. |

Free tier: Google may use free-tier prompts to improve its products; the widget notice and the
Privacy Policy say so. Moving to Google's paid tier changes that and lifts the rate limits.

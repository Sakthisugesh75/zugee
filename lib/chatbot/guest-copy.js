// lib/chatbot/guest-copy.js
// Guest-limit wording shared by the server (lib/chatbot/guest-limits.js) and the chat widget.
// Kept separate because guest-limits.js uses Node's crypto and must stay out of the browser bundle.

export const GUEST_DAILY_LIMIT = 10;

export const GUEST_LIMIT_MESSAGE =
  "You've reached today's free chat limit for Ask ZUGEE. Sign in to continue exploring ZUGEE's products and features.";

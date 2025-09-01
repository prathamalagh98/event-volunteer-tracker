import { intents, defaultResponse } from "./intents";

// normalize user input (remove symbols, lowercase, trim)
const normalize = (txt) =>
    (txt || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // keep only letters/numbers/spaces
    .replace(/\s+/g, " ") // collapse spaces
    .trim();

export function getBotReply(userText) {
    const q = normalize(userText);
    if (!q) return defaultResponse;

    // Loop through intents
    for (const intent of intents) {
        for (const kw of intent.keywords) {
            // keyword matching
            if (kw.test(q)) {
                return intent.answer;
            }
        }
    }

    // If nothing matched
    return defaultResponse;
}

// ✅ Quick reply buttons under chat
export const quickSuggestions = [
    { id: "s1", label: "Browse events", question: "browse events", navigate: "/event" },
    { id: "s2", label: "How to join", question: "join event" },
    { id: "s3", label: "Leave event", question: "leave event" },
    { id: "s4", label: "My joined events", question: "my joined events", navigate: "/volunteer" },
    { id: "s6", label: "Contact support", question: "contact support" },
];
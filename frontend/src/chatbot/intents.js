export const intents = [{
        id: "signup-volunteer",
        keywords: [/\b(signup|register|create account|sign up|registration)\b/i],
        answer: "Volunteer ban’ne ke liye: Home → Register → Role: Volunteer select karo. Login hone ke baad 'Volunteer' ya 'Events' page par jao."
    },
    {
        id: "join-event",
        keywords: [/\b(join event|participate|kaise join|register for event)\b/i],
        answer: "Event join: Events page → kisi event par 'View Details' → 'Join Event' button. Join karne ke liye login required hota hai."
    },
    {
        id: "leave-event",
        keywords: [/\b(leave event|cancel registration|nikalna|unsubscribe)\b/i],
        answer: "Event leave: Events page par us event par jao jise join kiya hai → 'Leave Event' button dabao."
    },
    {
        id: "browse-events",
        keywords: [/\b(upcoming events|browse events|dekho events)\b/i],
        answer: "Events dekhne ke liye 'Events' page open karo. Wahan se details, date, location sab mil jayega."
    },
    {
        id: "my-joined-events",
        keywords: [/\b(my joined events|joined events|mere events|enrolled)\b/i],
        answer: "Aapne jo events join kiye hain wo 'Volunteer' dashboard me dikhte hain."
    },
    {
        id: "hours-tracking",
        keywords: [/\b(track hours|volunteer hours|certificate|experience letter)\b/i],
        answer: "Hours tracking: Organizer check-in/approval ke through count hota hai. Aap 'Dashboard' me apne hours dekh sakte ho. (Route: /dashboard)"
    },
    {
        id: "organizer-create-event",
        keywords: [/\b(create event|post event|organizer event|admin event)\b/i],
        answer: "Event create karne ke liye Organizer/Admin login hona chahiye. Admin panel me 'Add Event' form se create karo. (Route: /admin)"
    },
    {
        id: "event-details",
        keywords: [/\b(event details|location|timing|time|kaha|kab)\b/i],
        answer: "Event details (location, time, volunteers) 'Event Details' page par milta hai. Events list me 'View Details' par click karo."
    },
    {
        id: "notifications",
        keywords: [/\b(notifications?|reminder|updates)\b/i],
        answer: "Reminders/updates aapke account ke notifications me aayenge. Ensure aap logged-in ho aur browser notifications allow kiye hain."
    },
    {
        id: "fees",
        keywords: [/\b(fees?|paid|charges?)\b/i],
        answer: "Volunteer ke liye platform bilkul free hai. Kuch organizations ke premium features ho sakte hain, par basic event join free hai."
    },
    {
        id: "profile-update",
        keywords: [/\b(update profile|edit profile|skills|availability)\b/i],
        answer: "Profile update: Dashboard me jaake skills, availability aur info update kar sakte ho. Ye events match karne me madad karta hai."
    },
    {
        id: "support",
        keywords: [/\b(contact|support|help|issue|problem)\b/i],
        answer: "Support ke liye email karo: info@volunteertracker.com ya 'Contact' page use karo. Hum jaldi reply karenge."
    },
    {
        id: "mobile-app",
        keywords: [/\b(app|mobile|android|ios)\b/i],
        answer: "Abhi mobile-responsive website available hai. Dedicated mobile app aa rahi hai (jaldi)."
    },
    {
        id: "menu",
        keywords: [/^(menu|help|faq)$/i],
        answer: "Main madad kar sakta hoon:\n• Browse events\n• How to join event\n• My joined events\n• Track hours\n• Create event (organizer)\n• Contact support\nType any of the above."
    },
];

export const defaultResponse =
    "Samajh nahi aaya 😅 Kya aap 'menu' type kar sakte ho? (e.g., 'Browse events', 'How to join event', 'My joined events', 'Track hours')";
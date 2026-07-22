export type Conversation = {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Last message preview. */
  preview: string;
  /** Relative time label, e.g. "1 mins ago". */
  time: string;
  unread: number;
  online: boolean;
  /** Presence label when offline, e.g. "Last seen 1 minutes ago". */
  status: string;
};

export type ChatMessage = {
  id: string;
  body: string;
  /** Clock label, e.g. "15.31". */
  time: string;
  /** True when sent by the current user (right-aligned). */
  mine: boolean;
  /** Receipt label for own messages, e.g. "Read 15.31". */
  receipt?: string;
  kind?: "text" | "file" | "voice";
  /** File label when kind === "file". */
  fileName?: string;
  fileSize?: string;
};

// TODO: replace with data from the chat API.
export const SEED_CONVERSATIONS: Conversation[] = [
  { id: "c1", name: "Ben Lucas",       preview: "Hey! Did you finish the Hi-Fi wireframes for Dex Furniture web desktop app?", time: "1 mins ago",  unread: 1, online: false, status: "Last seen 1 minutes ago" },
  { id: "c2", name: "Jhonny Wilson",   preview: "Okey. I got it will do it after sometime and let you know", time: "Just Now",    unread: 0, online: true,  status: "Online" },
  { id: "c3", name: "Theresya Monna",  preview: "Perfect I look forward to hearing good news from you soon. Thanks dude 🙏", time: "15 mins ago", unread: 0, online: false, status: "Last seen 10 minutes ago" },
  { id: "c4", name: "Alex Robertson",  preview: "When can start redesign of Calm app and did you create a design system already?", time: "7 hours ago", unread: 2, online: false, status: "Last seen 7 hours ago" },
  { id: "c5", name: "Rose Angeline",   preview: "Please check my illustration for travel app and let me know your feedback.", time: "Yesterday",   unread: 1, online: false, status: "Last seen 3 hours ago" },
  { id: "c6", name: "Brody Anxelar",   preview: "Thanks your answer. Maybe you can check the settings web preferences", time: "Yesterday",   unread: 0, online: false, status: "Last seen 5 hours ago" },
  { id: "c7", name: "Katty Claudius",  preview: "Sounds good to me", time: "Wednesday",   unread: 0, online: false, status: "Last seen 2 days ago" },
];

export const SEED_MESSAGES: Record<string, ChatMessage[]> = {
  c2: [
    { id: "m1", body: "Oh, hello! All Perfectly. I will check it and get back to you soon.", time: "15.31", mine: true, receipt: "Read 15.31" },
    { id: "m2", body: "I have updated few changes over there", time: "15.33", mine: false },
    { id: "m3", body: "Return Product Customer", time: "15.35", mine: false, kind: "file", fileName: "Return Product Customer", fileSize: "5.3 Mb · Downloaded" },
    { id: "m4", body: "Alright so cool let me see it. Thanks bro!", time: "15.38", mine: true, receipt: "Read 15.38" },
    { id: "m5", body: "Voice message", time: "15.42", mine: false, kind: "voice" },
    { id: "m6", body: "Awesome! We need to update few changes", time: "16.02", mine: true, receipt: "Read 16.02" },
    { id: "m7", body: "Oke, I got it i will do it after sometime and let you know 👍", time: "16.07", mine: false },
    { id: "m8", body: "That's great, Good luck.", time: "16.14", mine: true, receipt: "Delivered 16.14" },
  ],
};

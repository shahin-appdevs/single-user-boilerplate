export const BLOG =
  "https://mehedi.appdevs.team/qrpaypro/public/storage/backend/files/blog";

export const CATEGORIES: { name: string; count: number }[] = [
  { name: "Earn Currency", count: 0 },
  { name: "Global Account", count: 2 },
  { name: "Crypto Support", count: 1 },
  { name: "Online Shopping", count: 0 },
  { name: "Money Transaction", count: 1 },
];

export const RECENT: { id: number; img: string; title: string; date: string }[] =
  [
    {
      id: 1,
      img: `${BLOG}/230ebda2-3296-438c-a4ff-20d71edee9da.webp`,
      title: "Seamless Money Transfers",
      date: "2 weeks ago",
    },
    {
      id: 2,
      img: `${BLOG}/1c1be773-1ed0-4c0b-9b50-9aff998827c1.webp`,
      title: "Mastering Time Management: Key Strategies for Productivity",
      date: "2 weeks ago",
    },
    {
      id: 4,
      img: `${BLOG}/3db7e580-a9a7-4658-9441-5c003506eb17.webp`,
      title: "Unlocking Your Creative Potential: Ignite Your Imagination",
      date: "2 weeks ago",
    },
  ];

export type JournalPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  img: string;
  date: string;
  subheading: string;
  body: string[];
};

const LONG =
  "In this blog, we explore the incredible impact of positive thinking on various aspects of life. Discover the science-backed benefits of embracing optimism and learn practical strategies to reframe negative thoughts, overcome obstacles, and foster resilience. Unlock your true potential by cultivating a positive mindset and creating a life filled with happiness, success, and fulfillment.";

export const POSTS: Record<string, JournalPost> = {
  "1": {
    id: 1,
    slug: "seamless-money-transfers",
    title: "Seamless Money Transfers",
    category: "Money Transaction",
    img: `${BLOG}/230ebda2-3296-438c-a4ff-20d71edee9da.webp`,
    date: "August 10, 2024",
    subheading: "Accounts payable audit",
    body: [LONG, LONG, LONG],
  },
  "2": {
    id: 2,
    slug: "mastering-time-management-key-strategies-for-productivity",
    title: "Mastering Time Management: Key Strategies for Productivity",
    category: "Global Account",
    img: `${BLOG}/1c1be773-1ed0-4c0b-9b50-9aff998827c1.webp`,
    date: "04-06-2026",
    subheading: "Build a system that works",
    body: [LONG, LONG, LONG],
  },
  "3": {
    id: 3,
    slug: "the-art-of-mindful-living-embrace-the-present-moment",
    title: "The Art of Mindful Living: Embrace the Present Moment",
    category: "Global Account",
    img: `${BLOG}/69d8f4b9-0df0-4932-9dcc-68338e9da437.webp`,
    date: "13-11-2024",
    subheading: "Presence over perfection",
    body: [LONG, LONG, LONG],
  },
  "4": {
    id: 4,
    slug: "unlocking-your-creative-potential-ignite-your-imagination",
    title: "Unlocking Your Creative Potential: Ignite Your Imagination",
    category: "Global Account",
    img: `${BLOG}/3db7e580-a9a7-4658-9441-5c003506eb17.webp`,
    date: "2 weeks ago",
    subheading: "Spark new ideas",
    body: [LONG, LONG, LONG],
  },
};

export const DEFAULT_POST = POSTS["1"];

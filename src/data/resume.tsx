import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";

type Skill = {
  name: string;
  iconUrl?: string;
  /** Heading the skill is listed under on the site. */
  group?: string;
};

const brandIcon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

const inGroup = (group: string, items: Skill[]): Skill[] =>
  items.map((item) => ({ ...item, group }));

// Everything from the CV's "Skills & Technologies", in the CV's order and under
// its headings.
const skills: Skill[] = [
  ...inGroup("Frontend", [
    { name: "HTML5", iconUrl: brandIcon("html5") },
    { name: "CSS3" },
    { name: "Tailwind CSS", iconUrl: brandIcon("tailwindcss") },
    { name: "JavaScript", iconUrl: brandIcon("javascript") },
    { name: "TypeScript", iconUrl: brandIcon("typescript") },
    { name: "React.js", iconUrl: brandIcon("react") },
    { name: "Vue.js", iconUrl: brandIcon("vuedotjs") },
    { name: "Responsive UI Development" },
  ]),
  ...inGroup("Backend", [
    { name: "Node.js", iconUrl: brandIcon("nodedotjs") },
    { name: "Express.js" },
    { name: "REST APIs" },
    { name: "Socket.IO" },
    { name: "WebSockets" },
    { name: "Authentication" },
    { name: "Third-party API Integration" },
  ]),
  ...inGroup("Databases", [
    { name: "MongoDB", iconUrl: brandIcon("mongodb") },
    { name: "PostgreSQL", iconUrl: brandIcon("postgresql") },
    { name: "Firebase", iconUrl: brandIcon("firebase") },
  ]),
  ...inGroup("Tools & Platforms", [
    { name: "Git", iconUrl: brandIcon("git") },
    { name: "GitHub" },
    { name: "Postman", iconUrl: brandIcon("postman") },
    { name: "Jira", iconUrl: brandIcon("jira") },
    { name: "Trello", iconUrl: brandIcon("trello") },
    { name: "Vercel" },
    { name: "Docker", iconUrl: brandIcon("docker") },
    { name: "CI/CD" },
  ]),
  ...inGroup("Development", [
    { name: "MERN Stack" },
    { name: "Real-time Applications" },
    { name: "SaaS Development" },
    { name: "API Integration" },
    { name: "Automation Workflows" },
    { name: "Clean & Maintainable Code" },
  ]),
  ...inGroup("AI & LLMs", [
    { name: "LangChain", iconUrl: brandIcon("langchain") },
    { name: "LangGraph", iconUrl: brandIcon("langgraph") },
    { name: "RAG Systems" },
    { name: "AI Agents" },
    { name: "Vector Search" },
    { name: "LLM Integration" },
  ]),
];

export const DATA = {
  name: "Muhammad Zohaib",
  /** Used in the hero greeting ("Hi, I'm Zohaib"). */
  shortName: "Zohaib",
  initials: "MZ",
  // Used for canonical/Open Graph URLs. Set NEXT_PUBLIC_SITE_URL to your domain;
  // on Vercel the production URL is picked up automatically.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  location: "Islamabad, Pakistan",
  locationLink: "https://www.google.com/maps/place/Islamabad",
  description:
    "Full Stack Web Developer & AI Engineer building SaaS products, AI tools and production web applications.",
  summary:
    "Full Stack Web Developer with 2.5 years of professional experience building SaaS products, AI tools, automation workflows and production web applications. Experienced in Vue.js, React.js, JavaScript, TypeScript, Node.js, MongoDB, REST APIs, Socket.IO and third-party integrations. Hands-on experience with RAG-based systems, LangChain, LangGraph, AI agents and vector search, with a strong focus on clean architecture, maintainable code and user-friendly product experiences.",
  avatarUrl: "/me.jpg",
  /** Where the floating "Ask my Twin" button goes. */
  twinUrl: "https://my-digital-twin-two.vercel.app/",
  skills,
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "mzohaibch.07@gmail.com",
    tel: "+92 343 1197504",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/zohaib65-ch",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/zohaibch07/",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:mzohaibch.07@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Sideline Technologies",
      href: "",
      badges: [],
      location: "Islamabad, Pakistan",
      title: "Vue.js Developer",
      logoUrl: "",
      start: "Aug 2026",
      end: "",
      description: [
        "• Developing modern frontend applications with Vue.js and collaborating with cross-functional teams on production features.",
        "• Building responsive, user-friendly interfaces, integrating APIs and contributing to real-time application workflows.",
        "• Resolving technical challenges and improving maintainability through clean, reusable frontend code.",
      ].join("\n"),
    },
    {
      company: "Ropstam Solutions Inc.",
      href: "",
      badges: [],
      location: "Islamabad, Pakistan",
      title: "MERN Stack Developer",
      logoUrl: "",
      start: "Dec 2024",
      end: "Jul 2026",
      description: [
        "• Developed full-stack MERN applications with Socket.IO real-time features and third-party integrations.",
        "• Worked across SaaS products on frontend development, backend APIs and seamless client-server integration.",
        "• Collaborated with international clients and development teams to solve complex requirements and deliver maintainable solutions.",
      ].join("\n"),
    },
  ],
  education: [
    {
      school: "University of Sahiwal",
      href: "https://www.uosahiwal.edu.pk",
      degree: "Bachelor of Science in Software Engineering · CGPA 3.35",
      logoUrl: "/sahiwal.png",
      start: "2020",
      end: "2024",
    },
  ],
  projects: [
    {
      title: "TruckFlowHQ",
      href: "https://www.truckflowhq.com",
      dates: "",
      active: true,
      description:
        "Production SaaS/web platform work involving modern application development, reusable interfaces and integrated product workflows.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://www.truckflowhq.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/truckflowhq.jpg",
      video: "",
    },
    {
      title: "Minest",
      href: "https://www.getminest.app",
      dates: "",
      active: true,
      description:
        "Productivity-focused web application with a clean, modern user experience and maintainable product-oriented frontend.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://www.getminest.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/minest.jpg",
      video: "",
    },
    {
      title: "JobCrap",
      href: "https://www.jobcrap.com",
      dates: "",
      active: true,
      description:
        "Web application project demonstrating practical full-stack product development and user-facing workflows.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://www.jobcrap.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/jobcrap.jpg",
      video: "",
    },
    {
      title: "Digitaly",
      href: "https://digitaly.fr",
      dates: "",
      active: true,
      description:
        "Professional web project focused on responsive implementation, polished UI and production-ready delivery.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://digitaly.fr",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/digitaly.jpg",
      video: "",
    },
    {
      title: "DigiMag Media",
      href: "https://www.digimag.media",
      dates: "",
      active: true,
      description:
        "Media-oriented web project with emphasis on modern presentation, usability and responsive design.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://www.digimag.media",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/digimag.jpg",
      video: "",
    },
    {
      title: "90J Pages",
      href: "https://90j-pages.vercel.app",
      dates: "",
      active: true,
      description:
        "Modern web project demonstrating responsive frontend implementation and reusable UI development.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://90j-pages.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/90j-pages.jpg",
      video: "",
    },
    {
      title: "My Digital Twin",
      href: "https://my-digital-twin-two.vercel.app",
      dates: "",
      active: true,
      description:
        "AI-focused conversational web application designed around personalized, context-aware interaction and retrieval-based AI workflows.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://my-digital-twin-two.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/my-digital-twin.jpg",
      video: "",
    },
    {
      title: "DocuChat AI",
      href: "https://docu-chat-ai-ochre.vercel.app",
      dates: "",
      active: true,
      description:
        "AI-powered document Q&A system built with LangChain and RAG, using retrieval and vector search to generate context-aware answers from document content.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://docu-chat-ai-ochre.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/docuchat-ai.jpg",
      video: "",
    },
    {
      title: "MeatsZoo",
      href: "https://www.meatszoo.com",
      dates: "",
      active: true,
      description:
        "Commercial web application work focused on responsive interfaces, product flows and reliable frontend/backend integration.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://www.meatszoo.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/meatszoo.jpg",
      video: "",
    },
    {
      title: "Start2Write",
      href: "https://www.start2write.com",
      dates: "",
      active: true,
      description:
        "Content-focused web platform built around a streamlined user experience and modern application workflows.",
      technologies: [],
      links: [
        {
          type: "Website",
          href: "https://www.start2write.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/start2write.jpg",
      video: "",
    },
  ],
} as const;

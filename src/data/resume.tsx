import type { ComponentType, SVGProps } from "react";
import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";

type Skill = {
  name: string;
  /** Built-in icon component. Takes priority over iconUrl. */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconUrl?: string;
};

const brandIcon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

// Ordered as in the CV: frontend, backend, databases, tools, AI.
const skills: Skill[] = [
  { name: "HTML5", iconUrl: brandIcon("html5") },
  { name: "CSS3" },
  { name: "Tailwind CSS", iconUrl: brandIcon("tailwindcss") },
  { name: "JavaScript", iconUrl: brandIcon("javascript") },
  { name: "TypeScript", icon: Typescript },
  { name: "React.js", icon: ReactLight },
  { name: "Vue.js", iconUrl: brandIcon("vuedotjs") },
  { name: "Node.js", icon: Nodejs },
  { name: "Express.js" },
  { name: "REST APIs" },
  { name: "Socket.IO" },
  { name: "WebSockets" },
  { name: "MongoDB", iconUrl: brandIcon("mongodb") },
  { name: "PostgreSQL", icon: Postgresql },
  { name: "Firebase", iconUrl: brandIcon("firebase") },
  { name: "Git", iconUrl: brandIcon("git") },
  { name: "GitHub" },
  { name: "Postman", iconUrl: brandIcon("postman") },
  { name: "Jira", iconUrl: brandIcon("jira") },
  { name: "Trello", iconUrl: brandIcon("trello") },
  { name: "Vercel" },
  { name: "Docker", icon: Docker },
  { name: "CI/CD" },
  { name: "LangChain", iconUrl: brandIcon("langchain") },
  { name: "LangGraph", iconUrl: brandIcon("langgraph") },
  { name: "RAG Systems" },
  { name: "AI Agents" },
  { name: "Vector Search" },
  { name: "LLM Integration" },
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
      degree: "BS Software Engineering (CGPA 3.35)",
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
  ],
} as const;

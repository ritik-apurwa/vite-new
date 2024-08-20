import {
  chatgpt,
  claude,
  googlegemini,
  notion,
  reacticon,
  nextjs,
  tailwind,
  convexpng,
  clerk,
} from "@/assets/icons";
export interface SkillCardProps {
  id: number;
  img: string;
  title: string;
  description: string;
}

export const frontendSkills: SkillCardProps[] = [
  {
    id: 1,
    title: "Google Gemini",
    img: googlegemini,
    description:
      "Leverage the power of Google's AI with Gemini, providing cutting-edge machine learning models for enhanced predictions and insights.",
  },
  {
    id: 2,
    title: "ChatGPT",
    img: chatgpt,
    description:
      "A powerful AI language model by OpenAI, capable of engaging in dynamic conversations, generating content, and assisting with various tasks.",
  },
  {
    id: 3,
    title: "Claude",
    img: claude,
    description:
      "An AI assistant designed for seamless natural language understanding, perfect for creating intelligent and context-aware applications.",
  },
  {
    id: 4,
    title: "Notion",
    img: notion,
    description:
      "A versatile tool for note-taking, project management, and collaboration, streamlining your workflow with customizable templates and integrations.",
  },
  {
    id: 5,
    title: "React",
    img: reacticon,
    description:
      "A popular JavaScript library for building user interfaces, known for its component-based architecture and virtual DOM.",
  },
  {
    id: 6,
    title: "Next.js",
    img: nextjs,
    description:
      "A powerful React framework for building server-rendered applications, offering features like static site generation, API routes, and more.",
  },
  {
    id: 7,
    title: "Tailwind CSS",
    img: tailwind,
    description:
      "A utility-first CSS framework that allows for rapid UI development with minimal custom CSS, promoting consistency and scalability.",
  },
  {
    id: 8,
    title: "Convex",
    img: convexpng,
    description:
      "A modern platform for building real-time web applications, simplifying data synchronization and state management across devices.",
  },
  {
    id: 9,
    title: "Clerk",
    img: clerk,
    description:
      "A modern platform for Authetication  for real-time web applications, simplifying data synchronization and state management across devices.",
  },
];


import { IconType } from "react-icons";
import { FaCodeCommit } from "react-icons/fa6";
import { MdHomeMax } from "react-icons/md";
import { PiContactlessPaymentBold } from "react-icons/pi";
import { TbLogicNand } from "react-icons/tb";




export interface NavLinks {
    id: number;
    label: string;
    path: string;
    icon: IconType;
  }
  
export const navLinks: NavLinks[] = [
    { id: 1, label: "Home", path: "/", icon: MdHomeMax },
    { id: 3, label: "Snippets", path: "/snippets", icon: FaCodeCommit },
    { id: 4, label: "Blog", path: "/blogs", icon: TbLogicNand },
    { id: 5, label: "Contact", path: "/contact", icon: PiContactlessPaymentBold },
  ];

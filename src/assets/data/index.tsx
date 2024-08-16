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
];

export const mainSkills: SkillCardProps[] = [
  {
    id: 1,
    title: "React",
    img: reacticon,
    description:
      "A popular JavaScript library for building user interfaces, known for its component-based architecture and virtual DOM.",
  },
  {
    id: 2,
    title: "Next.js",
    img: nextjs,
    description:
      "A powerful React framework for building server-rendered applications, offering features like static site generation, API routes, and more.",
  },
  {
    id: 3,
    title: "Tailwind CSS",
    img: tailwind,
    description:
      "A utility-first CSS framework that allows for rapid UI development with minimal custom CSS, promoting consistency and scalability.",
  },
  {
    id: 4,
    title: "Convex",
    img: convexpng,
    description:
      "A modern platform for building real-time web applications, simplifying data synchronization and state management across devices.",
  },
  {
    id: 5,
    title: "Clerk",
    img: clerk,
    description:
      "A modern platform for Authetication  for real-time web applications, simplifying data synchronization and state management across devices.",
  },
];

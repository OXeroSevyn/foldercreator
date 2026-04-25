import type { FolderDesign } from "./folder-types";

export type Template = {
  name: string;
  category: "All" | "Work" | "Media" | "Fun" | "Dark";
  design: FolderDesign;
};

export const TEMPLATE_CATEGORIES = ["All", "Work", "Media", "Fun", "Dark"] as const;

export const TEMPLATES: Template[] = [
  {
    name: "Classic Blue", category: "Work",
    design: { baseColor: "#1f9bff", style: "apple", overlays: [] },
  },
  {
    name: "Projects", category: "Work",
    design: {
      baseColor: "#1f9bff",
      style: "apple",
      overlays: [
        {
          id: "t1",
          kind: "text",
          text: "PROJECTS",
          font: "Bebas Neue",
          size: 64,
          color: "#ffffff",
          weight: 700,
          x: 0.5,
          y: 0.66,
          rotation: 0,
          opacity: 0.95,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Sunset", category: "Media",
    design: {
      baseColor: "#ff7a3d",
      style: "apple",
      overlays: [
        {
          id: "e1",
          kind: "emoji",
          emoji: "🌅",
          size: 180,
          x: 0.5,
          y: 0.62,
          rotation: 0,
          opacity: 1,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Music", category: "Media",
    design: {
      baseColor: "#b347ff",
      style: "apple",
      overlays: [
        {
          id: "e2",
          kind: "emoji",
          emoji: "🎧",
          size: 200,
          x: 0.5,
          y: 0.62,
          rotation: -8,
          opacity: 1,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Code", category: "Work",
    design: {
      baseColor: "#22c55e",
      style: "apple",
      overlays: [
        {
          id: "t2",
          kind: "text",
          text: "</>",
          font: "Roboto Mono",
          size: 140,
          color: "#ffffff",
          weight: 700,
          x: 0.5,
          y: 0.62,
          rotation: 0,
          opacity: 1,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Photos", category: "Media",
    design: {
      baseColor: "#ff5b8a",
      style: "apple",
      overlays: [
        {
          id: "e3",
          kind: "emoji",
          emoji: "📸",
          size: 200,
          x: 0.5,
          y: 0.62,
          rotation: 0,
          opacity: 1,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Midnight", category: "Dark",
    design: {
      baseColor: "#1e293b",
      style: "apple",
      overlays: [
        {
          id: "e4",
          kind: "emoji",
          emoji: "🌙",
          size: 180,
          x: 0.5,
          y: 0.62,
          rotation: 0,
          opacity: 1,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Cherry", category: "Fun",
    design: {
      baseColor: "#ef4444",
      style: "apple",
      overlays: [
        {
          id: "t3",
          kind: "text",
          text: "★",
          font: "Inter",
          size: 220,
          color: "#ffffff",
          weight: 800,
          x: 0.5,
          y: 0.62,
          rotation: 0,
          opacity: 1,
          shadow: true,
          blur: 0,
        },
      ],
    },
  },
  {
    name: "Games", category: "Fun",
    design: {
      baseColor: "#06b6d4",
      style: "apple",
      overlays: [{
        id: "g1", kind: "emoji", emoji: "🎮", size: 200,
        x: 0.5, y: 0.62, rotation: 0, opacity: 1, shadow: true, blur: 0,
      }],
    },
  },
  {
    name: "Docs", category: "Work",
    design: {
      baseColor: "#64748b",
      style: "apple",
      overlays: [{
        id: "d1", kind: "emoji", emoji: "📄", size: 190,
        x: 0.5, y: 0.62, rotation: 0, opacity: 1, shadow: true, blur: 0,
      }],
    },
  },
  {
    name: "Movies", category: "Media",
    design: {
      baseColor: "#0f172a",
      style: "apple",
      overlays: [{
        id: "m1", kind: "emoji", emoji: "🎬", size: 200,
        x: 0.5, y: 0.62, rotation: 0, opacity: 1, shadow: true, blur: 0,
      }],
    },
  },
  {
    name: "Lemon", category: "Fun",
    design: {
      baseColor: "#facc15",
      style: "apple",
      overlays: [{
        id: "l1", kind: "emoji", emoji: "🍋", size: 190,
        x: 0.5, y: 0.62, rotation: 0, opacity: 1, shadow: true, blur: 0,
      }],
    },
  },
  {
    name: "Stealth", category: "Dark",
    design: {
      baseColor: "#0b0f17",
      style: "apple",
      overlays: [{
        id: "s1", kind: "text", text: "S", font: "Bebas Neue", size: 220,
        color: "#ffffff", weight: 800,
        x: 0.5, y: 0.62, rotation: 0, opacity: 0.9, shadow: true, blur: 0,
      }],
    },
  },
];
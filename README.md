# 📁 FolderCreator

A professional, high-fidelity web application for designing custom Apple-style folder icons. Enhance your desktop organization with personalized text, emojis, and custom imagery.

![FolderCreator Preview](https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **Apple-Style Aesthetics**: Generate sleek, modern folder icons that blend perfectly with macOS and Windows.
- **Custom Overlays**:
  - **Text**: Add titles with custom fonts, colors, and shadows.
  - **Emoji**: Use any emoji as a folder emblem.
  - **Images**: Upload your own logos or photos with optional tinting.
- **Direct Interaction**: Drag-and-drop layers directly on the folder preview to position them exactly where you want.
- **Snap to Grid**: Precision positioning with a built-in snapping system.
- **Micro-Animations**: A fluid, responsive UI built with Framer Motion.
- **Professional Exports**:
  - **ICO**: High-quality icons for Windows.
  - **ICNS**: Native icons for macOS.
  - **SVG/PNG/WebP**: Multiple formats and sizes (up to 1024px).
  - **Batch Export**: Download a full set of sizes in a single `.zip` file.
- **Live Preview**: See how your icon looks at standard OS scales (16px, 32px, 64px) in real-time.

## 🚀 Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)
- **Utilities**: JSZip, Canvas API for professional exports.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd foldercreator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage Tips

- **Dragging**: Click and hold any layer on the folder to move it.
- **Snapping**: Toggle the "Snap" switch in the header for pixel-perfect alignment.
- **Exporting**: Use the "All sizes (.zip)" option if you want to use the icon across different operating systems.

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---
*Crafted for designers and power users who love a clean desktop.*

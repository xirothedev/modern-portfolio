# Modern Portfolio - Xiro The Dev

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs" alt="Next.js" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  </a>
  <a href="https://storybook.js.org/">
    <img src="https://img.shields.io/badge/Storybook-9-FF4785?logo=storybook" alt="Storybook" />
  </a>
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/Code_Style-Prettier-F7B93E?logo=prettier" alt="Prettier" />
  </a>
  <a href="https://github.com/xirothedev/modern-portfolio/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/xirothedev/modern-portfolio?color=blue" alt="License" />
  </a>
  <a href="https://hub.docker.com/">
    <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker" alt="Docker Ready" />
  </a>
  <a href="https://github.com/xirothedev/modern-portfolio/actions">
    <img src="https://github.com/xirothedev/modern-portfolio/actions/workflows/ci.yml/badge.svg" alt="Build Status" />
  </a>
</p>

A modern, interactive, and visually stunning developer portfolio built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**. Showcases projects, skills, experience, and provides a beautiful user experience with 3D, animation, and real-time GitHub integration.

## ✨ Features

- **Next.js 15** (App Router, SSR, API routes, Standalone output)
- **TypeScript** & strict type safety
- **Tailwind CSS** & custom design system
- **3D Hero Section** with interactive tech icons (Three.js, @react-three/fiber)
- **Animated Name** & glowing effects
- **Mouse Follower** & scroll progress indicator
- **Floating Navigation** with smooth scroll and mobile support
- **Skills & Projects**: Interactive skill/project showcase
- **Project Cards**: Real-time GitHub data (stars, forks, languages, topics)
- **Timeline**: Visual career/learning journey
- **Contact Form**: Animated, toast feedback
- **Dark mode** & theme provider
- **Responsive** & mobile-first
- **Docker** & Docker Compose ready
- **Storybook** for UI development
- **Prettier, ESLint, Husky** for code quality

## 🗂️ Project Structure

```
src/
  app/           # Next.js app directory (routing, layout, pages, API)
    api/         # API routes (e.g., /api/github for GitHub integration)
    layout.tsx   # Root layout, global styles, footer
    page.tsx     # Main portfolio page
    globals.css  # Global styles
  components/    # UI components (hero, nav, cards, timeline, etc.)
  hooks/         # Custom React hooks
  lib/           # Utility libraries (e.g., GitHub topic formatting)
  stories/       # Storybook stories
public/          # Static assets (images, CV, etc.)
```

## 🔄 System Architecture Flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant N as Next.js App
    participant API as API Routes
    participant GH as GitHub API
    participant DB as Database
    participant Email as Resend API

    Note over U,Email: Portfolio Loading Flow
    U->>B: Visit Portfolio
    B->>N: Load Page
    N->>API: GET /api/github
    API->>GH: Fetch Repositories
    GH-->>API: Repository Data
    API->>GH: Fetch Languages
    GH-->>API: Language Data
    API-->>N: Projects Data
    N-->>B: Render Projects
    B-->>U: Display Portfolio

    Note over U,Email: Skills Loading Flow
    B->>API: GET /api/skills
    API->>GH: Get User Repositories
    GH-->>API: Repositories List
    API->>GH: Get Languages for Each Repo
    GH-->>API: Languages Data
    API-->>B: Processed Skills Data

    Note over U,Email: Contact Form Flow
    U->>B: Fill Contact Form
    B->>API: POST /api/contact
    API->>API: Validate with Zod
    API->>Email: Send Email
    Email-->>API: Email Sent
    API-->>B: Success Response
    B-->>U: Show Success Message

    Note over U,Email: Project Detail Flow
    U->>B: Click Project
    B->>API: GET /api/projects/[slug]
    API->>DB: Query Project
    DB-->>API: Project Data
    API-->>B: Project Details
    B-->>U: Display Project
```

### 📋 Flow Descriptions

#### 🏠 Portfolio Loading Flow

1. **User** visits the portfolio website
2. **Browser** loads the Next.js application
3. **Next.js App** requests project data from GitHub API
4. **API Routes** fetch repository information and language statistics
5. **GitHub API** returns structured data
6. **Browser** renders the portfolio with real-time GitHub data

#### 🛠️ Skills Loading Flow

1. **Browser** requests skills data
2. **API Routes** fetch all user repositories
3. **GitHub API** provides repository and language information
4. **Browser** displays processed skills with project associations

#### 📧 Contact Form Flow

1. **User** fills and submits contact form
2. **API Routes** validate form data using Zod schema
3. **Resend API** sends formatted email
4. **Browser** shows success confirmation

#### 📁 Project Detail Flow

1. **User** clicks on a specific project
2. **API Routes** query project details from database
3. **Database** returns project information
4. **Browser** displays detailed project view

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/xirothedev/modern-portfolio.git
cd modern-portfolio
pnpm install
# or npm install / yarn install
```

### 2. GitHub API Integration (Optional, for real-time project data)

- Create a Personal Access Token on GitHub with `public_repo` scope
- Create a `.env.local` file in the root directory:

    ```
    GITHUB_TOKEN=your_github_token_here
    ```

- See more in [GITHUB_SETUP.md](./GITHUB_SETUP.md)

### 3. Development

```bash
pnpm dev
# or npm run dev / yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 4. Build & Production

```bash
pnpm build
pnpm start
```

### 5. Docker

Build and run with Docker:

```bash
docker build -t modern-portfolio .
docker run -p 3000:3000 modern-portfolio
```

Or use Docker Compose:

```bash
docker compose up --build
```

## 🛠️ Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Lint code with ESLint
- `format` - Format code with Prettier
- `storybook` - Run Storybook UI
- `build-storybook` - Build static Storybook

## 🧩 Main Technologies

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Three.js** & @react-three/fiber
- **Anime.js** (animation)
- **Radix UI**, **Lucide Icons**
- **Zod** (validation)
- **Storybook** (UI dev)
- **Docker** & **Docker Compose**

## 🖼️ UI Highlights

- **3D Hero Section**: Rotating 3D tech icons, particle effects
- **Animated Name**: Dynamic gradient effect for the developer name
- **Skills & Projects**: Interactive, filterable, real-time GitHub stats
- **Timeline**: Visual learning & career journey
- **Contact Form**: Animated, toast feedback
- **Floating Nav**: Floating navigation, mobile support, CV download
- **Mouse Follower**: Custom mouse effect
- **Glowing Effects**: Modern glowing UI effects

## 📦 Environment & Config

- **.env.local**: For environment variables (GitHub token, etc.)
- **next.config.ts**: Standalone output, Docker optimized
- **tsconfig.json**: Strict, alias `@/*` to `src/*`
- **pnpm-workspace.yaml**: Workspace support for future expansion

## 📄 CV & Contact

- Download CV: [public/lethanhtrung-webdeveloper-cv.pdf](public/lethanhtrung-webdeveloper-cv.pdf)
- Contact: Footer includes GitHub, LinkedIn, Email, Discord, Facebook links

## 📝 License

MIT License. See [LICENSE.md](./LICENSE.md).

---

**Made with ❤️ by Xiro The Dev**

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

// Skills data with associated projects
const skillsData = [
  {
    name: "JavaScript",
    type: "Programming Language",
    color: "bg-yellow-500",
    projects: [
      {
        name: "E-commerce Platform",
        description:
          "Used JavaScript for dynamic cart functionality and payment processing",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Task Management App",
        description:
          "Implemented real-time updates and interactive UI components",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Weather Dashboard",
        description: "Built interactive charts and data visualization features",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "TypeScript",
    type: "Programming Language",
    color: "bg-blue-600",
    projects: [
      {
        name: "E-commerce Platform",
        description:
          "Ensured type safety across the entire application architecture",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "AI Content Generator",
        description:
          "Implemented strongly-typed API interfaces and data models",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Fitness Tracker",
        description: "Created type-safe data structures for health metrics",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "React",
    type: "Frontend Framework",
    color: "bg-cyan-500",
    projects: [
      {
        name: "Task Management App",
        description: "Built with React hooks and context for state management",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Weather Dashboard",
        description: "Created reusable components and custom hooks",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Portfolio Website",
        description:
          "Developed responsive components with modern React patterns",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "Next.js",
    type: "Frontend Framework",
    color: "bg-black",
    projects: [
      {
        name: "E-commerce Platform",
        description:
          "Utilized SSR, API routes, and optimized performance features",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "AI Content Generator",
        description: "Implemented server-side rendering and API integration",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Portfolio Website",
        description: "Built with App Router and modern Next.js features",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "Node.js",
    type: "Javascript Runtime",
    color: "bg-green-600",
    projects: [
      {
        name: "E-commerce Platform",
        description: "Developed backend APIs and server-side logic",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "AI Content Generator",
        description: "Created server endpoints for AI model integration",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "Tailwind CSS",
    type: "CSS Framework",
    color: "bg-teal-500",
    projects: [
      {
        name: "Portfolio Website",
        description: "Designed responsive layouts and custom animations",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Task Management App",
        description: "Created modern UI components and responsive design",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Weather Dashboard",
        description: "Styled interactive components and data visualizations",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "GraphQL",
    type: "Query Language",
    color: "bg-pink-500",
    projects: [
      {
        name: "E-commerce Platform",
        description: "Implemented efficient data fetching and mutations",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "Task Management App",
        description: "Built real-time subscriptions for collaborative features",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "PostgreSQL",
    type: "Database",
    color: "bg-blue-700",
    projects: [
      {
        name: "E-commerce Platform",
        description: "Designed database schema and optimized queries",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
      {
        name: "AI Content Generator",
        description: "Managed user data and content storage efficiently",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  // {
  //   name: "AWS",
  //   color: "bg-orange-500",
  //   projects: [
  //     {
  //       name: "E-commerce Platform",
  //       description: "Deployed using EC2, S3, and RDS services",
  //       demoUrl: "https://example.com",
  //       repoUrl: "https://github.com",
  //     },
  //     {
  //       name: "AI Content Generator",
  //       description: "Utilized Lambda functions and API Gateway",
  //       demoUrl: "https://example.com",
  //       repoUrl: "https://github.com",
  //     },
  //   ],
  // },
  {
    name: "Docker",
    type: "Containerization",
    color: "bg-blue-500",
    projects: [
      {
        name: "E-commerce Platform",
        description: "Containerized application for consistent deployments",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com",
      },
    ],
  },
  {
    name: "Git",
    type: "Distributed Version Control System",
    color: "bg-red-500",
    projects: [
      {
        name: "All Projects",
        description:
          "Version control and collaborative development across all projects",
        demoUrl: "https://github.com/xirothedev",
        repoUrl: "https://github.com/xirothedev",
      },
    ],
  },
  // {
  //   name: "Firebase",
  //   level: 75,
  //   color: "bg-yellow-600",
  //   projects: [
  //     {
  //       name: "Task Management App",
  //       description: "Real-time database and authentication implementation",
  //       demoUrl: "https://example.com",
  //       repoUrl: "https://github.com",
  //     },
  //     {
  //       name: "Fitness Tracker",
  //       description: "Cloud storage and real-time data synchronization",
  //       demoUrl: "https://example.com",
  //       repoUrl: "https://github.com",
  //     },
  //   ],
  // },
];

export function SkillsWithProjects() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const handleSkillClick = (skillName: string) => {
    setSelectedSkill(selectedSkill === skillName ? null : skillName);
  };

  const getSkillProjects = (skillName: string) => {
    return skillsData.find((skill) => skill.name === skillName)?.projects || [];
  };

  const getSkillData = (skillName: string) => {
    return skillsData.find((skill) => skill.name === skillName);
  };

  return (
    <div className="space-y-8">
      {/* Skills Badges Grid */}
      <div className="flex flex-wrap gap-3 justify-center">
        {skillsData.map((skill) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant="secondary"
              className={`
                relative cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300
                ${
                  selectedSkill === skill.name
                    ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                }
                ${hoveredSkill === skill.name ? "shadow-md" : ""}
              `}
              onClick={() => handleSkillClick(skill.name)}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <span className="relative z-10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${skill.color}`} />
                {skill.name}
                <span className="text-xs opacity-70">
                  ({skill.projects.length})
                </span>
              </span>
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Selected Skill Details */}
      <AnimatePresence mode="wait">
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-zinc-800/50 backdrop-blur-xs border-zinc-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        getSkillData(selectedSkill)?.color
                      }`}
                    />
                    <CardTitle className="text-2xl text-white">
                      {selectedSkill}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-purple-400 border-purple-400"
                    >
                      {getSkillData(selectedSkill)?.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSkill(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
                <CardDescription className="text-zinc-400">
                  Projects utilizing {selectedSkill} (
                  {getSkillProjects(selectedSkill).length} projects)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getSkillProjects(selectedSkill).map((project, index) => (
                    <motion.div
                      key={`${selectedSkill}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-zinc-900/50 border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 h-full">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-white flex items-center justify-between">
                            {project.name}
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-zinc-400"
                                asChild
                              >
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Github className="h-3 w-3" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-zinc-400"
                                asChild
                              >
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {project.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-zinc-500 text-sm">
          Click on any skill badge to see the projects where it was applied
        </p>
      </motion.div>
    </div>
  );
}

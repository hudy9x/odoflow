"use client";
import { Carousel } from "./Carousel";
import { Zap, PackagePlus, AlignJustify, Bolt, BugPlay, ListFilter } from "lucide-react";

const carouselItems = [

  {
    id: 6,
    icon: <AlignJustify className="h-7 w-7 p-1.5 rounded-md bg-red-400" />,
    heading: "Workflow Management",
    image: "/carousel/workfow-list.png",
    style: { width: 832, left: -129, top: -95 },
    description: "Keep your automation organized with our centralized workflow management system, monitoring and maintaining all processes from a single dashboard.",
  },

  {
    id: 5,
    icon: <PackagePlus className="h-7 w-7 p-1.5 rounded-md bg-indigo-400" />,
    heading: "Quick Add",
    image: "/carousel/node-quick-add.png",
    style: { width: 900, left: -180, top: -154 },
    description: "Expand your workflow capabilities instantly with our quick-add feature, choosing from a wide variety of pre-built nodes and integrations.",
  },

  {
    id: 2,
    icon: <Zap className="h-7 w-7 p-1.5 rounded-md bg-emerald-400" />,
    heading: "Create Workflows",
    image: "/carousel/node-connection.png",
    style: { 
      width: 800,
      left: -145,
      top: -121,
     },
    description: "Create powerful workflows by connecting nodes together, enabling seamless data flow and automation between different services and systems.",
  },

  {
    id: 1,
    icon: <Bolt className="h-7 w-7 p-1.5 rounded-md bg-yellow-400" />,
    heading: "Easy Configure",
    image: "/carousel/node-config.png",
    style: { width: 900, left: -217, top: -66 },
    description: "Easily configure your workflow nodes with our intuitive interface, allowing you to set up complex automation in minutes.",
  },

  {
    id: 3,
    icon: <BugPlay className="h-7 w-7 p-1.5 rounded-md bg-purple-400" />,
    heading: "Debug Mode",
    image: "/carousel/node-debugger.png",
    style: {
      width: 1035,
      left: -75,
      top: -122,
    },
    description: "Identify and fix issues quickly with our comprehensive debugging tools, allowing you to inspect data flow and node execution in real-time.",
  },
  
  {
    id: 4,
    icon: <ListFilter className="h-7 w-7 p-1.5 rounded-md bg-pink-400" />,
    heading: "Filter by condition",
    image: "/carousel/node-filter.png",
    style: { width: 900, left: -157, top: -121 },
    description: "Set up sophisticated conditional logic to control your workflow execution, ensuring data is processed exactly how you need it.",
  },

 
];

export const CommonCarousel = () => {
  return <Carousel className="absolute inset-0" items={carouselItems} />;
};

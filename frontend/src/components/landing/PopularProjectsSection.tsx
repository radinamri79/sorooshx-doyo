import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Project {
  name: string;
  price: string;
  href: string;
  icon: string;
}

const projects: Project[] = [
  { name: "Furniture Assembly", price: "Starting at $49", href: "/services/furniture-assembly", icon: "🪑" },
  { name: "Mount Art or Shelves", price: "Starting at $65", href: "/services/shelf-mounting", icon: "🖼️" },
  { name: "Mount a TV", price: "Starting at $69", href: "/services/tv-mounting", icon: "📺" },
  { name: "Help Moving", price: "Starting at $67", href: "/services/help-moving", icon: "📦" },
  { name: "Home Cleaning", price: "Starting at $49", href: "/services/home-cleaning", icon: "🧹" },
  { name: "Plumbing Repairs", price: "Starting at $74", href: "/services/plumbing", icon: "🔧" },
  { name: "Electrical Help", price: "Starting at $69", href: "/services/electrical", icon: "⚡" },
  { name: "Heavy Lifting", price: "Starting at $61", href: "/services/heavy-lifting", icon: "💪" },
];

export default function PopularProjectsSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900">
              Popular Projects
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              Most requested services on Doyo
            </p>
          </div>
          <Link
            href="/services"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group flex items-center gap-4 p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300"
            >
              <span className="text-3xl shrink-0">{project.icon}</span>
              <div className="min-w-0">
                <h3 className="font-semibold text-navy-900 group-hover:text-navy-800 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-primary-700 font-medium mt-0.5">{project.price}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy-600 ml-auto shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900"
          >
            View all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

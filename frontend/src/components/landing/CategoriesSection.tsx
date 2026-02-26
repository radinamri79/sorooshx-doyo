"use client";

import { useState } from "react";

interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  trending: SubCategory[];
}

const categories: Category[] = [
  {
    id: "assembly",
    name: "Assembly",
    icon: "⚙️",
    trending: [
      { name: "General Furniture Assembly", href: "/services/furniture-assembly" },
      { name: "IKEA Assembly", href: "/services/ikea-assembly" },
      { name: "Desk Assembly", href: "/services/desk-assembly" },
    ],
  },
  {
    id: "mounting",
    name: "Mounting",
    icon: "📺",
    trending: [
      { name: "TV Mounting", href: "/services/tv-mounting" },
      { name: "Shelf Mounting", href: "/services/shelf-mounting" },
      { name: "Art or Shelves", href: "/services/art-hanging" },
    ],
  },
  {
    id: "moving",
    name: "Moving",
    icon: "📦",
    trending: [
      { name: "Help Moving", href: "/services/help-moving" },
      { name: "In Home Furniture Movers", href: "/services/furniture-movers" },
      { name: "Heavy Lifting", href: "/services/heavy-lifting" },
    ],
  },
  {
    id: "cleaning",
    name: "Cleaning",
    icon: "✨",
    trending: [
      { name: "Home & Apartment Cleaning", href: "/services/home-cleaning" },
      { name: "Deep Cleaning", href: "/services/deep-cleaning" },
      { name: "Move-out Cleaning", href: "/services/move-out-cleaning" },
    ],
  },
  {
    id: "outdoor",
    name: "Outdoor Help",
    icon: "🌱",
    trending: [
      { name: "Yard Work", href: "/services/yardwork" },
      { name: "Lawn Care", href: "/services/lawn-care" },
      { name: "Snow Removal", href: "/services/snow-removal" },
    ],
  },
  {
    id: "repairs",
    name: "Home Repairs",
    icon: "🔨",
    trending: [
      { name: "Home repairs", href: "/services/home-repairs" },
      { name: "Plumbing", href: "/services/plumbing" },
      { name: "Electrical Help", href: "/services/electrical" },
    ],
  },
  {
    id: "painting",
    name: "Painting",
    icon: "🎨",
    trending: [
      { name: "Interior Painting", href: "/services/interior-painting" },
      { name: "Exterior Painting", href: "/services/exterior-painting" },
      { name: "Cabinet Painting", href: "/services/cabinet-painting" },
    ],
  },
  {
    id: "trending",
    name: "Trending",
    icon: "⚡",
    trending: [
      { name: "Furniture Assembly", href: "/services/furniture-assembly" },
      { name: "TV Mounting", href: "/services/tv-mounting" },
      { name: "Help Moving", href: "/services/help-moving" },
    ],
  },
];

export default function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState("trending");

  const active = categories.find((cat) => cat.id === activeCategory) || categories[0];

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Categories Row - Horizontally Scrollable on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-start sm:gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-navy-900 text-white shadow-lg shadow-navy-900/20"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-navy-300 hover:bg-white"
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm sm:text-base">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Trending Sub-categories */}
        <div className="mt-8 sm:mt-10">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3 block">
            Trending in {active.name}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {active.trending.map((sub) => (
              <a
                key={sub.name}
                href={sub.href}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-navy-700 bg-gray-100 border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-300 hover:text-navy-900 transition-all"
              >
                {sub.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { servicesApi } from "@/lib/api";
import { ServiceCategory } from "@/types";
import {
  Star,
  Wrench,
  Truck,
  Sofa,
  Monitor,
  Sparkles,
  ShoppingCart,
  Home,
  TreePine,
  Gift,
  Snowflake,
  User,
  Baby,
  Laptop,
  Building,
  Shield,
  ChevronRight,
  ArrowRight,
  Search,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  star: Star,
  wrench: Wrench,
  truck: Truck,
  sofa: Sofa,
  monitor: Monitor,
  sparkles: Sparkles,
  "shopping-cart": ShoppingCart,
  home: Home,
  "tree-pine": TreePine,
  gift: Gift,
  snowflake: Snowflake,
  user: User,
  baby: Baby,
  laptop: Laptop,
  building: Building,
  shield: Shield,
};

const categoryColors: Record<
  string,
  { gradient: string; top: string; bottom: string; bg: string; text: string }
> = {
  featured: {
    gradient: "from-amber-500 to-orange-500",
    top: "bg-amber-400",
    bottom: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  handyman: {
    gradient: "from-blue-500 to-indigo-500",
    top: "bg-blue-400",
    bottom: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  moving: {
    gradient: "from-emerald-500 to-teal-500",
    top: "bg-emerald-400",
    bottom: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  "furniture-assembly": {
    gradient: "from-violet-500 to-purple-500",
    top: "bg-violet-400",
    bottom: "bg-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  mounting: {
    gradient: "from-sky-500 to-blue-500",
    top: "bg-sky-400",
    bottom: "bg-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
  cleaning: {
    gradient: "from-pink-500 to-rose-500",
    top: "bg-pink-400",
    bottom: "bg-pink-500",
    bg: "bg-pink-50",
    text: "text-pink-700",
  },
  "shopping-delivery": {
    gradient: "from-orange-500 to-red-500",
    top: "bg-orange-400",
    bottom: "bg-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  "ikea-services": {
    gradient: "from-yellow-500 to-amber-500",
    top: "bg-yellow-400",
    bottom: "bg-yellow-500",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
  yardwork: {
    gradient: "from-green-500 to-emerald-500",
    top: "bg-green-400",
    bottom: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  holidays: {
    gradient: "from-red-500 to-pink-500",
    top: "bg-red-400",
    bottom: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  "winter-tasks": {
    gradient: "from-cyan-500 to-blue-500",
    top: "bg-cyan-400",
    bottom: "bg-cyan-500",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
  },
  "personal-assistant": {
    gradient: "from-indigo-500 to-violet-500",
    top: "bg-indigo-400",
    bottom: "bg-indigo-500",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  "baby-prep": {
    gradient: "from-rose-400 to-pink-400",
    top: "bg-rose-300",
    bottom: "bg-rose-400",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
  "online-tasks": {
    gradient: "from-teal-500 to-cyan-500",
    top: "bg-teal-400",
    bottom: "bg-teal-500",
    bg: "bg-teal-50",
    text: "text-teal-700",
  },
  office: {
    gradient: "from-slate-500 to-gray-600",
    top: "bg-slate-400",
    bottom: "bg-slate-600",
    bg: "bg-slate-50",
    text: "text-slate-700",
  },
  contactless: {
    gradient: "from-lime-500 to-green-500",
    top: "bg-lime-400",
    bottom: "bg-lime-500",
    bg: "bg-lime-50",
    text: "text-lime-700",
  },
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    servicesApi
      .categories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      window.location.href = `/providers?search=${encodeURIComponent(searchValue)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Background */}
        <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32">
          {/* Background Image with Blur */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgb(13, 26, 61, 0.85) 0%, rgb(13, 26, 61, 0.85) 100%), url("data:image/svg+xml,%3Csvg width=%27100%27 height=%27100%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h100v100H0z%27 fill=%27%230d1a3d%27/%3E%3C/svg%3E")',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12">
                Your to-do list is on us.
              </h1>

              {/* Search Bar in Hero */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    className="w-full pl-14 pr-6 py-5 rounded-full text-base bg-white text-navy-900 placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-500 hover:bg-primary-400 text-navy-900 font-semibold rounded-full transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section - White Background */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
              Hire a trusted Tasker and get things done
            </h2>
          </div>
        </section>

        {/* Categories and Subcategories Grid */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map((parentCategory) => {
                  const colors = categoryColors[parentCategory.slug] || {
                    gradient: "from-gray-500 to-gray-600",
                    top: "bg-gray-500",
                    bottom: "bg-gray-600",
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                  };
                  const Icon = categoryIcons[parentCategory.icon] || Star;

                  return (
                    <div key={parentCategory.id}>
                      {/* Category Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-6">
                        {parentCategory.name}
                      </h3>

                      {/* Subcategories Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {parentCategory.children.map((subCategory) => (
                          <Link
                            key={subCategory.id}
                            href={`/services/${parentCategory.slug}/${subCategory.slug}`}
                            className="group relative overflow-hidden rounded-2xl h-40 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                          >
                            {/* Card Background - Gradient */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}
                            />

                            {/* Icon Area - Top */}
                            <div className={`absolute top-0 inset-x-0 h-16 ${colors.top} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content - Bottom */}
                            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                              <h4 className="text-sm font-semibold leading-tight group-hover:translate-y-0 transition-transform">
                                {subCategory.name}
                              </h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

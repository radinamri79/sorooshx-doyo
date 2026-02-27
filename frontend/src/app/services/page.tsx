"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { providersApi } from "@/lib/api";
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

const categoryColors: Record<string, string> = {
  featured: "from-amber-500 to-orange-500",
  handyman: "from-blue-500 to-indigo-500",
  moving: "from-emerald-500 to-teal-500",
  "furniture-assembly": "from-violet-500 to-purple-500",
  mounting: "from-sky-500 to-blue-500",
  cleaning: "from-pink-500 to-rose-500",
  "shopping-delivery": "from-orange-500 to-red-500",
  "ikea-services": "from-yellow-500 to-amber-500",
  yardwork: "from-green-500 to-emerald-500",
  holidays: "from-red-500 to-pink-500",
  "winter-tasks": "from-cyan-500 to-blue-500",
  "personal-assistant": "from-indigo-500 to-violet-500",
  "baby-prep": "from-rose-400 to-pink-400",
  "online-tasks": "from-teal-500 to-cyan-500",
  office: "from-slate-500 to-gray-600",
  contactless: "from-lime-500 to-green-500",
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    providersApi
      .categories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy-900 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Your to-do list is on us.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Hire a trusted Tasker and get things done — from home repairs to cleaning and everything in between.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="w-full pl-12 pr-4 py-4 rounded-full text-base bg-white text-navy-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      window.location.href = `/providers?search=${encodeURIComponent(e.currentTarget.value)}`;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Browse All Services
              </h2>
              <p className="text-gray-500 text-base sm:text-lg">
                Choose a category to find the perfect Tasker for your project.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories.map((category) => {
                  const IconComponent =
                    categoryIcons[category.icon] || Star;
                  const gradient =
                    categoryColors[category.slug] || "from-gray-500 to-gray-600";

                  return (
                    <Link
                      key={category.id}
                      href={`/services/${category.slug}`}
                      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
                    >
                      {/* Gradient top bar */}
                      <div
                        className={`h-2 bg-gradient-to-r ${gradient}`}
                      />

                      <div className="p-5 sm:p-6">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-navy-900 mb-1.5 group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {category.description}
                        </p>

                        {/* Subcategory count + Arrow */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">
                            {category.children.length} services
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Preview subcategories */}
                        {category.children.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-1.5">
                              {category.children.slice(0, 3).map((sub) => (
                                <span
                                  key={sub.id}
                                  className="inline-block px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-full"
                                >
                                  {sub.name}
                                </span>
                              ))}
                              {category.children.length > 3 && (
                                <span className="inline-block px-2.5 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
                                  +{category.children.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-navy-900 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Become a Tasker
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Earn money on your schedule. Join thousands of Taskers already using Doyo.
            </p>
            <Link
              href="/become-tasker"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-400 text-navy-900 font-semibold rounded-full transition-colors text-base"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

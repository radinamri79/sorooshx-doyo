"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { servicesApi } from "@/lib/api";
import { ServiceCategory } from "@/types";
import { ChevronRight } from "lucide-react";

export default function CategoriesSection() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    servicesApi
      .categories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategory(cats[0]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="bg-white py-8 sm:py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 h-10 w-24 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-48 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Categories - Horizontally Scrollable on Mobile, Grid on Desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-6 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-start">
          {categories.slice(0, 10).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeCategory?.id === category.id
                  ? "bg-navy-900 text-white shadow-lg shadow-navy-900/20"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-navy-300 hover:bg-white"
              }`}
            >
              <span className="text-base sm:text-lg">📌</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Trending Sub-categories */}
        {activeCategory && (
          <div className="mt-8 sm:mt-10">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-4 block">
              Popular {activeCategory.name} Services
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {activeCategory.children.slice(0, 6).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/services/${activeCategory.slug}/${sub.slug}`}
                  className="group flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-navy-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-400 hover:text-navy-900 transition-all"
                >
                  <span>{sub.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
              {activeCategory.children.length > 6 && (
                <Link
                  href={`/services/${activeCategory.slug}`}
                  className="group flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-navy-700 bg-gray-50 border border-dashed border-navy-200 rounded-lg hover:bg-navy-50 hover:border-navy-400 transition-all"
                >
                  <span>View all {activeCategory.children.length} services</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* View All Services Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-navy-900 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors"
          >
            Browse All Categories
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { servicesApi } from "@/lib/api";
import { getCategoryImage } from "@/lib/categoryImages";
import { ServiceCategory } from "@/types";
import { ChevronRight } from "lucide-react";

// Map category slugs to emojis
const categoryEmojis: Record<string, string> = {
  featured: "⭐",
  handyman: "🔧",
  moving: "📦",
  "furniture-assembly": "🪑",
  mounting: "📺",
  cleaning: "✨",
  "shopping-delivery": "🛍️",
  "ikea-services": "📐",
  yardwork: "🌿",
  holidays: "🎉",
  "winter-tasks": "❄️",
  "personal-assistant": "👔",
  "baby-prep": "👶",
  "online-tasks": "💻",
  office: "🏢",
  contactless: "🤝",
};

function getCategoryEmoji(slug: string): string {
  return categoryEmojis[slug] ?? "✨";
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    servicesApi
      .categories()
      .then((cats) => {
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-3">
            Popular Services
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Browse our most requested categories and find trusted service providers
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.slice(0, 9).map((category) => {
            const emoji = getCategoryEmoji(category.slug);
            const image = getCategoryImage(category.slug);

            return (
              <Link
                key={category.id}
                href={`/services/${category.slug}`}
                className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Category Image */}
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
                </div>

                {/* Category Info */}
                <div className="relative px-4 sm:px-6 py-4 sm:py-5 bg-white">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="text-2xl sm:text-3xl mb-1.5">{emoji}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-navy-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                  </div>

                  {/* Subcategories Preview */}
                  <div className="space-y-2">
                    {category.children.slice(0, 3).map((sub) => (
                      <div
                        key={sub.id}
                        className="text-xs sm:text-sm text-gray-600 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary-500 rounded-full flex-shrink-0" />
                        {sub.name}
                      </div>
                    ))}
                    {category.children.length > 3 && (
                      <div className="text-xs sm:text-sm text-primary-600 font-medium pt-1">
                        +{category.children.length - 3} more services
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-navy-900 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors shadow-lg shadow-primary-500/30 hover:shadow-primary-400/30"
          >
            Explore All Categories
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

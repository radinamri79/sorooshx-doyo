"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  ArrowLeft,
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

const categoryColors: Record<string, { gradient: string; bg: string; text: string }> = {
  featured: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
  handyman: { gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-50", text: "text-blue-700" },
  moving: { gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  "furniture-assembly": { gradient: "from-violet-500 to-purple-500", bg: "bg-violet-50", text: "text-violet-700" },
  mounting: { gradient: "from-sky-500 to-blue-500", bg: "bg-sky-50", text: "text-sky-700" },
  cleaning: { gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-700" },
  "shopping-delivery": { gradient: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700" },
  "ikea-services": { gradient: "from-yellow-500 to-amber-500", bg: "bg-yellow-50", text: "text-yellow-700" },
  yardwork: { gradient: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-700" },
  holidays: { gradient: "from-red-500 to-pink-500", bg: "bg-red-50", text: "text-red-700" },
  "winter-tasks": { gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-50", text: "text-cyan-700" },
  "personal-assistant": { gradient: "from-indigo-500 to-violet-500", bg: "bg-indigo-50", text: "text-indigo-700" },
  "baby-prep": { gradient: "from-rose-400 to-pink-400", bg: "bg-rose-50", text: "text-rose-700" },
  "online-tasks": { gradient: "from-teal-500 to-cyan-500", bg: "bg-teal-50", text: "text-teal-700" },
  office: { gradient: "from-slate-500 to-gray-600", bg: "bg-slate-50", text: "text-slate-700" },
  contactless: { gradient: "from-lime-500 to-green-500", bg: "bg-lime-50", text: "text-lime-700" },
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!categorySlug) return;
    setIsLoading(true);
    servicesApi
      .categoryBySlug(categorySlug)
      .then(setCategory)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [categorySlug]);

  const colors = categoryColors[categorySlug] || {
    gradient: "from-gray-500 to-gray-600",
    bg: "bg-gray-50",
    text: "text-gray-700",
  };

  const IconComponent = category
    ? categoryIcons[category.icon] || Star
    : Star;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className={`bg-gradient-to-br ${colors.gradient} pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/services" className="hover:text-white transition-colors">
                Services
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">
                {isLoading ? "Loading..." : category?.name}
              </span>
            </nav>

            {isLoading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl animate-pulse" />
                <div className="w-64 h-10 bg-white/20 rounded-lg animate-pulse" />
                <div className="w-96 h-6 bg-white/20 rounded-lg animate-pulse" />
              </div>
            ) : error || !category ? (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Services
                </Link>
              </div>
            ) : (
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {category.name}
                  </h1>
                  <p className="text-lg text-white/80 max-w-2xl">
                    {category.description}
                  </p>
                  <p className="text-sm text-white/60 mt-3">
                    {category.children.length} services available
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Subcategories Grid */}
        {!isLoading && !error && category && (
          <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-8">
                All {category.name} Services
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/services/${categorySlug}/${sub.slug}`}
                    className="group flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-gray-200 bg-white hover:border-transparent hover:shadow-lg transition-all duration-200"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-navy-900 group-hover:text-primary-600 transition-colors truncate">
                        {sub.name}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Services */}
        <section className="pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse all categories
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-900 py-14 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Hire a trusted Tasker for {category?.name?.toLowerCase() || "your project"} today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-400 text-navy-900 font-semibold rounded-full transition-colors"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/become-tasker"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-full transition-colors"
              >
                Become a Tasker
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

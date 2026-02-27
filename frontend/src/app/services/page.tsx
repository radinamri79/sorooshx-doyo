"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { servicesApi } from "@/lib/api";
import { getCategoryImage } from "@/lib/categoryImages";
import { ServiceCategory } from "@/types";
import { Search, ChevronRight } from "lucide-react";



export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    servicesApi
      .categories()
      .then(setCategories)
      .catch(console.error)
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
        {/* ─── Hero ─── */}
        <section className="relative bg-navy-900 min-h-[62vh] flex items-center pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
          {/* Decorative blobs – matches home HeroSection */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-navy-700/50 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              Your to-do list is{" "}
              <span className="text-primary-500">on us.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl mx-auto">
              Hire a trusted Tasker and get things done.
            </p>

            {/* Responsive search – identical pattern to HeroSection */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-navy-950/30 overflow-hidden">
                  <Search className="w-5 h-5 text-gray-400 ml-5 sm:ml-6 shrink-0" />
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 px-3 sm:px-4 py-4 sm:py-5 text-base sm:text-lg text-navy-900 placeholder-gray-400 outline-none bg-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    className="shrink-0 mr-2 px-5 sm:px-8 py-3 sm:py-3.5 bg-primary-500 hover:bg-primary-400 text-navy-900 font-bold text-sm sm:text-base rounded-full transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category cards ─── */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8 sm:mb-10">
              Browse by Category
            </h2>
            {isLoading ? (
              /* ── Loading skeleton ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-52 bg-gray-200 rounded-2xl animate-pulse" />
                    <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ── Category grid ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {categories.map((cat) => {
                  const img = getCategoryImage(cat.slug);
                  return (
                    <div key={cat.id} className="flex flex-col">
                      {/* ── Image card – block fixes height on <a> element ── */}
                      <Link
                        href={`/services/${cat.slug}`}
                        className="group relative block w-full h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 mb-4"
                      >
                        <Image
                          src={img}
                          alt={cat.name}
                          fill
                          priority
                          unoptimized
                          draggable={false}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />

                        {/* Category name on the card */}
                        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
                          <h3 className="text-lg font-bold text-white drop-shadow">
                            {cat.name}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </Link>

                      {/* ── Subcategory chips ── */}
                      <div className="flex flex-wrap gap-2">
                        {cat.children.slice(0, 6).map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/services/${cat.slug}/${sub.slug}`}
                            className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 bg-white text-navy-900 hover:border-primary-500 hover:text-navy-900 hover:bg-primary-100 transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                        {cat.children.length > 6 && (
                          <Link
                            href={`/services/${cat.slug}`}
                            className="px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-primary-300 text-navy-700 hover:border-primary-500 hover:bg-primary-50 transition-all"
                          >
                            +{cat.children.length - 6} more
                          </Link>
                        )}
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


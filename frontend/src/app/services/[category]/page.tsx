"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { servicesApi } from "@/lib/api";
import { getCategoryImage } from "@/lib/categoryImages";
import { ServiceCategory } from "@/types";
import { Search, ChevronRight, ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!categorySlug) return;
    setIsLoading(true);
    servicesApi
      .categoryBySlug(categorySlug)
      .then(setCategory)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [categorySlug]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      window.location.href = `/providers?search=${encodeURIComponent(searchValue)}&category=${categorySlug}`;
    }
  };

  const heroImage = getCategoryImage(categorySlug);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative bg-navy-900 min-h-[62vh] flex items-center pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
          {/* Faint category image behind blobs */}
          <Image
            src={heroImage}
            alt={category?.name ?? "Category"}
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-navy-900/70" />

          {/* Decorative blobs – same as home */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-navy-700/50 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            {isLoading ? (
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-72 h-14 bg-white/10 rounded-xl animate-pulse" />
                <div className="w-48 h-6 bg-white/10 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                  {category?.name}{" "}
                  <span className="text-primary-500">Services</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl mx-auto">
                  {category?.description
                    ? category.description
                    : `${category?.children.length ?? 0} services available`}
                </p>
              </>
            )}

            {/* Responsive search – same pattern as home HeroSection */}
            <div className="max-w-2xl mx-auto mt-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-navy-950/30 overflow-hidden">
                  <Search className="w-5 h-5 text-gray-400 ml-5 sm:ml-6 shrink-0" />
                  <input
                    type="text"
                    placeholder={`Search ${category?.name ?? "services"}…`}
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

        {/* ─── Error state ─── */}
        {error && (
          <section className="py-20 text-center">
            <h1 className="text-3xl font-bold text-navy-900 mb-4">Category Not Found</h1>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-navy-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
          </section>
        )}

        {/* ─── Subcategory cards – same image-card structure as services page ─── */}
        {!error && (
          <section className="bg-gray-50 py-12 sm:py-16 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8 flex-wrap">
                <Link href="/services" className="hover:text-navy-900 transition-colors">
                  Services
                </Link>
                <ChevronRight className="w-4 h-4 shrink-0" />
                <span className="text-navy-900 font-medium">
                  {isLoading ? "Loading…" : (category?.name ?? categorySlug)}
                </span>
              </nav>

              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8 sm:mb-10">
                {isLoading ? (
                  <span className="inline-block w-64 h-9 bg-gray-200 rounded-lg animate-pulse" />
                ) : (
                  `All ${category?.name} Services`
                )}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-52 bg-gray-200 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(category?.children ?? []).map((sub) => (
                      /* block fixes height on <a> tag */
                      <Link
                        key={sub.id}
                        href={`/services/${categorySlug}/${sub.slug}`}
                        className="group relative block w-full h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <Image
                          src={heroImage}
                          alt={sub.name}
                          fill
                          priority
                          unoptimized
                          draggable={false}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/30 to-transparent" />
                        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
                          <h3 className="text-base font-bold text-white drop-shadow">
                            {sub.name}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Browse all categories
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

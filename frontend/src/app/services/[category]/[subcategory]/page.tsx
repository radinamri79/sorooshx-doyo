"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { providersApi } from "@/lib/api";
import { ServiceCategory } from "@/types";
import {
  ChevronRight,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function SubcategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const subcategorySlug = params.subcategory as string;

  const [parent, setParent] = useState<ServiceCategory | null>(null);
  const [subcategory, setSubcategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;
    setIsLoading(true);
    providersApi
      .categoryBySlug(categorySlug)
      .then((cat) => {
        setParent(cat);
        const sub = cat.children.find((c) => c.slug === subcategorySlug);
        setSubcategory(sub || null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [categorySlug, subcategorySlug]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy-900 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
              <Link href="/services" className="hover:text-white transition-colors">
                Services
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link
                href={`/services/${categorySlug}`}
                className="hover:text-white transition-colors"
              >
                {isLoading ? "..." : parent?.name}
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-white font-medium">
                {isLoading ? "Loading..." : subcategory?.name || "Not Found"}
              </span>
            </nav>

            {isLoading ? (
              <div className="space-y-4">
                <div className="w-80 h-10 bg-white/10 rounded-lg animate-pulse" />
                <div className="w-96 h-6 bg-white/10 rounded-lg animate-pulse" />
              </div>
            ) : !subcategory ? (
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
                <Link
                  href={`/services/${categorySlug}`}
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {parent?.name || "category"}
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                  {subcategory.name}
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                  {subcategory.description ||
                    `Find trusted professionals for ${subcategory.name.toLowerCase()} in your area.`}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Quick Info */}
        {!isLoading && subcategory && (
          <section className="border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-6 sm:gap-10 py-6">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>Available in your area</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>Same-day availability</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-primary-500" />
                  <span>Verified professionals</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Booking CTA */}
        {!isLoading && subcategory && (
          <section className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
                  Book a {subcategory.name} Tasker
                </h2>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                  Tell us about your task, and we&apos;ll match you with experienced Taskers ready to help.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-400 text-navy-900 font-semibold rounded-full transition-colors"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Related Services */}
              {parent && parent.children.length > 1 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-navy-900 mb-4">
                    Other {parent.name} Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {parent.children
                      .filter((c) => c.slug !== subcategorySlug)
                      .slice(0, 8)
                      .map((sibling) => (
                        <Link
                          key={sibling.id}
                          href={`/services/${categorySlug}/${sibling.slug}`}
                          className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
                        >
                          {sibling.name}
                        </Link>
                      ))}
                    {parent.children.length > 9 && (
                      <Link
                        href={`/services/${categorySlug}`}
                        className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 text-gray-500 hover:text-navy-900 transition-colors"
                      >
                        +{parent.children.length - 8} more
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Back Navigation */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/services/${categorySlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {parent?.name || "Category"}
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

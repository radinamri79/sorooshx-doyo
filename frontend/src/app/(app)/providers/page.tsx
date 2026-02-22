"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { providersApi } from "@/lib/api";
import { Provider, ServiceCategory } from "@/types";
import Spinner from "@/components/ui/Spinner";
import { Star, MapPin, CheckCircle } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProviders();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await providersApi.categories();
      setCategories(data);
    } catch {
      // silently fail
    }
  };

  const loadProviders = async (params?: Record<string, string>) => {
    setIsLoading(true);
    try {
      const data = await providersApi.list(params);
      setProviders(data.results);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (search) params.search = search;
    loadProviders(params);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Providers</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search providers..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleSearch}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          Search
        </button>
      </div>

      {/* Providers Grid */}
      {isLoading ? (
        <Spinner className="mt-10" />
      ) : providers.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No providers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{provider.business_name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{provider.city || "N/A"}</span>
                  </div>
                </div>
                {provider.is_verified && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {provider.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{provider.average_rating}</span>
                  <span className="text-gray-400 text-sm">({provider.total_reviews})</span>
                </div>
                <div className="flex gap-1">
                  {provider.categories?.slice(0, 2).map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-xs"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

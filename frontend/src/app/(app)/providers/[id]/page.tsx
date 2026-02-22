"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { providersApi } from "@/lib/api";
import { ProviderDetail } from "@/types";
import { formatPrice } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { Star, MapPin, CheckCircle, Clock, ArrowLeft } from "lucide-react";

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    try {
      const data = await providersApi.get(id);
      setProvider(data);
    } catch {
      router.push("/providers");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Spinner className="mt-20" />;
  if (!provider) return null;

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{provider.business_name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {provider.city}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {provider.average_rating} ({provider.total_reviews} reviews)
              </span>
              {provider.is_verified && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-4">{provider.description}</p>
        <div className="flex gap-2 mt-4">
          {provider.categories?.map((cat) => (
            <span key={cat.id} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Services</h2>
        {provider.services?.length === 0 ? (
          <p className="text-gray-500">No services listed yet.</p>
        ) : (
          <div className="space-y-3">
            {provider.services?.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <span className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Clock className="w-3.5 h-3.5" /> {service.duration_minutes} min
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(service.price)}</p>
                  <Button size="sm" className="mt-2">
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule */}
      {provider.schedules && provider.schedules.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {provider.schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`p-3 rounded-lg text-sm ${
                  schedule.is_available
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-400"
                }`}
              >
                <p className="font-medium">{schedule.day_name}</p>
                <p>
                  {schedule.start_time} - {schedule.end_time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

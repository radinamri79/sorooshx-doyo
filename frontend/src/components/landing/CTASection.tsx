import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-navy-900 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center max-w-3xl mx-auto">
          {/* Decorative glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Get help today
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-lg mx-auto">
              Join thousands of satisfied customers who trust Doyo to get things done around their home.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-400 text-navy-900 font-bold text-base rounded-full transition-colors shadow-lg shadow-primary-500/30"
              >
                Sign up today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/become-tasker"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-gray-500 hover:border-gray-300 text-white font-bold text-base rounded-full transition-colors"
              >
                Become a Tasker
              </Link>
            </div>

            {/* Quick links */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "Mounting",
                "Furniture Assembly",
                "Help Moving",
                "House Cleaning",
                "Plumbing",
                "Electrical Help",
                "Painting",
                "Yardwork",
              ].map((service) => (
                <Link
                  key={service}
                  href={`/services/${service.toLowerCase().replace(/ /g, "-")}`}
                  className="px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full transition-colors"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

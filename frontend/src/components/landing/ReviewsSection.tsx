"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Review {
  name: string;
  text: string;
  service: string;
  rating: number;
}

const reviews: Review[] = [
  {
    name: "Sara M.",
    text: "The tasker assembled my IKEA furniture in under 30 minutes. He was professional, clean, and even organized the leftover hardware. Absolutely amazing experience!",
    service: "Furniture Assembly",
    rating: 5,
  },
  {
    name: "James K.",
    text: "David did an awesome job assembling the crib and dresser for our nursery. He cleaned up after his work, organized boxes for easy disposal. Highly recommended!",
    service: "Furniture Assembly",
    rating: 5,
  },
  {
    name: "Mina R.",
    text: "I hired a tasker to patch holes in my wall and ceiling. The work was seamless — came back for a second coat to make it look perfect. Professional and fast!",
    service: "Home Repairs",
    rating: 5,
  },
  {
    name: "Alex P.",
    text: "The tasker came with all the equipment to do the job, even hardware I didn't know I needed. Hung a heavy chandelier perfectly and fixed a cabinet to our wall.",
    service: "Electrical Help",
    rating: 5,
  },
  {
    name: "Leila T.",
    text: "Fixed my AC drain line which was clogging my bathroom sink. The tasker was prompt, communicative, and efficient. Already booked another task!",
    service: "Plumbing",
    rating: 5,
  },
  {
    name: "Mike D.",
    text: "Great job helping us install frameless glass shower doors with an unusual setup. Patient and willing to figure it out together. Thank you!",
    service: "Mounting",
    rating: 5,
  },
];

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(next, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, next]);

  const handleManualNav = (direction: "prev" | "next") => {
    setIsAutoPlaying(false);
    direction === "prev" ? prev() : next();
  };

  return (
    <section className="bg-gray-50 py-14 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 max-w-xl">
              See what happy customers are saying about Doyo
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleManualNav("prev")}
              className="p-2.5 rounded-full border border-gray-300 hover:border-navy-300 hover:bg-white text-gray-600 hover:text-navy-900 transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleManualNav("next")}
              className="p-2.5 rounded-full border border-gray-300 hover:border-navy-300 hover:bg-white text-gray-600 hover:text-navy-900 transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: "20px",
              transform: `translateX(calc(-${current} * (${100 / itemsPerView}% + ${20 / itemsPerView}px)))`,
            }}
          >
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="shrink-0 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
                style={{ width: `calc(${100 / itemsPerView}% - ${20 * (itemsPerView - 1) / itemsPerView}px)` }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 text-[15px] leading-relaxed mb-6 line-clamp-4">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{review.name}</p>
                    <p className="text-xs text-primary-700 font-medium">{review.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation (mobile) */}
        <div className="flex sm:hidden justify-center gap-2 mt-6">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrent(idx); setIsAutoPlaying(false); }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current ? "bg-navy-900 w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

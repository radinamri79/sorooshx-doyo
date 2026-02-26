"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
}

const stats: StatItem[] = [
  { label: "Tasks Completed", value: "50,000+", numericValue: 50000, suffix: "+" },
  { label: "Moving Tasks", value: "12,000+", numericValue: 12000, suffix: "+" },
  { label: "Items Mounted", value: "8,500+", numericValue: 8500, suffix: "+" },
  { label: "Home Repairs", value: "15,000+", numericValue: 15000, suffix: "+" },
  { label: "Homes Cleaned", value: "10,000+", numericValue: 10000, suffix: "+" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = count.toLocaleString();

  return (
    <div ref={ref} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900">
      {formatted}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-primary-50 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900">
            Trusted by thousands
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Join the growing community of happy customers getting tasks done with Doyo.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter target={stat.numericValue} suffix={stat.suffix} />
              <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

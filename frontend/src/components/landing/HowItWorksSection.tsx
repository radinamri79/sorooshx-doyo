import { CheckCircle, Shield, Users } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guarantees Row */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900">
            Your satisfaction, guaranteed
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-primary-700" />
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">Happiness Pledge</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you&apos;re not satisfied, we&apos;ll work to make it right.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary-700" />
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">Vetted Taskers</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Taskers are always background checked before joining the platform.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary-700" />
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">Dedicated Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Friendly service when you need us — every day of the week.
              </p>
            </div>
          </div>
        </div>

        {/* How it Works Steps */}
        <div className="relative">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 max-w-4xl mx-auto relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300" />

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-24 h-24 rounded-full bg-navy-900 flex items-center justify-center mb-6 shadow-xl shadow-navy-900/20">
                <span className="text-4xl font-extrabold text-primary-500">1</span>
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">Choose a Tasker</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Browse taskers by price, skills, and reviews to find the perfect match.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-24 h-24 rounded-full bg-navy-900 flex items-center justify-center mb-6 shadow-xl shadow-navy-900/20">
                <span className="text-4xl font-extrabold text-primary-500">2</span>
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">Schedule a Tasker</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pick a time that works for you — as early as today.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-24 h-24 rounded-full bg-navy-900 flex items-center justify-center mb-6 shadow-xl shadow-navy-900/20">
                <span className="text-4xl font-extrabold text-primary-500">3</span>
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">Get it Done</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chat, pay, tip, and review all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

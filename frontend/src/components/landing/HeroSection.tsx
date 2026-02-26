import { Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-navy-900 pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-36 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-navy-700/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Slogan - White and Yellow */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            <span className="text-primary-500">What?</span>
            <br />
            <span className="text-primary-500">When?</span>
            <br />
            <span className="text-primary-500">Where?</span>
          </h1>

          {/* Sub-description */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto font-medium">
            Find trusted service providers in your neighborhood and get tasks done efficiently.
          </p>

          {/* Search Box */}
          <div className="mt-10 sm:mt-12 lg:mt-14 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-navy-950/30 overflow-hidden">
                <Search className="w-5 h-5 text-gray-400 ml-5 sm:ml-6 shrink-0" />
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="flex-1 px-3 sm:px-4 py-4 sm:py-5 text-base sm:text-lg text-navy-900 placeholder-gray-400 outline-none bg-transparent"
                />
                <button className="shrink-0 mr-2 px-5 sm:px-8 py-3 sm:py-3.5 bg-primary-500 hover:bg-primary-400 text-navy-900 font-bold text-sm sm:text-base rounded-full transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

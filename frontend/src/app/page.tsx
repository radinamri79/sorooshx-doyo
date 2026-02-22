import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">Doyo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center text-center pt-20 pb-32">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Find Local Services
            <br />
            <span className="text-primary-600">Powered by AI</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl">
            Tell our AI assistant what you need, and we&apos;ll match you with the
            perfect service provider. From cleaning to tutoring, Doyo has you covered.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/providers"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Browse Providers
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-xl">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Chat Assistant</h3>
              <p className="text-gray-600 text-sm">
                Describe what you need in plain language and let AI find the best match.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Providers</h3>
              <p className="text-gray-600 text-sm">
                Browse vetted professionals with ratings, reviews, and portfolios.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-sm">
                Place orders, track progress, and communicate in real-time.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

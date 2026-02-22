import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center">
                <span className="text-primary-500 font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl sm:text-2xl text-navy-900">Doyo</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-navy-900 text-sm font-medium">Services</a>
              <a href="#" className="text-gray-700 hover:text-navy-900 text-sm font-medium">How it works</a>
              <a href="#" className="text-gray-700 hover:text-navy-900 text-sm font-medium">About</a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-navy-900 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary-500 text-navy-900 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="pt-12 sm:pt-20 pb-20 sm:pb-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
              Get your home task done now or later
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl">
              Don't let it wait. Find trusted service providers in your neighborhood and get tasks done efficiently.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/auth/register"
                className="bg-primary-500 text-navy-900 px-6 py-3 sm:py-3 rounded-lg text-lg font-bold hover:bg-primary-400 transition-colors text-center"
              >
                Download App
              </Link>
              <Link
                href="/chat"
                className="border-2 border-navy-900 text-navy-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-navy-50 transition-colors text-center"
              >
                Start Now
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-24 border-t border-gray-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 text-center mb-4">
            How does it work?
          </h2>
          <p className="text-center text-gray-600 mb-12 sm:mb-16 max-w-2xl mx-auto">
            Never been easier. In 3 easy steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-600">#1</span>
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Create Request</h3>
              <p className="text-gray-600">Login to your profile and create your service request</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-600">#2</span>
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Find Providers</h3>
              <p className="text-gray-600">Browse trusted service providers in your neighborhood</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-600">#3</span>
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">Connect with provider and get service delivery</p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 sm:py-24 border-t border-gray-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 text-center mb-4">
            What do you need help with today?
          </h2>
          <p className="text-center text-gray-600 mb-12 sm:mb-16">Popular services on Doyo</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Cleaning", icon: "🧹" },
              { name: "Electrical Work", icon: "⚡" },
              { name: "Plumbing", icon: "🔧" },
              { name: "Painting", icon: "🎨" },
              { name: "HVAC Repair", icon: "❄️" },
              { name: "Home Repair", icon: "🏠" },
            ].map((service) => (
              <div
                key={service.name}
                className="p-6 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-center"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-navy-900">{service.name}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/providers"
              className="inline-block text-primary-600 font-bold hover:text-primary-700 underline"
            >
              View all services →
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24 border-t border-gray-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 text-center mb-4">
            Why choose Doyo?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="p-6 sm:p-8 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-4">✓</div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Verified Providers</h3>
              <p className="text-gray-600">All providers are verified and rated by our community</p>
            </div>
            <div className="p-6 sm:p-8 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get service delivery in less than 1 hour in most cases</p>
            </div>
            <div className="p-6 sm:p-8 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-4">💬</div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Easy Communication</h3>
              <p className="text-gray-600">Chat directly with providers and track progress in real-time</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 border-t border-gray-200">
          <div className="bg-navy-900 text-white rounded-xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-300 mb-8 text-lg">Join thousands of users getting tasks done with Doyo</p>
            <Link
              href="/auth/register"
              className="inline-block bg-primary-500 text-navy-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="font-bold text-navy-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-navy-900">Features</a></li>
                <li><a href="#" className="hover:text-navy-900">Pricing</a></li>
                <li><a href="#" className="hover:text-navy-900">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-navy-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-navy-900">About</a></li>
                <li><a href="#" className="hover:text-navy-900">Blog</a></li>
                <li><a href="#" className="hover:text-navy-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-navy-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-navy-900">Privacy</a></li>
                <li><a href="#" className="hover:text-navy-900">Terms</a></li>
                <li><a href="#" className="hover:text-navy-900">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-navy-900 mb-3">Follow</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-navy-900">Twitter</a></li>
                <li><a href="#" className="hover:text-navy-900">LinkedIn</a></li>
                <li><a href="#" className="hover:text-navy-900">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Doyo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

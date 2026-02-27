"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { servicesApi } from "@/lib/api";
import { ServiceCategory } from "@/types";
import {
  ChevronDown,
  Search,
  Briefcase,
  DollarSign,
  Users,
  MapPin,
  CheckCircle2,
} from "lucide-react";

// Comprehensive US and Canadian locations
const LOCATIONS = [
  // United States
  "Birmingham, AL",
  "Montgomery, AL",
  "Huntsville, AL",
  "Anchorage, AK",
  "Juneau, AK",
  "Fairbanks, AK",
  "Phoenix, AZ",
  "Mesa, AZ",
  "Chandler, AZ",
  "Scottsdale, AZ",
  "Tempe, AZ",
  "Little Rock, AR",
  "Fayetteville, AR",
  "Springdale, AR",
  "Los Angeles, CA",
  "San Diego, CA",
  "San Jose, CA",
  "San Francisco, CA",
  "Fresno, CA",
  "Sacramento, CA",
  "Long Beach, CA",
  "Oakland, CA",
  "Denver, CO",
  "Colorado Springs, CO",
  "Aurora, CO",
  "Bridgeport, CT",
  "New Haven, CT",
  "Hartford, CT",
  "Wilmington, DE",
  "Dover, DE",
  "Jacksonville, FL",
  "Miami, FL",
  "Tampa, FL",
  "Orlando, FL",
  "St. Petersburg, FL",
  "Hialeah, FL",
  "Atlanta, GA",
  "Columbus, GA",
  "Augusta, GA",
  "Savannah, GA",
  "Honolulu, HI",
  "Boise, ID",
  "Nampa, ID",
  "Meridian, ID",
  "Chicago, IL",
  "Aurora, IL",
  "Joliet, IL",
  "Naperville, IL",
  "Rockford, IL",
  "Indianapolis, IN",
  "Fort Wayne, IN",
  "Evansville, IN",
  "Des Moines, IA",
  "Cedar Rapids, IA",
  "Davenport, IA",
  "Kansas City, KS",
  "Wichita, KS",
  "Overland Park, KS",
  "Louisville, KY",
  "Lexington, KY",
  "New Orleans, LA",
  "Baton Rouge, LA",
  "Lafayette, LA",
  "Portland, ME",
  "Lewiston, ME",
  "Bangor, ME",
  "Baltimore, MD",
  "Columbia, MD",
  "Gaithersburg, MD",
  "Boston, MA",
  "Worcester, MA",
  "Springfield, MA",
  "Cambridge, MA",
  "Detroit, MI",
  "Grand Rapids, MI",
  "Warren, MI",
  "Sterling Heights, MI",
  "Minneapolis, MN",
  "Saint Paul, MN",
  "Rochester, MN",
  "Bloomington, MN",
  "Jackson, MS",
  "Gulfport, MS",
  "Southaven, MS",
  "Kansas City, MO",
  "Saint Louis, MO",
  "Springfield, MO",
  "Columbia, MO",
  "Billings, MT",
  "Missoula, MT",
  "Great Falls, MT",
  "Omaha, NE",
  "Lincoln, NE",
  "Bellevue, NE",
  "Las Vegas, NV",
  "Henderson, NV",
  "Reno, NV",
  "North Las Vegas, NV",
  "Manchester, NH",
  "Nashua, NH",
  "Newark, NJ",
  "Jersey City, NJ",
  "Paterson, NJ",
  "Elizabeth, NJ",
  "Albuquerque, NM",
  "Las Cruces, NM",
  "Santa Fe, NM",
  "New York, NY",
  "Buffalo, NY",
  "Rochester, NY",
  "Yonkers, NY",
  "Charlotte, NC",
  "Raleigh, NC",
  "Greensboro, NC",
  "Durham, NC",
  "Bismarck, ND",
  "Fargo, ND",
  "Grand Forks, ND",
  "Columbus, OH",
  "Cleveland, OH",
  "Cincinnati, OH",
  "Toledo, OH",
  "Akron, OH",
  "Oklahoma City, OK",
  "Tulsa, OK",
  "Norman, OK",
  "Portland, OR",
  "Eugene, OR",
  "Salem, OR",
  "Gresham, OR",
  "Philadelphia, PA",
  "Pittsburgh, PA",
  "Allentown, PA",
  "Providence, RI",
  "Warwick, RI",
  "Cranston, RI",
  "Charleston, SC",
  "Columbia, SC",
  "Greenville, SC",
  "Sioux Falls, SD",
  "Rapid City, SD",
  "Memphis, TN",
  "Nashville, TN",
  "Knoxville, TN",
  "Houston, TX",
  "San Antonio, TX",
  "Dallas, TX",
  "Austin, TX",
  "Fort Worth, TX",
  "El Paso, TX",
  "Arlington, TX",
  "Salt Lake City, UT",
  "West Valley City, UT",
  "Provo, UT",
  "Burlington, VT",
  "Rutland, VT",
  "Virginia Beach, VA",
  "Richmond, VA",
  "Arlington, VA",
  "Alexandria, VA",
  "Seattle, WA",
  "Spokane, WA",
  "Tacoma, WA",
  "Vancouver, WA",
  "Charleston, WV",
  "Huntington, WV",
  "Milwaukee, WI",
  "Madison, WI",
  "Green Bay, WI",
  "Racine, WI",
  "Cheyenne, WY",
  "Casper, WY",
  "Laramie, WY",

  // Canada
  "Calgary, AB",
  "Edmonton, AB",
  "Red Deer, AB",
  "Lethbridge, AB",
  "Vancouver, BC",
  "Victoria, BC",
  "Burnaby, BC",
  "Surrey, BC",
  "Kelowna, BC",
  "Winnipeg, MB",
  "Brandon, MB",
  "Flin Flon, MB",
  "Saint John, NB",
  "Moncton, NB",
  "Fredericton, NB",
  "St. John's, NL",
  "Corner Brook, NL",
  "Halifax, NS",
  "Sydney, NS",
  "Cape Breton, NS",
  "Toronto, ON",
  "Ottawa, ON",
  "Mississauga, ON",
  "Brampton, ON",
  "Hamilton, ON",
  "London, ON",
  "Kitchener, ON",
  "Markham, ON",
  "Charlottetown, PE",
  "Summerside, PE",
  "Montreal, QC",
  "Quebec City, QC",
  "Gatineau, QC",
  "Laval, QC",
  "Sherbrooke, QC",
  "Regina, SK",
  "Saskatoon, SK",
  "Prince Albert, SK",
  "Yellowknife, NT",
  "Hay River, NT",
  "Iqaluit, NU",
  "Rankin Inlet, NU",
  "Whitehorse, YT",
  "Dawson City, YT",
];

// Earnings estimate based on category (example rates)
const EARNINGS_BY_CATEGORY: Record<string, number> = {
  handyman: 45,
  moving: 50,
  mounting: 40,
  cleaning: 35,
  "furniture-assembly": 42,
  "ikea-services": 40,
  yardwork: 38,
  "personal-assistant": 35,
  "shopping-delivery": 30,
  "winter-tasks": 45,
  "baby-prep": 35,
  "online-tasks": 25,
  office: 40,
  holiday: 40,
  contactless: 35,
};

export default function BecomeATaskerPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ServiceCategory | null>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  useEffect(() => {
    servicesApi
      .categories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredLocations = LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSubcategories = selectedCategory?.children.filter((sub) =>
    sub.name.toLowerCase().includes(subcategorySearch.toLowerCase())
  ) || [];

  const estimatedEarnings =
    selectedSubcategory && EARNINGS_BY_CATEGORY[selectedSubcategory.slug]
      ? EARNINGS_BY_CATEGORY[selectedSubcategory.slug]
      : EARNINGS_BY_CATEGORY[selectedCategory?.slug || ""] || 35;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section className="relative bg-navy-900 pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-36 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-navy-700/50 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
                Earn money{" "}
                <span className="text-primary-500">your way.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto font-medium">
                See how much you can make tasking as a service provider on Doyo
              </p>
            </div>
          </div>
        </section>

        {/* ─── Calculator Section ─── */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left: Selectors */}
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                  Select your area &amp; services
                </h2>

                {/* Location Selector with Search */}
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-3">
                    Select your area
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left text-base text-navy-900 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-colors flex items-center justify-between"
                    >
                      <span>
                        {selectedLocation ? selectedLocation : "Choose a location..."}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          showLocationDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown with search */}
                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-3 sticky top-0 bg-white border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search locations..."
                              value={locationSearch}
                              onChange={(e) => setLocationSearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-sm text-navy-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map((loc) => (
                              <button
                                key={loc}
                                onClick={() => {
                                  setSelectedLocation(loc);
                                  setLocationSearch("");
                                  setShowLocationDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 hover:bg-primary-50 transition-colors ${
                                  selectedLocation === loc
                                    ? "bg-primary-100 text-primary-900 font-semibold"
                                    : "text-navy-900"
                                }`}
                              >
                                {loc}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 text-center">
                              No locations found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Selector with Search */}
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-3">
                    Choose a Category
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left text-base text-navy-900 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-colors flex items-center justify-between"
                      >
                        <span>
                          {selectedCategory ? selectedCategory.name : "Select a category..."}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            showCategoryDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Dropdown with search */}
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-3 sticky top-0 bg-white border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search categories..."
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-sm text-navy-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setSelectedSubcategory(null);
                                  setCategorySearch("");
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 hover:bg-primary-50 transition-colors ${
                                  selectedCategory?.id === cat.id
                                    ? "bg-primary-100 text-primary-900 font-semibold"
                                    : "text-navy-900"
                                }`}
                              >
                                {cat.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 text-center">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcategory Selector with Search */}
                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-3">
                      Choose a Sub-Category
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left text-base text-navy-900 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-colors flex items-center justify-between"
                      >
                        <span>
                          {selectedSubcategory
                            ? selectedSubcategory.name
                            : "Select a sub-category..."}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            showSubcategoryDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown with search */}
                      {showSubcategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="p-3 sticky top-0 bg-white border-b border-gray-100">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search sub-categories..."
                                value={subcategorySearch}
                                onChange={(e) => setSubcategorySearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm text-navy-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                              />
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {filteredSubcategories.length > 0 ? (
                              filteredSubcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    setSelectedSubcategory(sub);
                                    setSubcategorySearch("");
                                    setShowSubcategoryDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 hover:bg-primary-50 transition-colors ${
                                    selectedSubcategory?.id === sub.id
                                      ? "bg-primary-100 text-primary-900 font-semibold"
                                      : "text-navy-900"
                                  }`}
                                >
                                  {sub.name}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                                No sub-categories found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Earnings Display */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-8">
                  {/* Earnings Card */}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                      Estimated earnings
                    </p>
                    <div className="text-5xl sm:text-6xl font-bold text-primary-500 mb-2">
                      ${estimatedEarnings}
                    </div>
                    <p className="text-gray-600 text-sm">per hour</p>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                      <strong>Estimate earnings are based on average rate</strong> in locations similar to yours.
                      Actual earnings may vary with your rates, category type, location, demand and other factors.
                    </p>
                  </div>

                  {/* Selection Status */}
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        selectedLocation
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <MapPin
                        className={`w-5 h-5 shrink-0 ${
                          selectedLocation ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          selectedLocation ? "text-green-900" : "text-gray-600"
                        }`}
                      >
                        {selectedLocation || "Select a location"}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        selectedSubcategory
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <Briefcase
                        className={`w-5 h-5 shrink-0 ${
                          selectedSubcategory ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          selectedSubcategory ? "text-green-900" : "text-gray-600"
                        }`}
                      >
                        {selectedSubcategory ? `${selectedCategory?.name} - ${selectedSubcategory.name}` : "Select a service"}
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Link
                      href="/auth/register?type=provider"
                      className={`block w-full py-3 sm:py-4 text-center font-semibold rounded-lg transition-colors ${
                        selectedLocation && selectedSubcategory
                          ? "bg-primary-500 hover:bg-primary-400 text-navy-900"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/auth/login?type=provider"
                      className="block w-full py-3 sm:py-4 text-center font-semibold text-navy-900 border-2 border-navy-900 rounded-lg hover:bg-navy-50 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Benefits Section ─── */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
                Flexible work, at your fingertips
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find local jobs that fit your skills and schedule. With Doyo, you have the freedom and
                support to be your own boss.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Benefit 1 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Be your own boss</h3>
                <p className="text-gray-600">
                  Work how, when, and where you want. Offer services in 16+ categories and set a flexible
                  schedule and work area.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Set your own rates</h3>
                <p className="text-gray-600">
                  You keep 100% of what you charge, plus tips! Invoice and get paid directly through our
                  secure payment system.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Grow your business</h3>
                <p className="text-gray-600">
                  We connect you with clients in your area, and ways to market yourself — so you can focus on
                  what you do best.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ Section ─── */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
                Your questions, answered
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* FAQ Item 1 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    What's required to become a Tasker?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p className="font-medium text-navy-900">To become a Doyo service provider, you will need to meet the following requirements:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Be at least 18 years old</li>
                    <li>Be able to work in one of our active cities</li>
                    <li>Consent to an ID verification check to keep our platform safe for all users</li>
                    <li>Have a checking account with a financial institution for payments</li>
                    <li>Have a smartphone (iOS or Android) to manage your tasks through our app</li>
                    <li>Provide a valid Social Security number (US) or Social Insurance Number (Canada)</li>
                    <li>In some locations, pay a one-time registration fee to help us maintain service quality</li>
                    <li>In certain regions, you may need to submit a business license confirming you are a sole proprietor</li>
                  </ul>
                </div>
              </details>

              {/* FAQ Item 2 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    Do I need experience to task?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p>You can decide the categories in which you task and the skills you use. For some categories, you don't necessarily need previous experience (like Delivery or Errands). For other categories (like Minor Home Repairs, IKEA Assembly), you should have — or be able and willing to learn — the proper skills and tools to complete the tasks.</p>
                </div>
              </details>

              {/* FAQ Item 3 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    How do I get jobs?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p>Once you complete registration steps including creating your Doyo profile, make sure you set your work area and availability to show up in client search results. If you don't get task invitations, consider adjusting your rates, your work area, adding availability and additional categories, and editing your profile information to make sure it's clear to clients which services you offer.</p>
                </div>
              </details>

              {/* FAQ Item 4 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    How do I get paid?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p>Doyo uses direct deposit to pay service providers, so a valid checking account, routing or IBAN number, and billing address are required. During registration, you'll add your bank information and billing address to get paid through the app. Savings accounts, prepaid debit cards, and reloadable bank cards aren't valid, even if they accept direct deposits.</p>
                  <p className="text-sm">We take protecting your personal information seriously and use the latest encryption technologies available. Your information is never shared with third parties and is for internal use only.</p>
                </div>
              </details>

              {/* FAQ Item 5 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    Where does Doyo operate?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p>You can see the complete list of cities where Doyo operates in the location selector above during registration. We're currently active across the USA and Canada with plans to expand further.</p>
                </div>
              </details>

              {/* FAQ Item 6 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    What categories can I task in?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p>You can task in 16+ categories on Doyo and use a variety of skills on any given day. See the list of available categories in the selector above during registration. Whether you're skilled in handyman work, moving, cleaning, or countless other services, there's something for everyone on Doyo!</p>
                </div>
              </details>

              {/* FAQ Item 7 */}
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 transition-colors">
                  <span className="text-base sm:text-lg font-semibold text-navy-900">
                    How long does it take for my registration to be processed?
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 sm:px-6 py-4 text-gray-600 border border-t-0 border-gray-200 rounded-b-lg bg-white space-y-3">
                  <p>Processing time may vary by city, but most applicants are able to begin tasking within four business days of finishing registration. You'll receive a notification once your registration is processed. If we need additional information from you to process your registration, we will reach out.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="bg-navy-900 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to make money your way?
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of Taskers earning flexible income and building their own business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <Link
                href="/auth/register?type=provider"
                className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-400 text-navy-900 font-bold rounded-lg transition-colors"
              >
                Get Started Today
              </Link>
              <Link
                href="/auth/login?type=provider"
                className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

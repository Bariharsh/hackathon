"use client";

import Link from "next/link";

export default function Home() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6">

        <h1 className="text-2xl font-bold text-green-600">
          CoreInventory
        </h1>

        <div className="space-x-4">

          <Link
            href="/login"
            className="px-5 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </Link>

        </div>

      </div>


      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">

        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Smart Inventory Management
        </h1>

        <p className="text-gray-600 max-w-xl mb-8">
          CoreInventory helps businesses track products, manage stock,
          monitor warehouse activity, and streamline inventory operations
          with a modern and easy-to-use system.
        </p>

        <div className="space-x-4">

          <Link
            href="/signup"
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-8 py-3 border border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Login
          </Link>

        </div>

      </div>


      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 px-10 pb-16">

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Product Management
          </h3>
          <p className="text-gray-600 text-sm">
            Easily create and manage products, categories, and SKU codes
            within a centralized system.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Stock Tracking
          </h3>
          <p className="text-gray-600 text-sm">
            Track incoming and outgoing inventory in real-time across
            multiple warehouse locations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Smart Dashboard
          </h3>
          <p className="text-gray-600 text-sm">
            Get instant insights with dashboards showing stock levels,
            deliveries, and internal transfers.
          </p>
        </div>

      </div>

    </div>

  );
}
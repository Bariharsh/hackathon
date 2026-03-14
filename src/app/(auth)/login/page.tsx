"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {

    if (loginId === "admin" && password === "123456") {

      toast.success("Login Successful 🎉");

    } else {

      toast.error("Invalid Login ID or Password");

    }

  };

  return (

    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">

      <div className="w-[420px] bg-white p-10 rounded-2xl shadow-xl border border-gray-200">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-green-600 mb-2">
          CoreInventory
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Welcome back! Please login
        </p>

        {/* Form */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Enter Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Forgot Password */}
          <div className="flex justify-end text-sm">
            <Link
              href="/reset-password"
              className="text-green-600 font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={login}
            className="w-full bg-green-500 text-white font-semibold p-3 rounded-lg hover:bg-green-600 transition"
          >
            Sign In
          </button>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">

          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-green-600 font-medium hover:underline"
          >
            Create one
          </Link>

        </div>

      </div>

    </div>

  );
}
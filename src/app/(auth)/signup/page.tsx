"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {

    if(loginId && email && password){
      toast.success("Account Created 🎉");
    } else {
      toast.error("Please fill all fields");
    }

  };

  return(

    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">

      <div className="w-[420px] bg-white p-10 rounded-2xl shadow-xl border border-gray-200">

        <h1 className="text-4xl font-bold text-center text-green-600 mb-2">
          CoreInventory
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Create your account
        </p>

        <div className="space-y-5">

          <input
            placeholder="Enter Login ID"
            value={loginId}
            onChange={(e)=>setLoginId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <button
            onClick={signup}
            className="w-full bg-green-500 text-white font-semibold p-3 rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </button>

        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">

          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            Login
          </a>

        </div>

      </div>

    </div>

  );
}
"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    /* Check inputs */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password === "") {
      alert("Please fill password");
      return;
    }

    /* Login */
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/project/task');
    }
  };

return (
  /* Login form */
  <div className="bg-gray-100">
    <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm max-w-lg w-full">

        <div className="text-slate-900 text-center text-3xl font-semibold mb-6">Login</div>

        <form onSubmit={handleLogin} className="w-full mx-auto mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-900 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-slate-900 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
          
          <div className="w-full flex justify-center mt-6">
            <p className="text-center">Don&apos;t have an account?{" "}<Link href="/project/signup" className="text-blue-500 hover:underline">Register here</Link></p>
          </div>
          <div className="w-full flex justify-center mt-6">
            <p className="text-center"><Link href="/project/forgotpassword" className="text-blue-500 hover:underline">Reset password</Link></p>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}
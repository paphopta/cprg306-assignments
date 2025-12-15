"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
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
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    /* Add new user to Supabase */
    const { error } = await supabase.auth.signUp({
      email,
      password,
    },
    {
      emailRedirectTo: "https://cprg306-assignments-paphop.vercel.app/project/login",
    }
    );

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful. Check your email to confirm signup.");
      router.push('/project/login');
    }

    setLoading(false);
  };

return (
  /* Signup form */
  <div className="bg-gray-100">
    <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm max-w-lg w-full">

        <div className="text-slate-900 text-center text-3xl font-semibold mb-6">Sign Up</div>

        <form onSubmit={handleSignup} className="w-full mx-auto mt-4">
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

          <div className="mb-4">
            <label htmlFor="password" className="block text-slate-900 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          
          <div className="w-full flex justify-center mt-6">
            <p className="text-center">Have an account?{" "}<Link href="/project/login" className="text-blue-500 hover:underline">Login here</Link></p>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}
"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("access_token");

  const handleResetPassword = async (event) => {
    event.preventDefault();

    /* Check input */
    if (password === "") {
      alert("Please fill password");
      return;
    }

    setLoading(true);

    /* Set password */
    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: token }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => router.push("/project/login"), 2000);
    }

    setLoading(false);
  };

  return (
    /* Reset password form */
    <div className="bg-gray-100">
      <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm max-w-lg w-full">

        <div className="text-slate-900 text-center text-3xl font-semibold mb-6">Reset Password</div>
  
          <form onSubmit={handleResetPassword} className="w-full mx-auto mt-4">

            <div className="mb-4">
              <label htmlFor="email" className="block text-slate-900 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="New password"
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button
              className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useUserAuth } from "./_utils/auth-context";
import Link from "next/link";
 
export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  
  const handleLogin = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center text-center m-4">
      <p className="font-bold text-2xl my-2">Week 9</p>
      {!user ? (
        <div className="">
          <button type="submit" onClick={handleLogin} className="h-10 p-2 my-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"> 
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <div className="">
          <p className="my-2">Welcome, <strong>{user.displayName}</strong> ({user.email})</p>
          <p className="my-2"><Link href="./week-9/shopping-list">Go to Shopping List</Link></p>
          <button type="submit" onClick={handleLogout} className="h-10 p-2 my-2 rounded-lg text-white bg-red-500 hover:bg-red-600 cursor-pointer"> 
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
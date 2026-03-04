"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthStatus() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Checking login...</div>;

  if (user) {
    return (
      <div className="flex flex-row align-center justify-center space-x-4">
        <div className="py-2">Hello, {user.email}</div>
        <Link
          href={"/tasks"}
          className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 border font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700"
        >
          My Tasks
        </Link>
        <button
          onClick={logout}
          className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 border font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 border font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 border font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
      >
        Register
      </Link>
    </>
  );
}

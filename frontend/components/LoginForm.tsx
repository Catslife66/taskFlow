"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginInput, loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    try {
      await auth.login(values.email, values.password);
    } catch (e: any) {
      setError("root", { message: e?.message ?? "Login failed" });
    }
  }

  if (auth.loading || auth.user) return null;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your task manager
            </h1>
            {errors?.email && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {errors.email.message}
              </div>
            )}
            {errors?.password && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {errors.password.message}
              </div>
            )}
            {"root" in errors && errors.root?.message && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {errors.root.message}
              </div>
            )}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  autoComplete="off"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  autoComplete="off"
                  required={true}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

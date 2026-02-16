"use client";

import { useAuth } from "@/context/AuthContext";
import { ApiError, apiFetch } from "@/lib/api";
import { RegisterInput, registerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const REGISTER_API_PATH = "/api/auth/register";

export default function RegisterForm() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      await apiFetch(REGISTER_API_PATH, {
        method: "POST",
        json: values,
      });
      setSuccessMsg("You have succssfullly registered.");
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
      reset({ email: "", password: "" });
    } catch (e: any) {
      if (e instanceof ApiError) {
        if (e.status === 409)
          setError("root", {
            message: "We couldn’t create your account. Try logging in instead.",
          });
      } else {
        setError("root", { message: "Something went wrong" });
      }
    }
  }

  if (auth.loading || auth.user) return null;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            {successMsg && (
              <div className="rounded-lg bg-green-50 p-4 mb-4 text-green-800">
                {successMsg}
              </div>
            )}

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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  autoComplete="off"
                  required
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  autoComplete="new-password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isSubmitting ? "Creating an account..." : "Create an account"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href={{
                    pathname: "/login",
                  }}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

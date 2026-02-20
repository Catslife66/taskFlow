"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const qs = searchParams.toString();
      const current = qs ? `${pathName}?${qs}` : pathName;
      router.replace(`/login?next=${encodeURIComponent(current)}`);
    }
  }, [user, loading, router, pathName, searchParams]);

  if (loading) return <div>Checking user status...</div>;
  if (!user) return <div>Redirecting to login...</div>;

  return <>{children}</>;
}

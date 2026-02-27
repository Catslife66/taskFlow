import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />;
    </Suspense>
  );
}

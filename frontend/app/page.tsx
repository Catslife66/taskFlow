import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>HELLO, TASKFLOW!</h1>
      <LoginForm />
    </div>
  );
}

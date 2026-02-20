import Link from "next/link";
import AuthStatus from "./AuthStatus";

export default function Header() {
  return (
    <header>
      <nav className="fixed top-0 z-10 w-full h-16 bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="max-w-screen-xl flex justify-between items-center mx-auto">
          <Link href="/" className="flex items-center">
            <span className="self-center text-lg text-gray-800 font-semibold whitespace-nowrap dark:text-white">
              TaskManager
            </span>
          </Link>
          <div className="flex flex-row items-center">
            <AuthStatus />
          </div>
        </div>
      </nav>
    </header>
  );
}

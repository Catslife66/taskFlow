export default function SuccessToast({ msg }: { msg: string }) {
  return (
    <div className="flex items-center w-full max-w-sm p-4">
      <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 bg-green-50 rounded">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
      </div>
      <div className="ms-3 text-sm font-normal">{msg}</div>
    </div>
  );
}

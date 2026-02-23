export default function ErrorAlert({ errMsg }: { errMsg?: string }) {
  return (
    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
      {errMsg}
    </div>
  );
}

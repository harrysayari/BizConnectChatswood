"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 px-6 py-12 text-center">
      <h1 className="text-lg font-semibold text-slate-900">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-slate-600">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-council-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-council-800"
      >
        Try again
      </button>
    </div>
  );
}

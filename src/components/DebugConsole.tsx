"use client";

import { useEffect, useState } from "react";

export function DebugConsole() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(`Error: ${event.message}\nAt: ${event.filename}:${event.lineno}`);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(`Unhandled Rejection: ${event.reason}`);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9999] max-h-[40vh] overflow-auto bg-red-600 p-4 text-xs font-mono text-white shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-sm">Client Side Error Detected</strong>
        <button 
          onClick={() => setError(null)}
          className="bg-white text-red-600 px-2 py-1 rounded font-bold"
        >
          Close
        </button>
      </div>
      <pre className="whitespace-pre-wrap">{error}</pre>
    </div>
  );
}

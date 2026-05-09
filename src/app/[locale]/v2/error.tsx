"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type V2ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function V2Error({ error, reset }: V2ErrorProps) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("future-v2-error", {
        detail: { digest: error.digest, message: error.message },
      })
    );
  }, [error.digest, error.message]);

  return (
    <div className="grid min-h-[70vh] place-items-center p-6">
      <div className="max-w-xl rounded-md border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-700" />
        <h1 className="mt-4 text-2xl font-semibold text-slate-950">Future V2 recovered</h1>
        <p className="mt-3 text-sm leading-6 text-amber-800">
          The V2 error boundary caught this route failure and exposed a telemetry
          hook for Sentry or audit logging.
        </p>
        <Button className="mt-5 bg-cyan-600 text-white hover:bg-cyan-500" onClick={reset}>
          Retry route
        </Button>
      </div>
    </div>
  );
}

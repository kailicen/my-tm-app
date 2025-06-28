// src/app/review/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to today's date or a fallback page
    const today = new Date().toISOString().split("T")[0];
    router.replace(`/review/${today}`);
  }, [router]);

  return <div>Redirecting to today's review...</div>;
}

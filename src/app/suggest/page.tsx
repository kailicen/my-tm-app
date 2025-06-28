"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuggestPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to today's date or a fallback page
    const today = new Date().toISOString().split("T")[0];
    router.replace(`/suggest/${today}`);
  }, [router]);

  return <div>Redirecting to today's agenda...</div>;
}

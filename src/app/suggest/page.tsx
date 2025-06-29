"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuggestPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchLatestAgendaDate = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/agendas/dates`
        );
        const data = await res.json();

        if (data.dates && data.dates.length > 0) {
          const latestDate = data.dates[0]; // Assuming it's already sorted descending
          router.replace(`/suggest/${latestDate}`);
        } else {
          router.replace("/no-agenda"); // Fallback if no dates available
        }
      } catch (err) {
        console.error("Failed to fetch latest agenda date", err);
        router.replace("/error"); // Fallback on API error
      }
    };

    fetchLatestAgendaDate();
  }, [router]);

  return <div>Redirecting to the latest agenda...</div>;
}

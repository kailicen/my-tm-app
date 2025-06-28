"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrainCircuit, BarChart3, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [savedDates, setSavedDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchSavedDates = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/assignments/dates`
        );
        if (!res.ok) throw new Error("Failed to fetch dates");

        const data = await res.json();
        const dates = data.dates || [];
        setSavedDates(dates);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load saved assignments.");
      }
    };

    fetchSavedDates();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-0 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-zinc-100">
        Welcome to{" "}
        <span className="text-rose-500">Toastmasters Agenda Assistant</span>
      </h1>

      <p className="text-zinc-400 mb-6">
        This tool helps you assign roles, view member progress, and prepare
        meetings with ease.
      </p>

      <div className="space-y-4">
        <Link
          href="/suggest"
          className="block px-5 py-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow transition"
        >
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-rose-500" />
            <span className="font-medium">View Suggested Role Assignments</span>
          </div>
        </Link>

        <Link
          href="/members"
          className="block px-5 py-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow transition"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <span className="font-medium">View Member Progress</span>
          </div>
        </Link>
      </div>

      <div className="mt-10 border-t border-zinc-700 pt-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">
          Review Saved Assignments
        </h2>

        {savedDates.length > 0 ? (
          <ul className="space-y-2">
            {savedDates.map((date) => (
              <li key={date}>
                <Link
                  href={`/review/${date}`}
                  className="flex items-center gap-2 text-rose-500 hover:underline font-medium"
                >
                  <FileText className="w-4 h-4" />
                  {date}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500 italic">No saved assignments yet.</p>
        )}
      </div>
    </div>
  );
}

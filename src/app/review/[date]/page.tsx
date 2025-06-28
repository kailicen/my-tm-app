"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import toast from "react-hot-toast";

interface Assignment {
  Role: string;
  Assigned: string | null;
}

export default function Page({ params }: { params: { date: string } }) {
  const { date } = params;
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/assignments?meeting_date=${date}`
        );
        const data = await res.json();

        if (res.ok && data.data.length > 0) {
          setAssignments(data.data);
        } else {
          toast.error(`No saved assignments for ${date}`);
          router.replace(`/suggest/${date}`);
        }
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load assignments.");
        router.replace(`/suggest/${date}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [date, router]);

  if (loading)
    return (
      <div className="text-zinc-400 text-center mt-10">
        Loading assignments...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-0 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-6 text-zinc-100">
        Saved Assignments for <span className="text-rose-500">{date}</span>
      </h1>

      {assignments.length > 0 ? (
        <div className="overflow-x-auto text-sm">
          <table className="w-full border border-zinc-700 rounded-md overflow-hidden">
            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="text-left px-2 py-1 border-b border-zinc-700">
                  Role
                </th>
                <th className="text-left px-2 py-1 border-b border-zinc-700">
                  Assigned Member
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/50">
                  <td className="px-2 py-1 text-zinc-100">{item.Role}</td>
                  <td className="px-2 py-1 text-zinc-100">
                    {item.Assigned ? (
                      item.Assigned
                    ) : (
                      <span className="text-zinc-500 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 italic mt-4">
          No assignments found for this date.
        </p>
      )}

      <div className="flex justify-start mt-6">
        <Link
          href={`/suggest/${date}`}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition shadow"
        >
          <Edit3 className="w-4 h-4" />
          <span>Continue assigning (edit saved roles)</span>
        </Link>
      </div>
    </div>
  );
}

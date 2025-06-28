"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface MemberProgress {
  Name: string;
  Total: number;
  RecentRoles: string[];
  LastAssigned: string;
  Gap: string;
}

export default function MembersPage() {
  const [report, setReport] = useState<MemberProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("https://tm-api.fly.dev/members/progress");
        const data = await res.json();

        if (res.ok && data.report.length > 0) {
          setReport(data.report);
        } else {
          toast.error("No member progress found.");
        }
      } catch (err) {
        toast.error("Failed to load member progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-0">
      <h1 className="text-2xl font-bold mb-6 text-zinc-100">
        Member Progress Report
      </h1>

      <div className="overflow-x-auto text-sm">
        <table className="w-full border border-zinc-700 rounded-md overflow-hidden">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="text-left px-2 py-1 border-b border-zinc-700">
                Name
              </th>
              <th className="text-left px-2 py-1 border-b border-zinc-700">
                Total Roles
              </th>
              <th className="text-left px-2 py-1 border-b border-zinc-700">
                Recent Roles
              </th>
              <th className="text-left px-2 py-1 border-b border-zinc-700">
                Last Assigned
              </th>
              <th className="text-left px-2 py-1 border-b border-zinc-700">
                Gap
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map((member, idx) => (
              <tr key={idx} className="border-b border-zinc-800">
                <td className="px-2 py-1 text-zinc-100">{member.Name}</td>
                <td className="px-2 py-1 text-zinc-100">{member.Total}</td>
                <td className="px-2 py-1 text-zinc-100">
                  {member.RecentRoles.join(", ")}
                </td>
                <td className="px-2 py-1 text-zinc-100">
                  {member.LastAssigned}
                </td>
                <td className="px-2 py-1 text-zinc-100">{member.Gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

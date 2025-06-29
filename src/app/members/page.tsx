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
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "never">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/members/progress`
        );
        const data = await res.json();

        if (res.ok && data.report.length > 0) {
          setReport(data.report);
        } else {
          toast.error("No member progress found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load member progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading)
    return (
      <div className="text-zinc-400 text-center mt-10">
        Loading member progress...
      </div>
    );

  // Sorting: Inactive members first
  const sortedReport = [...report].sort((a, b) => {
    if (a.Gap.startsWith("✅") && !b.Gap.startsWith("✅")) return 1;
    if (!a.Gap.startsWith("✅") && b.Gap.startsWith("✅")) return -1;
    return a.Name.localeCompare(b.Name);
  });

  // Filtering
  const filteredReport = sortedReport.filter((member) => {
    if (filter === "all") return true;
    if (filter === "active") return member.Gap.startsWith("✅");
    if (filter === "inactive") return member.Gap.startsWith("❌");
    if (filter === "never") return member.Gap.startsWith("🚫");
    return true;
  });

  // Search
  const displayedReport = filteredReport.filter((member) =>
    member.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-0">
      <h1 className="text-2xl font-bold mb-6 text-zinc-100">
        Member Progress Report
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search members..."
          className="p-2 rounded bg-zinc-700 text-white w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${
              filter === "all" ? "bg-zinc-600" : "bg-zinc-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded ${
              filter === "active" ? "bg-green-700" : "bg-zinc-800"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-3 py-1 rounded ${
              filter === "inactive" ? "bg-yellow-700" : "bg-zinc-800"
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setFilter("never")}
            className={`px-3 py-1 rounded ${
              filter === "never" ? "bg-red-700" : "bg-zinc-800"
            }`}
          >
            Never Assigned
          </button>
        </div>
      </div>

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
            {displayedReport.map((member, idx) => (
              <tr
                key={idx}
                className={`border-b border-zinc-800 ${
                  member.Gap.startsWith("✅")
                    ? "bg-green-900/50"
                    : member.Gap.startsWith("❌")
                    ? "bg-yellow-900/50"
                    : "bg-red-900/50"
                }`}
              >
                <td className="px-2 py-1 text-zinc-100">{member.Name}</td>
                <td className="px-2 py-1 text-zinc-100">{member.Total}</td>
                <td className="px-2 py-1 text-zinc-100">
                  {member.RecentRoles.length > 0 ? (
                    member.RecentRoles.join(", ")
                  ) : (
                    <span className="text-zinc-500 italic">—</span>
                  )}
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

// SuggestedPage.tsx with react-select, localStorage hydration, multi-page routing

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";

// Types
interface AgendaItem {
  Role: string;
  Original: string;
  Primary: string;
  Backup: string;
}

export default function SuggestedPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const router = useRouter();
  const { date: selectedDate } = use(params); // ✅ New required unwrapping

  const [allDates, setAllDates] = useState<string[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [members, setMembers] = useState<string[]>([]);

  const STORAGE_KEY = `saved_assignments_${selectedDate}`;

  useEffect(() => {
    const fetchData = async () => {
      const agendaRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agenda/${selectedDate}`
      );

      const membersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/members`
      );

      const agendaData = await agendaRes.json();
      const membersData = await membersRes.json();

      setAllDates(agendaData.allDates);
      setAgenda(agendaData.agenda);
      setMembers(membersData);
    };

    fetchData();
  }, [selectedDate]);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && agenda.length > 0) {
      try {
        const savedAssignments = JSON.parse(saved);
        const updated = agenda.map((item, idx) => ({
          ...item,
          Primary: savedAssignments[idx]?.Primary || item.Primary,
        }));
        setAgenda(updated);
      } catch (e) {
        console.warn("Failed to restore assignments from storage.");
      }
    }
  }, [agenda.length]);

  const handleAssignmentChange = (idx: number, newValue: string | null) => {
    if (!newValue) return;
    const prevValue = agenda[idx].Primary;

    if (newValue === prevValue) return;

    const updated = [...agenda];

    const existingIndex = updated.findIndex(
      (item, i) => item.Primary === newValue && i !== idx
    );

    if (existingIndex !== -1) {
      updated[existingIndex].Primary = prevValue || "";
    } else {
      const backupIndex = updated.findIndex((item) => item.Backup === newValue);
      if (backupIndex !== -1) {
        updated[backupIndex].Backup = prevValue || "—";
      }
    }

    updated[idx].Primary = newValue;

    setAgenda(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSave = async () => {
    const payload = agenda.map((item) => ({
      meeting_date: selectedDate,
      role: item.Role,
      assigned: item.Primary,
    }));

    const savingToast = toast.loading("Saving assignments...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success("Assignments saved!", { id: savingToast });
      } else {
        toast.error("Error saving assignments.", { id: savingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.", { id: savingToast });
    }
  };

  const resetAssignments = () => {
    if (confirm("Reset to suggested assignments?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-0">
      <h1 className="text-2xl font-bold mb-6 text-zinc-100">
        Role Assignment Suggestions
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <label className="block mb-1 text-sm text-zinc-400">
            Select Meeting Date:
          </label>
          <select
            value={selectedDate}
            onChange={(e) => router.replace(`/suggest/${e.target.value}`)}
            className="bg-zinc-800 text-zinc-100 border border-zinc-700 px-3 py-2 rounded w-full sm:w-auto"
          >
            {allDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={resetAssignments}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700 hover:bg-zinc-700 transition shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Suggested</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto text-xs">
        <table className="w-full border border-zinc-700 rounded-md overflow-hidden">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="text-left p-1 border-b border-zinc-700">Role</th>
              <th className="text-left p-1 border-b border-zinc-700">
                Original
              </th>
              <th className="text-left p-1 border-b border-zinc-700">
                Assignment
              </th>
              <th className="text-left p-1 border-b border-zinc-700">Backup</th>
            </tr>
          </thead>
          <tbody>
            {agenda.map((item, idx) => (
              <tr key={idx} className="border-b border-zinc-800">
                <td className="p-1 text-zinc-100">{item.Role}</td>
                <td className="p-1 text-zinc-400">{item.Original || "—"}</td>
                <td className="p-1">
                  <Select
                    value={
                      item.Primary
                        ? { value: item.Primary, label: item.Primary }
                        : null
                    }
                    onChange={(option) =>
                      handleAssignmentChange(idx, option ? option.value : "")
                    }
                    options={members.map((m) => ({ value: m, label: m }))}
                    isClearable={false} // ✅ hides the cross
                    menuPlacement="auto" // ✅ helps mobile dropdown placement
                    className="w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "#27272a",
                        borderColor: "#3f3f46",
                        color: "#f4f4f5",
                        minHeight: "32px", // optional: make the input box shorter
                        fontSize: "12px", // ✅ smaller text
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: "#27272a",
                        color: "#f4f4f5",
                        fontSize: "12px", // ✅ smaller dropdown options
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: "#f4f4f5",
                        fontSize: "12px", // ✅ smaller selected text
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused
                          ? "#52525b"
                          : "#27272a",
                        color: "#f4f4f5",
                        fontSize: "12px", // ✅ smaller options
                      }),
                      input: (provided) => ({
                        ...provided,
                        color: "#f4f4f5",
                        fontSize: "12px", // ✅ smaller input text
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: "#a1a1aa",
                        fontSize: "12px", // ✅ smaller placeholder
                      }),
                    }}
                  />
                </td>
                <td className="p-1 text-zinc-400">{item.Backup || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition shadow"
        >
          <Save className="w-4 h-4" />
          <span>Save Assignments</span>
        </button>
      </div>
    </div>
  );
}

// c:\Obsidian\Ethyx\frontend\components\explain\PredictionTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { PredictionRow } from "./PredictionRow";
import type { IndividualPrediction } from "@/types/explain";

interface PredictionTableProps {
  rows: IndividualPrediction[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
}

export function PredictionTable({ rows, selectedId, onSelectRow }: PredictionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictionFilter, setPredictionFilter] = useState<string>("all");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter =
        predictionFilter === "all" ||
        row.prediction.toLowerCase() === predictionFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [rows, searchQuery, predictionFilter]);

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-[#00ADB5]/20 flex flex-col h-[calc(100vh-220px)]">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-[#3C494A]/30 bg-[#1C2128]/50 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AABBC4]" />
          <input
            type="text"
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#222831] border border-[#3C494A]/50 rounded-lg text-[#EEEEEE] placeholder-[#6B8090] focus:outline-none focus:border-[#00ADB5]/50 text-sm font-dm-sans"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AABBC4]" />
          <select
            value={predictionFilter}
            onChange={(e) => setPredictionFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#222831] border border-[#3C494A]/50 rounded-lg text-[#EEEEEE] focus:outline-none focus:border-[#00ADB5]/50 text-sm font-dm-sans appearance-none cursor-pointer"
          >
            <option value="all">All Outcomes</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#161c25] z-10 shadow-sm border-b border-[#3C494A]/50">
            <tr>
              <th className="px-6 py-3 font-orbitron text-[10px] tracking-widest text-[#AABBC4]">ID</th>
              <th className="px-6 py-3 font-orbitron text-[10px] tracking-widest text-[#AABBC4]">ENTITY</th>
              <th className="px-6 py-3 font-orbitron text-[10px] tracking-widest text-[#AABBC4]">OUTCOME</th>
              <th className="px-6 py-3 font-orbitron text-[10px] tracking-widest text-[#AABBC4]">CONFIDENCE</th>
              <th className="px-6 py-3 font-orbitron text-[10px] tracking-widest text-[#AABBC4]">BIAS RISK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3C494A]/10">
            {filteredRows.map((row) => (
              <PredictionRow
                key={row.id}
                row={row}
                isSelected={selectedId === row.id}
                onSelect={() => onSelectRow(row.id)}
              />
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#AABBC4] font-dm-sans">
                  No predictions matched your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

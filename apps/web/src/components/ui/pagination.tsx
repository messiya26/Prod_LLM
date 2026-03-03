"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
      <span className="text-white/20 text-xs">
        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-gold hover:bg-gold/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          <FaChevronLeft className="text-[10px]" />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-white/20 text-xs">...</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                currentPage === p ? "bg-gold/20 text-gold border border-gold/30" : "text-white/40 hover:text-gold hover:bg-gold/10"
              }`}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-gold hover:bg-gold/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}

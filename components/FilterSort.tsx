"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function FilterSort() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilter = searchParams.get("filter") || "all";
    const currentSort = searchParams.get("sort") || "desc";

    const handleFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("filter", filter);
        router.push(`/dashboard?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);
        router.push(`/dashboard?${params.toString()}`);
    };

    const filters = [
        { value: "all", label: "All Tasks" },
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "done", label: "Done" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter Pills */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Filter by Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => handleFilterChange(filter.value)}
                                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-150
                  ${currentFilter === filter.value
                                        ? "bg-blue-600 text-white shadow-md scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                                    }
                `}
                            >
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="lg:w-64">
                    <label
                        htmlFor="sort"
                        className="block text-sm font-medium text-gray-700 mb-3"
                    >
                        Sort by Due Date
                    </label>
                    <div className="relative">
                        <select
                            id="sort"
                            value={currentSort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer"
                        >
                            <option value="asc">Earliest First</option>
                            <option value="desc">Latest First</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

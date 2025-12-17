import React from 'react';
import { FilterStatus, SortOption } from '../types';
import { SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';

interface FilterBarProps {
  filter: FilterStatus;
  setFilter: (f: FilterStatus) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, sort, setSort, searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Segmented Control for Filters */}
        <div className="p-1 bg-gray-100/80 dark:bg-gray-900/50 rounded-xl inline-flex w-full sm:w-auto border border-gray-200 dark:border-gray-800">
          {(['all', 'pending', 'completed'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                filter === f
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative group w-full sm:w-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none block w-full sm:w-auto pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-gray-700"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ArrowUpDown className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
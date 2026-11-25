import type { ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export default function DataTable({ headers, children, className = '' }: DataTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
      </table>
    </div>
  );
}

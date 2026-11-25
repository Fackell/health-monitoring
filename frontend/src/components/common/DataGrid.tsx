interface DataGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function DataGrid({ children, className = '' }: DataGridProps) {
  return <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>{children}</div>;
}

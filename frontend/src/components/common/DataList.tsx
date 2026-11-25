interface DataListProps {
  items: {
    label: string;
    value: React.ReactNode;
  }[];
}

export default function DataList({ items }: DataListProps) {
  return (
    <dl className="mt-4 space-y-2 text-sm">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="inline font-medium">{item.label}: </dt>
          <dd className="inline">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

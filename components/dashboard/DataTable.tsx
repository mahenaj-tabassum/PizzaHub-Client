import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  minWidth?: string;
};

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  minWidth = "760px",
}: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead>
          <tr className="bg-secondary/10 text-muted-foreground">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn("px-4 py-3.5 font-medium", c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-t border-border">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn("px-4 py-4 align-middle", c.className)}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

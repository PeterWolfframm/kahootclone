import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

export interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  empty?: ReactNode;
  gridTemplate?: string;
}

/** Header row + hover-beige body. `gridTemplate` is a CSS grid-template-columns value. */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  empty,
  gridTemplate,
  className,
  ...rest
}: DataTableProps<T>) {
  const cols = gridTemplate ?? `repeat(${columns.length}, minmax(0, 1fr))`;
  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      <div className="type-label grid px-4 py-2.5" style={{ gridTemplateColumns: cols }}>
        {columns.map(c => (
          <div key={c.key} className={c.className}>
            {c.header}
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        empty ?? <div className="px-4 py-8 text-sm text-muted">No rows.</div>
      ) : (
        rows.map(row => (
          <div
            key={getRowKey(row)}
            className="grid items-center rounded-sm border-t-2 border-grey-100 px-4 py-4 transition-colors duration-fast ease-standard hover:bg-beige-50"
            style={{ gridTemplateColumns: cols }}
          >
            {columns.map(c => (
              <div key={c.key} className={c.className}>
                {c.render(row)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

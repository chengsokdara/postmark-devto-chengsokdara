import { WithNormalize } from "@/types/firestore.type";
import { EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React from "react";

type Column<T> = {
  key: string;
  label?: string;
  renderHeaderCell?: () => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderRowCell?: (row: T, index: number) => React.ReactNode;
  renderRow?: (row: T, index: number) => React.ReactNode;
};

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${NestedKeyOf<T[K]> & string}`
        : K & string;
    }[keyof T]
  : never;

type RaTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
};

/**
 * Renders a generic, customizable table using column definitions and row data.
 *
 * @template T - The shape of each row's data.
 * @param rows - The array of data rows.
 * @param columns - The configuration array that defines how to render each column.
 *
 * Each column can optionally define:
 * - `label`: the plain text to render in the header.
 * - `renderHeader`: a function that returns a full <th> element.
 * - `renderHeaderCell`: a function that returns the content for the header cell.
 * - `renderRow`: a function that returns a full <td> element.
 * - `renderRowCell`: a function that returns the content for a cell.
 *
 * @example
 * <RaTable
 *   rows={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]}
 *   columns={[
 *     { key: 'id', label: 'ID' },
 *     { key: 'name', label: 'Name', renderRow: (row) => <td>{row.name}</td> },
 *   ]}
 * />
 */
export function RaTable<T>({ rows, columns }: RaTableProps<T>) {
  return (
    <table className="table table-pin-rows table-pin-cols">
      <thead>
        <tr>
          {columns.map((column) =>
            column.renderHeader ? (
              column.renderHeader()
            ) : (
              <td key={column.key}>
                {column.renderHeaderCell
                  ? column.renderHeaderCell()
                  : column.label}
              </td>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-base-200">
            {columns.map((column) =>
              column.renderRow ? (
                column.renderRow(row, rowIndex)
              ) : (
                <td key={column.key}>
                  {column.renderRowCell
                    ? column.renderRowCell(row, rowIndex)
                    : ((row as any)[column.key] ?? "-")}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const defaultColumns = {
  index: {
    key: "index",
    label: "#",
    renderHeader: () => <th key="index">#</th>,
    renderRow: (_: any, idx: number) => <th key="index">{idx + 1}</th>,
  },
  viewButton: (urlFn: (id: string) => string) => ({
    key: "view",
    renderHeader: () => (
      <th key="view" className="p-1 text-center">
        ✨
      </th>
    ),
    renderRow: (row: any) => (
      <th key="view" className="px-1">
        <Link className="btn btn-circle btn-ghost" href={urlFn(row.id)}>
          <EyeIcon className="size-4" />
        </Link>
      </th>
    ),
  }),
};

// 1. key + label only
export function defineColumn<T>(
  key: keyof T | string,
  label: string,
): Column<WithNormalize<T>>;

// 2. key + renderHeader + renderRow
export function defineColumn<T>(
  key: keyof T | string,
  renderHeader: () => React.ReactNode,
  renderRow: (row: T, index: number) => React.ReactNode,
): Column<WithNormalize<T>>;

// 3. key + label + renderRow
export function defineColumn<T>(
  key: keyof T | string,
  label: string,
  renderRow: (row: T, index: number) => React.ReactNode,
): Column<WithNormalize<T>>;

// Implementation
export function defineColumn<T>(
  key: keyof T | string,
  second: string | (() => React.ReactNode),
  third?: (row: T, index: number) => React.ReactNode,
): Column<T> {
  if (typeof second === "function") {
    // form: key, renderHeader, renderRow
    return {
      key: String(key),
      renderHeader: second,
      renderRow: third!,
    };
  }

  if (typeof third === "function") {
    // form: key, label, renderRow
    return {
      key: String(key),
      label: second,
      renderRow: third,
    };
  }

  // form: key, label
  return {
    key: String(key),
    label: second,
  };
}

export function defineColumns<T>(columns: Column<T>[]): Column<T>[] {
  return columns;
}

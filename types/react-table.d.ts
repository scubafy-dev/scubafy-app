declare module '@tanstack/react-table' {
  export interface Row<T> {
    id: string;
    original: T;
    getValue: (columnId: string) => any;
    getIsSelected: () => boolean;
    getVisibleCells: () => any[];
    toggleSelected: (value: boolean) => void;
  }

  export interface Cell {
    id: string;
    column: {
      columnDef: {
        cell: any;
      };
    };
    getContext: () => any;
  }

  export interface HeaderGroup {
    id: string;
    headers: Header[];
  }

  export interface Header {
    id: string;
    isPlaceholder: boolean;
    column: {
      columnDef: {
        header: any;
      };
    };
    getContext: () => any;
  }

  export interface Column {
    id: string;
    getIsVisible: () => boolean;
    toggleVisibility: (value: boolean) => void;
  }

  export type ColumnDef<T> = any;
  export type ColumnFiltersState = any;
  export type SortingState = any;
  export type VisibilityState = any;
  export type TableOptions<T> = any;

  export const getCoreRowModel: any;
  export const getPaginationRowModel: any;
  export const getSortedRowModel: any;
  export const getFilteredRowModel: any;
  export const flexRender: any;
  export const useReactTable: any;
}

declare module '@radix-ui/react-icons' {
  export const CaretSortIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DotsHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>>;
} 
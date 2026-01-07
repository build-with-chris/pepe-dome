'use client'

import { useState, useMemo, ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

/**
 * DataTable component
 *
 * A reusable data table with:
 * - Sorting by columns
 * - Filtering/search
 * - Pagination
 * - Action buttons column
 */

export interface Column<T> {
  /** Column header text */
  header: string
  /** Key to access data from row object */
  accessorKey: keyof T | string
  /** Custom cell renderer */
  cell?: (row: T) => ReactNode
  /** Whether this column is sortable */
  sortable?: boolean
  /** Column width class */
  className?: string
  /** Hide on mobile */
  hideOnMobile?: boolean
}

interface DataTableProps<T> {
  /** Data to display */
  data: T[]
  /** Column definitions */
  columns: Column<T>[]
  /** Key extractor for rows */
  getRowKey: (row: T) => string
  /** Loading state */
  loading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Action buttons renderer */
  actions?: (row: T) => ReactNode
  /** Enable search */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Search keys - which fields to search in */
  searchKeys?: (keyof T)[]
  /** Pagination - current page */
  page?: number
  /** Pagination - total pages */
  totalPages?: number
  /** Pagination - items per page */
  pageSize?: number
  /** Pagination - total items */
  totalItems?: number
  /** Page change handler */
  onPageChange?: (page: number) => void
  /** Row click handler */
  onRowClick?: (row: T) => void
  /** Additional class names */
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

export default function DataTable<T extends object>({
  data,
  columns,
  getRowKey,
  loading = false,
  emptyMessage = 'No data found',
  actions,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  page = 1,
  totalPages = 1,
  pageSize = 20,
  totalItems,
  onPageChange,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return

    const key = column.accessorKey as string
    if (sortColumn === key) {
      // Toggle direction or clear
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(key)
      setSortDirection('asc')
    }
  }

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchQuery && searchKeys.length > 0) {
      const query = searchQuery.toLowerCase()
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const value = (row as Record<string, unknown>)[key as string]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query)
          }
          if (typeof value === 'number') {
            return value.toString().includes(query)
          }
          return false
        })
      )
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortColumn)
        const bValue = getNestedValue(b, sortColumn)

        if (aValue === bValue) return 0
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        const comparison = aValue < bValue ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [data, searchQuery, searchKeys, sortColumn, sortDirection])

  // Get nested value from object using dot notation
  function getNestedValue(obj: object, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj)
  }

  // Get cell value
  function getCellValue(row: T, column: Column<T>): ReactNode {
    if (column.cell) {
      return column.cell(row)
    }

    const value = getNestedValue(row, column.accessorKey as string)

    if (value === null || value === undefined) {
      return <span className="text-gray-600">-</span>
    }

    return String(value)
  }

  // Sort icon
  const SortIcon = ({ column }: { column: Column<T> }) => {
    if (!column.sortable) return null

    const isActive = sortColumn === column.accessorKey
    const direction = isActive ? sortDirection : null

    return (
      <span className="ml-2 inline-flex">
        {direction === 'asc' ? (
          <svg className="w-4 h-4 text-[#016dca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : direction === 'desc' ? (
          <svg className="w-4 h-4 text-[#016dca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
      </span>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {totalItems !== undefined && (
            <span className="text-sm text-gray-400">
              {totalItems.toLocaleString('de-DE')} items
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/5 border-b border-white/10 hover:bg-white/5">
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey as string}
                  className={cn(
                    'text-gray-400 font-medium',
                    column.sortable && 'cursor-pointer select-none hover:text-white',
                    column.hideOnMobile && 'hidden md:table-cell',
                    column.className
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.header}
                    <SortIcon column={column} />
                  </div>
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-gray-400 font-medium text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center text-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : processedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center text-gray-400"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  className={cn(
                    'border-b border-white/5 hover:bg-white/5 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.accessorKey as string}
                      className={cn(
                        'text-white',
                        column.hideOnMobile && 'hidden md:table-cell',
                        column.className
                      )}
                    >
                      {getCellValue(row, column)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {page} of {totalPages}
            {totalItems !== undefined && ` (${totalItems.toLocaleString('de-DE')} total)`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      'px-3 py-1 rounded-xl text-sm transition-colors',
                      page === pageNum
                        ? 'bg-[#016dca] text-black font-medium'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

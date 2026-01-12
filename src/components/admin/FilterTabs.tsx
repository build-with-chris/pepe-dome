'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * FilterTabs Component
 *
 * Reusable filter tabs for admin list pages.
 */

interface FilterItem {
  value: string
  label: string
}

interface FilterTabsProps {
  items: FilterItem[]
  currentValue?: string
  baseUrl: string
  paramName?: string
}

export function FilterTabs({
  items,
  currentValue = '',
  baseUrl,
  paramName = 'status',
}: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      {items.map((item) => {
        const isActive = currentValue === item.value
        const href = item.value
          ? `${baseUrl}?${paramName}=${item.value}`
          : baseUrl

        return (
          <Link
            key={item.value}
            href={href}
            className={cn(
              'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[#016dca] text-white shadow-lg shadow-[#016dca]/20'
                : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10'
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

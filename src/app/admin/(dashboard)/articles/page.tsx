'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Articles Admin Page
 *
 * Consistent spacing system:
 * - Section gaps: space-y-6
 * - Filter gaps: gap-4 (16px)
 */

interface Article {
  id: string
  slug: string
  title: string
  category: string
  author: string
  status: string
  featured: boolean
  publishedAt: string | null
  createdAt: string
}

interface PaginatedResponse {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const ARTICLE_CATEGORIES = [
  'Announcement',
  'News',
  'Feature',
  'Interview',
  'Review',
  'Behind the Scenes',
  'Events',
  'Community',
]

export default function ArticlesAdminPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter)

      const res = await fetch(`/api/admin/articles?${params}`)
      const data: PaginatedResponse = await res.json()
      setArticles(data.articles)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, categoryFilter])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  async function handleDelete() {
    if (!articleToDelete) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/articles/${articleToDelete.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete article')
      setDeleteDialogOpen(false)
      setArticleToDelete(null)
      fetchArticles(pagination.page)
    } catch (error) {
      console.error('Error deleting article:', error)
    } finally {
      setDeleting(false)
    }
  }

  function confirmDelete(article: Article) {
    setArticleToDelete(article)
    setDeleteDialogOpen(true)
  }

  // Table columns
  const columns: Column<Article>[] = [
    {
      header: 'Titel',
      accessorKey: 'title',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{row.title}</span>
          {row.featured && (
            <Badge variant="outline" className="text-[10px] bg-[#016dca]/10 text-[#016dca] border-[#016dca]/30">
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Kategorie',
      accessorKey: 'category',
      sortable: true,
      hideOnMobile: true,
      cell: (row) => <span className="text-white/60">{row.category}</span>,
    },
    {
      header: 'Autor',
      accessorKey: 'author',
      sortable: true,
      hideOnMobile: true,
      cell: (row) => <span className="text-white/60">{row.author}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Datum',
      accessorKey: 'publishedAt',
      sortable: true,
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-white/60">
          {new Date(row.publishedAt || row.createdAt).toLocaleDateString('de-DE')}
        </span>
      ),
    },
  ]

  // Row actions
  const actions = (row: Article) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/articles/${row.id}/edit`}>
        <Button variant="ghost" size="xs">
          Bearbeiten
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="xs"
        className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
        onClick={() => confirmDelete(row)}
      >
        Löschen
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Artikel"
        description={`${pagination.total} ${pagination.total === 1 ? 'Artikel' : 'Artikel'} insgesamt`}
        action={
          <Link href="/admin/articles/new">
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Artikel
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="DRAFT">Entwurf</SelectItem>
            <SelectItem value="PUBLISHED">Veröffentlicht</SelectItem>
            <SelectItem value="ARCHIVED">Archiviert</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {ARTICLE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={articles}
        columns={columns}
        getRowKey={(row) => row.id}
        loading={loading}
        emptyMessage="Keine Artikel gefunden"
        actions={actions}
        searchable
        searchPlaceholder="Artikel suchen..."
        searchKeys={['title', 'author']}
        page={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        onPageChange={(page) => fetchArticles(page)}
        onRowClick={(row) => router.push(`/admin/articles/${row.id}/edit`)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#111113] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">Artikel löschen</DialogTitle>
            <DialogDescription className="text-white/50">
              Sind Sie sicher, dass Sie den Artikel &quot;{articleToDelete?.title}&quot; löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Löschen...' : 'Artikel löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

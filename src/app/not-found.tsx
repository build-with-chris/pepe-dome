import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="section-hero flex items-center justify-center">
      <div className="stage-container text-center">
        <h1 className="display-1 mb-4">404</h1>
        <p className="lead text-pepe-gold mb-6">
          Seite nicht gefunden
        </p>
        <p className="body-lg text-pepe-t64 mb-8 max-w-lg mx-auto">
          Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              Zur Startseite
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary">
              Zu den Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

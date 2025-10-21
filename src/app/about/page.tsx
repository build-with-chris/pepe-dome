import { getAboutContent } from '@/lib/data'

export default function AboutPage() {
  const about = getAboutContent()

  return (
    <div className="section">
      <div className="stage-container max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="display-1 mb-4">{about.title}</h1>
          <p className="lead text-pepe-t80">
            {about.intro}
          </p>
        </header>

        <div className="card p-8 mb-12">
          <p className="body-lg text-pepe-t80">
            {about.story}
          </p>
        </div>

        <h2 className="h2 mb-8">Unsere Werte</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {about.values.map((value, index) => (
            <div key={index} className="card p-6">
              <h3 className="h4 mb-3">{value.title}</h3>
              <p className="text-pepe-t64">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h3 className="h3 mb-4">{about.team.title}</h3>
          <p className="text-pepe-t64">{about.team.description}</p>
        </div>
      </div>
    </div>
  )
}

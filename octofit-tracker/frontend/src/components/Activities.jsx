import { useEffect, useState } from 'react'
import { extractItems } from '../lib/api'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadActivities() {
      try {
        const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
        const apiBase =
          import.meta.env.VITE_API_BASE_URL?.trim() ||
          (codespaceName && codespaceName !== 'your-codespace-name'
            ? `https://${codespaceName}-8000.app.github.dev`
            : 'http://127.0.0.1:8000')
        const response = await fetch(`${apiBase}/api/activities/`)
        if (!response.ok) {
          throw new Error('Unable to fetch activities')
        }

        const payload = await response.json()
        if (isMounted) {
          setActivities(extractItems(payload))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unexpected error loading activities')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <h2>Activities</h2>
      <p className="text-muted">Recent sessions and performance snapshots.</p>
      {loading && <p>Loading activities…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {activities.map((activity) => (
            <div className="col" key={activity.id || activity._id || activity.date}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{activity.type}</h5>
                  <p className="card-text mb-1">Duration: {activity.durationMinutes} min</p>
                  <p className="card-text mb-1">Distance: {activity.distanceKm ?? '—'} km</p>
                  <p className="card-text">Calories: {activity.calories ?? '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Activities

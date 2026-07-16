import { useEffect, useState } from 'react'
import { buildApiUrl, extractItems } from '../lib/api'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadWorkouts() {
      try {
        const response = await fetch(buildApiUrl('workouts'))
        if (!response.ok) {
          throw new Error('Unable to fetch workouts')
        }

        const payload = await response.json()
        if (isMounted) {
          setWorkouts(extractItems(payload))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unexpected error loading workouts')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <h2>Workouts</h2>
      <p className="text-muted">Personalized training suggestions and plans.</p>
      {loading && <p>Loading workouts…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {workouts.map((workout) => (
            <div className="col" key={workout.id || workout._id || workout.title}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{workout.title}</h5>
                  <p className="card-text mb-1">Category: {workout.category}</p>
                  <p className="card-text mb-1">Duration: {workout.durationMinutes} min</p>
                  <p className="card-text">Equipment: {workout.equipment?.join(', ') || '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Workouts

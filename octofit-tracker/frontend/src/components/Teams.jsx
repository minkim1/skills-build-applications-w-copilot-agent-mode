import { useEffect, useState } from 'react'
import { buildApiUrl, extractItems } from '../lib/api'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTeams() {
      try {
        const response = await fetch(buildApiUrl('teams'))
        if (!response.ok) {
          throw new Error('Unable to fetch teams')
        }

        const payload = await response.json()
        if (isMounted) {
          setTeams(extractItems(payload))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unexpected error loading teams')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <h2>Teams</h2>
      <p className="text-muted">Group activity and training goals.</p>
      {loading && <p>Loading teams…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {teams.map((team) => (
            <div className="col" key={team.id || team._id || team.name}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text mb-1">Sport: {team.sport}</p>
                  <p className="card-text mb-1">City: {team.city}</p>
                  <p className="card-text">Members: {team.members?.join(', ') || '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Teams

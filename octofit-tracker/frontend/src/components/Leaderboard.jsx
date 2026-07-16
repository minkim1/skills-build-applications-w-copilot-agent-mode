import { useEffect, useState } from 'react'
import { extractItems } from '../lib/api'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadLeaderboard() {
      try {
        const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
        const apiUrl =
          import.meta.env.VITE_API_BASE_URL?.trim() ||
          (codespaceName && codespaceName !== 'your-codespace-name'
            ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard`
            : 'http://127.0.0.1:8000/api/leaderboard/')
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Unable to fetch leaderboard')
        }

        const payload = await response.json()
        if (isMounted) {
          setEntries(extractItems(payload))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unexpected error loading leaderboard')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <h2>Leaderboard</h2>
      <p className="text-muted">Competitive standings and streaks.</p>
      {loading && <p>Loading leaderboard…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Name</th>
                <th scope="col">Points</th>
                <th scope="col">Streak</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id || entry._id || entry.name}>
                  <td>{entry.rank}</td>
                  <td>{entry.name}</td>
                  <td>{entry.points}</td>
                  <td>{entry.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Leaderboard

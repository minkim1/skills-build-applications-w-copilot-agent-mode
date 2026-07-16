import { useEffect, useState } from 'react'
import { extractItems } from '../lib/api'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
        const apiUrl =
          import.meta.env.VITE_API_BASE_URL?.trim() ||
          (codespaceName && codespaceName !== 'your-codespace-name'
            ? `https://${codespaceName}-8000.app.github.dev/api/users`
            : 'http://127.0.0.1:8000/api/users/')
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Unable to fetch users')
        }

        const payload = await response.json()
        if (isMounted) {
          setUsers(extractItems(payload))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unexpected error loading users')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <h2>Users</h2>
      <p className="text-muted">Members tracked by the OctoFit platform.</p>
      {loading && <p>Loading users…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {users.map((user) => (
            <div className="col" key={user.id || user._id || user.email}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text mb-1">{user.email}</p>
                  <p className="card-text mb-1">Age: {user.age}</p>
                  <p className="card-text">Fitness level: {user.fitnessLevel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Users

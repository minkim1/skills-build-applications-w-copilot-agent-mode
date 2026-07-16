import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

function Home() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">OctoFit Tracker</h2>
        <p className="card-text">
          Monitor members, teams, activities, leaderboard performance, and workout plans from one dashboard.
        </p>
        <p className="text-muted small">
          Define VITE_CODESPACE_NAME in your .env.local file so the app can build the correct GitHub Codespaces API URL.
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="display-5">OctoFit presentation tier</h1>
        <p className="lead">React 19 + Vite + React Router connected to the backend API.</p>
      </header>

      <nav className="nav nav-pills flex-wrap mb-4">
        {navItems.map((item) => (
          <NavLink key={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  )
}

export default App

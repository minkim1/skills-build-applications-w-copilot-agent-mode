import express from 'express';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME?.trim();
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

const fallbackUsers = [{ id: '1', name: 'Ava', email: 'ava@example.com', age: 28, fitnessLevel: 'intermediate', isActive: true }];
const fallbackTeams = [{ id: '1', name: 'Rocket Squad', sport: 'running', city: 'Seattle', members: ['Ava', 'Kai'], weeklyGoal: '5k weekly' }];
const fallbackActivities = [{ id: '1', type: 'run', durationMinutes: 30, distanceKm: 5, calories: 320, date: new Date().toISOString() }];
const fallbackLeaderboard = [{ id: '1', name: 'Ava', rank: 1, points: 1200, streak: 7 }];
const fallbackWorkouts = [{ id: '1', title: 'Morning Mobility', category: 'mobility', durationMinutes: 20, difficulty: 'easy', equipment: ['mat'] }];

async function loadItems(model: any, fallback: any[]) {
  if (mongoose.connection.readyState !== 1) {
    return fallback;
  }

  try {
    return await model.find().lean();
  } catch (error) {
    console.warn('Falling back to in-memory data:', error);
    return fallback;
  }
}

async function createItem(model: any, fallback: any[], body: any) {
  if (mongoose.connection.readyState !== 1) {
    const item = { id: `${Date.now()}`, ...body };
    fallback.push(item);
    return item;
  }

  try {
    return await model.create(body);
  } catch (error) {
    console.warn('Falling back to in-memory data:', error);
    const item = { id: `${Date.now()}`, ...body };
    fallback.push(item);
    return item;
  }
}

async function startServer() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
  } catch (error) {
    console.warn('MongoDB not available; using in-memory fallback data:', error);
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', baseUrl, port, database: mongoose.connection.readyState === 1 ? 'octofit_db' : 'fallback' });
  });

  app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const items = await loadItems(User, fallbackUsers);
    res.json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, items });
  });

  app.post(['/api/users', '/api/users/'], async (req, res) => {
    const item = await createItem(User, fallbackUsers, req.body);
    res.status(201).json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, item });
  });

  app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const items = await loadItems(Team, fallbackTeams);
    res.json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, items });
  });

  app.post(['/api/teams', '/api/teams/'], async (req, res) => {
    const item = await createItem(Team, fallbackTeams, req.body);
    res.status(201).json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, item });
  });

  app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const items = await loadItems(Activity, fallbackActivities);
    res.json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, items });
  });

  app.post(['/api/activities', '/api/activities/'], async (req, res) => {
    const item = await createItem(Activity, fallbackActivities, req.body);
    res.status(201).json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, item });
  });

  app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const items = await loadItems(LeaderboardEntry, fallbackLeaderboard);
    res.json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, items });
  });

  app.post(['/api/leaderboard', '/api/leaderboard/'], async (req, res) => {
    const item = await createItem(LeaderboardEntry, fallbackLeaderboard, req.body);
    res.status(201).json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, item });
  });

  app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const items = await loadItems(Workout, fallbackWorkouts);
    res.json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, items });
  });

  app.post(['/api/workouts', '/api/workouts/'], async (req, res) => {
    const item = await createItem(Workout, fallbackWorkouts, req.body);
    res.status(201).json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, item });
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
  });
}

startServer();

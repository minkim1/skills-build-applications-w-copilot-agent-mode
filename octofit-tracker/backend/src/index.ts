import express from 'express';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function startServer() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', baseUrl, port, database: 'octofit_db' });
    });

    app.get(['/api/users', '/api/users/'], async (_req, res) => {
      const items = await User.find().lean();
      res.json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, items });
    });

    app.post(['/api/users', '/api/users/'], async (req, res) => {
      const item = await User.create(req.body);
      res.status(201).json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, item });
    });

    app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
      const items = await Team.find().lean();
      res.json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, items });
    });

    app.post(['/api/teams', '/api/teams/'], async (req, res) => {
      const item = await Team.create(req.body);
      res.status(201).json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, item });
    });

    app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
      const items = await Activity.find().populate('userId').lean();
      res.json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, items });
    });

    app.post(['/api/activities', '/api/activities/'], async (req, res) => {
      const item = await Activity.create(req.body);
      res.status(201).json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, item });
    });

    app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
      const items = await LeaderboardEntry.find().lean();
      res.json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, items });
    });

    app.post(['/api/leaderboard', '/api/leaderboard/'], async (req, res) => {
      const item = await LeaderboardEntry.create(req.body);
      res.status(201).json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, item });
    });

    app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
      const items = await Workout.find().lean();
      res.json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, items });
    });

    app.post(['/api/workouts', '/api/workouts/'], async (req, res) => {
      const item = await Workout.create(req.body);
      res.status(201).json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, item });
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit backend listening on port ${port}`);
      console.log(`API base URL: ${baseUrl}`);
    });
  } catch (error) {
    console.error('Error starting OctoFit backend:', error);
    process.exit(1);
  }
}

startServer();

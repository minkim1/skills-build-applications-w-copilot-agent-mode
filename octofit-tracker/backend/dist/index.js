"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("./models");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const fallbackUsers = [{ id: '1', name: 'Ava', email: 'ava@example.com', age: 28, fitnessLevel: 'intermediate', isActive: true }];
const fallbackTeams = [{ id: '1', name: 'Rocket Squad', sport: 'running', city: 'Seattle', members: ['Ava', 'Kai'], weeklyGoal: '5k weekly' }];
const fallbackActivities = [{ id: '1', type: 'run', durationMinutes: 30, distanceKm: 5, calories: 320, date: new Date().toISOString() }];
const fallbackLeaderboard = [{ id: '1', name: 'Ava', rank: 1, points: 1200, streak: 7 }];
const fallbackWorkouts = [{ id: '1', title: 'Morning Mobility', category: 'mobility', durationMinutes: 20, difficulty: 'easy', equipment: ['mat'] }];
async function loadItems(model, fallback) {
    if (mongoose_1.default.connection.readyState !== 1) {
        return fallback;
    }
    try {
        return await model.find().lean();
    }
    catch (error) {
        console.warn('Falling back to in-memory data:', error);
        return fallback;
    }
}
async function createItem(model, fallback, body) {
    if (mongoose_1.default.connection.readyState !== 1) {
        const item = { id: `${Date.now()}`, ...body };
        fallback.push(item);
        return item;
    }
    try {
        return await model.create(body);
    }
    catch (error) {
        console.warn('Falling back to in-memory data:', error);
        const item = { id: `${Date.now()}`, ...body };
        fallback.push(item);
        return item;
    }
}
async function startServer() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
    }
    catch (error) {
        console.warn('MongoDB not available; using in-memory fallback data:', error);
    }
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', baseUrl, port, database: mongoose_1.default.connection.readyState === 1 ? 'octofit_db' : 'fallback' });
    });
    app.get(['/api/users', '/api/users/'], async (_req, res) => {
        const items = await loadItems(models_1.User, fallbackUsers);
        res.json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, items });
    });
    app.post(['/api/users', '/api/users/'], async (req, res) => {
        const item = await createItem(models_1.User, fallbackUsers, req.body);
        res.status(201).json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, item });
    });
    app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
        const items = await loadItems(models_1.Team, fallbackTeams);
        res.json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, items });
    });
    app.post(['/api/teams', '/api/teams/'], async (req, res) => {
        const item = await createItem(models_1.Team, fallbackTeams, req.body);
        res.status(201).json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, item });
    });
    app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
        const items = await loadItems(models_1.Activity, fallbackActivities);
        res.json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, items });
    });
    app.post(['/api/activities', '/api/activities/'], async (req, res) => {
        const item = await createItem(models_1.Activity, fallbackActivities, req.body);
        res.status(201).json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, item });
    });
    app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
        const items = await loadItems(models_1.LeaderboardEntry, fallbackLeaderboard);
        res.json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, items });
    });
    app.post(['/api/leaderboard', '/api/leaderboard/'], async (req, res) => {
        const item = await createItem(models_1.LeaderboardEntry, fallbackLeaderboard, req.body);
        res.status(201).json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, item });
    });
    app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
        const items = await loadItems(models_1.Workout, fallbackWorkouts);
        res.json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, items });
    });
    app.post(['/api/workouts', '/api/workouts/'], async (req, res) => {
        const item = await createItem(models_1.Workout, fallbackWorkouts, req.body);
        res.status(201).json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, item });
    });
    app.listen(port, '0.0.0.0', () => {
        console.log(`OctoFit backend listening on port ${port}`);
        console.log(`API base URL: ${baseUrl}`);
    });
}
startServer();

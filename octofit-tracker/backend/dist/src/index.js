"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
const users = [{ id: '1', name: 'Ava', role: 'runner' }];
const teams = [{ id: '1', name: 'Rocket Squad', members: 4 }];
const activities = [{ id: '1', type: 'run', durationMinutes: 30 }];
const leaderboard = [{ rank: 1, user: 'Ava', points: 1200 }];
const workouts = [{ id: '1', title: 'Morning Mobility', difficulty: 'easy' }];
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', baseUrl, port });
});
app.get(['/api/users', '/api/users/'], (_req, res) => {
    res.json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, items: users });
});
app.post(['/api/users', '/api/users/'], (req, res) => {
    const user = { id: `${Date.now()}`, ...req.body };
    users.push(user);
    res.status(201).json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, item: user });
});
app.get(['/api/teams', '/api/teams/'], (_req, res) => {
    res.json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, items: teams });
});
app.post(['/api/teams', '/api/teams/'], (req, res) => {
    const team = { id: `${Date.now()}`, ...req.body };
    teams.push(team);
    res.status(201).json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, item: team });
});
app.get(['/api/activities', '/api/activities/'], (_req, res) => {
    res.json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, items: activities });
});
app.post(['/api/activities', '/api/activities/'], (req, res) => {
    const activity = { id: `${Date.now()}`, ...req.body };
    activities.push(activity);
    res.status(201).json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, item: activity });
});
app.get(['/api/leaderboard', '/api/leaderboard/'], (_req, res) => {
    res.json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, items: leaderboard });
});
app.post(['/api/leaderboard', '/api/leaderboard/'], (req, res) => {
    const entry = { rank: leaderboard.length + 1, ...req.body };
    leaderboard.push(entry);
    res.status(201).json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, item: entry });
});
app.get(['/api/workouts', '/api/workouts/'], (_req, res) => {
    res.json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, items: workouts });
});
app.post(['/api/workouts', '/api/workouts/'], (req, res) => {
    const workout = { id: `${Date.now()}`, ...req.body };
    workouts.push(workout);
    res.status(201).json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, item: workout });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
});

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
async function startServer() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        app.get('/api/health', (_req, res) => {
            res.json({ status: 'ok', baseUrl, port, database: 'octofit_db' });
        });
        app.get(['/api/users', '/api/users/'], async (_req, res) => {
            const items = await models_1.User.find().lean();
            res.json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, items });
        });
        app.post(['/api/users', '/api/users/'], async (req, res) => {
            const item = await models_1.User.create(req.body);
            res.status(201).json({ resource: 'users', apiUrl: `${baseUrl}/api/users/`, item });
        });
        app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
            const items = await models_1.Team.find().lean();
            res.json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, items });
        });
        app.post(['/api/teams', '/api/teams/'], async (req, res) => {
            const item = await models_1.Team.create(req.body);
            res.status(201).json({ resource: 'teams', apiUrl: `${baseUrl}/api/teams/`, item });
        });
        app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
            const items = await models_1.Activity.find().populate('userId').lean();
            res.json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, items });
        });
        app.post(['/api/activities', '/api/activities/'], async (req, res) => {
            const item = await models_1.Activity.create(req.body);
            res.status(201).json({ resource: 'activities', apiUrl: `${baseUrl}/api/activities/`, item });
        });
        app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
            const items = await models_1.LeaderboardEntry.find().lean();
            res.json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, items });
        });
        app.post(['/api/leaderboard', '/api/leaderboard/'], async (req, res) => {
            const item = await models_1.LeaderboardEntry.create(req.body);
            res.status(201).json({ resource: 'leaderboard', apiUrl: `${baseUrl}/api/leaderboard/`, item });
        });
        app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
            const items = await models_1.Workout.find().lean();
            res.json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, items });
        });
        app.post(['/api/workouts', '/api/workouts/'], async (req, res) => {
            const item = await models_1.Workout.create(req.body);
            res.status(201).json({ resource: 'workouts', apiUrl: `${baseUrl}/api/workouts/`, item });
        });
        app.listen(port, '0.0.0.0', () => {
            console.log(`OctoFit backend listening on port ${port}`);
            console.log(`API base URL: ${baseUrl}`);
        });
    }
    catch (error) {
        console.error('Error starting OctoFit backend:', error);
        process.exit(1);
    }
}
startServer();

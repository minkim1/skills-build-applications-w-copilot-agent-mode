"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = exports.LeaderboardEntry = exports.Activity = exports.Team = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    fitnessLevel: { type: String, required: true },
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const TeamSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    sport: { type: String, required: true },
    city: { type: String, required: true },
    members: [{ type: String, required: true }],
    weeklyGoal: { type: String, required: true },
}, { timestamps: true });
const ActivitySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    distanceKm: Number,
    calories: Number,
    date: { type: Date, default: Date.now },
}, { timestamps: true });
const LeaderboardEntrySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rank: { type: Number, required: true },
    points: { type: Number, required: true },
    streak: { type: Number, required: true },
}, { timestamps: true });
const WorkoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, required: true },
    equipment: [{ type: String, required: true }],
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', UserSchema);
exports.Team = mongoose_1.default.model('Team', TeamSchema);
exports.Activity = mongoose_1.default.model('Activity', ActivitySchema);
exports.LeaderboardEntry = mongoose_1.default.model('LeaderboardEntry', LeaderboardEntrySchema);
exports.Workout = mongoose_1.default.model('Workout', WorkoutSchema);

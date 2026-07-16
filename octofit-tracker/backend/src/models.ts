import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  fitnessLevel: string;
  teamId?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  sport: string;
  city: string;
  members: string[];
  weeklyGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity extends Document {
  userId: Types.ObjectId;
  type: string;
  durationMinutes: number;
  distanceKm?: number;
  calories?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaderboardEntry extends Document {
  userId: Types.ObjectId;
  name: string;
  rank: number;
  points: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkout extends Document {
  title: string;
  category: string;
  durationMinutes: number;
  difficulty: string;
  equipment: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  fitnessLevel: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  city: { type: String, required: true },
  members: [{ type: String, required: true }],
  weeklyGoal: { type: String, required: true },
}, { timestamps: true });

const ActivitySchema = new Schema<IActivity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  distanceKm: Number,
  calories: Number,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rank: { type: Number, required: true },
  points: { type: Number, required: true },
  streak: { type: Number, required: true },
}, { timestamps: true });

const WorkoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  difficulty: { type: String, required: true },
  equipment: [{ type: String, required: true }],
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
export const Team = mongoose.model<ITeam>('Team', TeamSchema);
export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
export const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema);

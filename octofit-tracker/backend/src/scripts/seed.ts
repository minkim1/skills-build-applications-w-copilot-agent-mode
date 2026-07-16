import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const createdUsers = await User.insertMany([
      {
        name: 'Ava Chen',
        email: 'ava.chen@example.com',
        age: 29,
        fitnessLevel: 'advanced',
        isActive: true,
      },
      {
        name: 'Mateo Alvarez',
        email: 'mateo.alvarez@example.com',
        age: 34,
        fitnessLevel: 'intermediate',
        isActive: true,
      },
      {
        name: 'Nia Brooks',
        email: 'nia.brooks@example.com',
        age: 26,
        fitnessLevel: 'beginner',
        isActive: true,
      },
    ]);

    const createdTeams = await Team.insertMany([
      {
        name: 'Rocket Squad',
        sport: 'running',
        city: 'Seattle',
        members: ['Ava Chen', 'Mateo Alvarez', 'Nia Brooks'],
        weeklyGoal: 'Complete 4 group runs',
      },
      {
        name: 'Peak Performers',
        sport: 'cycling',
        city: 'Denver',
        members: ['Liam Ortiz', 'Sage Patel'],
        weeklyGoal: 'Log 200 km this week',
      },
    ]);

    await Activity.insertMany([
      {
        userId: createdUsers[0]._id,
        type: 'run',
        durationMinutes: 42,
        distanceKm: 8.4,
        calories: 510,
        date: new Date('2026-07-14T06:30:00Z'),
      },
      {
        userId: createdUsers[1]._id,
        type: 'strength',
        durationMinutes: 55,
        calories: 420,
        date: new Date('2026-07-15T18:00:00Z'),
      },
      {
        userId: createdUsers[2]._id,
        type: 'yoga',
        durationMinutes: 30,
        calories: 180,
        date: new Date('2026-07-16T07:15:00Z'),
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        userId: createdUsers[0]._id,
        name: 'Ava Chen',
        rank: 1,
        points: 1420,
        streak: 8,
      },
      {
        userId: createdUsers[1]._id,
        name: 'Mateo Alvarez',
        rank: 2,
        points: 1310,
        streak: 5,
      },
      {
        userId: createdUsers[2]._id,
        name: 'Nia Brooks',
        rank: 3,
        points: 1180,
        streak: 3,
      },
    ]);

    await Workout.insertMany([
      {
        title: 'Morning Mobility Flow',
        category: 'mobility',
        durationMinutes: 20,
        difficulty: 'easy',
        equipment: ['mat'],
      },
      {
        title: 'Hill Interval Run',
        category: 'cardio',
        durationMinutes: 35,
        difficulty: 'hard',
        equipment: ['running shoes'],
      },
      {
        title: 'Upper Body Strength',
        category: 'strength',
        durationMinutes: 45,
        difficulty: 'medium',
        equipment: ['dumbbells', 'bench'],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

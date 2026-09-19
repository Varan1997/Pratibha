import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const run = async () => {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@school.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await User.create({ name: 'Administrator', email, password, role: 'admin' });
    console.log(`Admin created: ${email} / ${password}`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const run = async () => {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@school.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
  const phone = process.env.SEED_ADMIN_PHONE || '7893858514';

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.phone !== phone) {
      existing.phone = phone;
      await existing.save();
      console.log(`Admin already exists: ${email} (phone updated to ${phone})`);
    } else {
      console.log(`Admin already exists: ${email}`);
    }
  } else {
    await User.create({ name: 'Administrator', email, password, role: 'admin', phone });
    console.log(`Admin created: ${email} / ${password} (phone: ${phone})`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

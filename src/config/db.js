import dns from 'dns';
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment');
  }

  // Some local networks block Node's direct DNS queries needed to resolve
  // mongodb+srv:// records even though the OS resolver works fine. Set
  // DNS_SERVERS (comma-separated) to override, e.g. DNS_SERVERS=8.8.8.8,1.1.1.1
  if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  await mongoose.connect(uri);
};

import mongoose from 'mongoose';

export const isDbConfigured = () => Boolean(process.env.MONGO_DB);

// Reuse one connection across hot reloads and route invocations.
const cached = globalThis.__mongoose ?? (globalThis.__mongoose = { conn: null, promise: null });

export const connectDB = async () => {
    if (!isDbConfigured()) {
        throw new Error('MONGO_DB is not set');
    }
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_DB, { serverSelectionTimeoutMS: 5000 })
            .catch((error) => {
                cached.promise = null;
                console.log('MONGO ERROR CONNECTION:', error);
                throw error;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
export default connectDB;
